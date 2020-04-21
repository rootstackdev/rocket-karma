import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {

  // TODO This is just sample behavior and should be expanded in the future.
  @Get()
  getIndex(): string {
    return 'Congratulations, your app is running properly.';
  }

}
