import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { BlogModule } from './modules/blog/blog.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), BlogModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
