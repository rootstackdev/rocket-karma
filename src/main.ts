import path from 'path';

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';

let app: NestExpressApplication;

const startServer = async (): Promise<void> => {
  app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(path.join(__dirname, ''));

  await app.listen(process.env.KARMA_PORT || 3000);
};

const stopServer = async (): Promise<void> => {
  if (!app)
    return;

  await app.close();

  process.exit();
};

if (require.main === module) {
  (async (): Promise<void> => {
    await startServer();

    process.on('SIGINT', stopServer);
    process.on('SIGTERM', stopServer);
  })();
}
