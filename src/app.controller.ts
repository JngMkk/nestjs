import { Controller, Get, Header, Redirect, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor(private configService: ConfigService) {}

  @Header('X-Custom', 'test')
  @Get()
  getHello(@Req() req: Request): string {
    console.log(req);

    const message = this.configService.get<string>('MESSAGE');

    return message;
  }

  // Redirect로 정해진 응답 코드가 아닐 경우 브라우저가 제대로 반응하지 않을 수 있음.
  @Redirect('https://naver.com', 301)
  @Get('/redirect')
  redirectToNaver() {}
}
