import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { KarmaModule } from './karma/karma.module';

@Module({
  controllers: [ AppController ],
  imports: [
    MongooseModule.forRoot(process.env.KARMA_DATABASE_HOST),
    KarmaModule,
  ],
})
export class AppModule {
}
