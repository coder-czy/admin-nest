import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { BaseController } from './base.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        secret: config.get('jwt.secretkey'),
        signOptions: {
          expiresIn: config.get('jwt.expiresin'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [BaseController, UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
