import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import dotenv from 'dotenv';
import { Model } from 'mongoose';

import { KarmaConfiguration } from './karma-configuration';
import { KarmaUser, KarmaUserDocument } from './karma-user.model';

dotenv.config();

@Injectable()
export class KarmaService {

  constructor(
    @InjectModel('KarmaUser') private readonly karmaUserSchema: Model<KarmaUserDocument>
  ) {}

  public readonly configuration: KarmaConfiguration = Object.freeze({
    host: process.env.KARMA_HOST,
    username: process.env.KARMA_USERNAME,
    password: process.env.KARMA_PASSWORD,
    rooms: (process.env.KARMA_ROOMS || 'karma-testing').split('|'),

    karmaCommandPrefix: 'karma',
    kudoCommandPattern: /@[\w.\s]*(\+){2,}/g,
    maxKudosPerCommand: 10,

    kudoAwardMessage: ':tada: Awarding {{kudos}} kudo(s) to @{{username}}! Total kudos: {{totalKudos}}',
    selfKudoMessage: 'Unfortunately, you cannot give kudos to yourself :slight_frown:',
    botKudoMessage: 'Robots don\'t need kudos, give them to somebody else!'
  });

  public async addKudos(username: string, amount: number): Promise<void> {
    amount = Math.abs(amount);
    amount = amount <= this.configuration.maxKudosPerCommand ? amount : this.configuration.maxKudosPerCommand;

    const user = await this.getUserRecord(username);

    user.kudos += amount;

    await user.save();
  }

  public async getKudos(username: string): Promise<number> {
    const user = await this.getUserRecord(username);
    return user.kudos;
  }

  // TODO: Allow limits and pagination.
  public async getUsers(): Promise<KarmaUser[]> {
    const userRecords = await this.karmaUserSchema
      .find({})
      .sort('-kudos')

    return userRecords.map((record) => ({
      username: record.username,
      kudos: record.kudos
    }));
  }

  private async getUserRecord(username: string): Promise<KarmaUserDocument> {
    let user = await this.karmaUserSchema.findOne({ username });

    if (!user) {
      user = await this.karmaUserSchema.create({ username });
    }

    return user;
  }

}
