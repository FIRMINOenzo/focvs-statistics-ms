import { Module } from '@nestjs/common';
import { WorkoutsModule } from './workouts/workouts.module';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import {
  AuthGuard,
  FocvsSharedStuffModule,
  JwtService,
} from '@PedroCavallaro/focvs-utils';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    FocvsSharedStuffModule,
    WorkoutsModule,
    PrismaModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useFactory: (jwtService: JwtService) =>
        new AuthGuard(jwtService, new Reflector()),
      inject: [JwtService],
    },
  ],
})
export class AppModule {}
