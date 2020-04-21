import { Controller, Get } from '@nestjs/common';

import { KarmaService } from './karma.service';

@Controller('karma')
export class KarmaController {

  constructor(
    private readonly karmaService: KarmaService
  ) {}

  @Get()
  async getIndex(): Promise<string> {
    const users = await this.karmaService.getUsers();

    // TODO: Bad. Use a templating system instead.

    const userRows = users.reduce((accum, user) => accum + `<tr><td>${user.username}</td><td>${user.kudos}</td></tr>`, '');

    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <style>
            body {
              width: 100%;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
            }

            table {
              border-radius: 4px;
              box-shadow: 0 8px 17px 0 rgba(0, 0, 0, 0.05), 0 6px 20px 0 rgba(0, 0, 0, 0.1);
              border-collapse: collapse;
              border-spacing: 0;
            }

            td, th {
              padding: 16px;
              margin: 0;
            }

            tr:nth-child(even) {
              background-color: #FED;
            }
          </style>
        </head>
        <body>
          <table>
            <tr><th>User</th><th>Kudos</th></tr>
            ${userRows}
          </table>
        </body>
      </html>
    `;
  }

}
