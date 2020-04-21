import {
  Module,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { driver as RocketChatDriver } from '@rocket.chat/sdk';
import { IMessage } from '@rocket.chat/sdk/dist/config/messageInterfaces';
import Handlebars, { TemplateDelegate } from 'handlebars';

import { KarmaUserSchema } from './karma-user.model';
import { KarmaService } from './karma.service';
import { KarmaConfiguration } from './karma-configuration';
import { KarmaController } from './karma.controller';

@Module({
  controllers: [ KarmaController ],
  imports: [ MongooseModule.forFeature([ { name: 'KarmaUser', schema: KarmaUserSchema } ] ) ],
  providers: [ KarmaService ],
})
export class KarmaModule implements OnModuleDestroy, OnModuleInit {

  private botUserId: string;
  private configuration: KarmaConfiguration;
  private createKudoAwardMessage: TemplateDelegate;

  constructor(
    private readonly karmaService: KarmaService,
  ) {
    this.configuration = karmaService.configuration;
    this.createKudoAwardMessage = Handlebars.compile(this.configuration.kudoAwardMessage);
  }

  public async onModuleInit(): Promise<void> {
    await this.startBot();
  }

  public async onModuleDestroy(): Promise<void> {
    await this.stopBot();
  }

  public async startBot(): Promise<void> {
    await RocketChatDriver.connect({
      host: this.configuration.host,
      useSsl: true,
    });

    this.botUserId = await RocketChatDriver.login({
      username: this.configuration.username,
      password: this.configuration.password,
    });

    await RocketChatDriver.joinRooms(this.configuration.rooms);
    await RocketChatDriver.subscribeToMessages();
    await RocketChatDriver.reactToMessages((err, message) => this.processMessage(err, message));
  }

  public async stopBot(): Promise<void> {
    RocketChatDriver.unsubscribeAll();
    await RocketChatDriver.logout();
    await RocketChatDriver.disconnect();
  }

  public async processMessage(err: Error | null, message: IMessage): Promise<void> {
    if (err)
      return;
    // TODO: Reply messages are not being filtered out.
    if (message.editedAt || message.editedBy || message.reactions)
      return;
    if (message.u._id === this.botUserId)
      return;

    await this.processKudoCommand(message);
    await this.processKarmaDirectCommand(message);
  }

  public async awardKudos(username: string, kudos: number, room: string): Promise<void> {
    await this.karmaService.addKudos(username, kudos);

    const maxKudos = this.configuration.maxKudosPerCommand;

    const message = this.createKudoAwardMessage({
      kudos: kudos > maxKudos ? maxKudos : kudos,
      username,
      totalKudos: await this.karmaService.getKudos(username),
    });

    await RocketChatDriver.sendToRoom(message, room);
  }

  private async processKudoCommand(message: IMessage): Promise<void> {
    const room = await RocketChatDriver.getRoomName(message.rid);
    const kudoMatches = message.msg.match(this.configuration.kudoCommandPattern);

    if (!room || !kudoMatches)
      return;

    await Promise.all(kudoMatches.map((match: string) => (async () => {
      const username = match.split('+')[0].replace('@', '').trim();
      const kudos = match.split('+').length - 2;

      if (!username) {
        return;
      }
      if (username === message.u.username) {
        await RocketChatDriver.sendToRoom(this.configuration.selfKudoMessage, room);
        return;
      }
      if (username === this.configuration.username) {
        await RocketChatDriver.sendToRoom(this.configuration.botKudoMessage, room);
        return;
      }

      await this.awardKudos(username, kudos, room);
    })()));
  }

  private async processKarmaDirectCommand(message: IMessage): Promise<void> {
    const room = await RocketChatDriver.getRoomName(message.rid);
    const username = message.u.username;
    const command = message.msg.trim();

    if (room)
      return;

    if (command === 'kudos') {
      const kudos = await this.karmaService.getKudos(username);
      await RocketChatDriver.sendDirectToUser(`You have ${kudos} kudos.`, username);
    }
  }

}
