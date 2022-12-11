import { Module } from '@nestjs/common';
import { MailHelper } from 'src/helpers/mail';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, MailHelper],
})
export class AuthModule {}
