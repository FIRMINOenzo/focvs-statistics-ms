import { Module } from '@nestjs/common';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { WorkoutsModule } from './domain/workouts/workouts.module';
import { StatisticsModule } from './domain/statistics/statistics.module';
import {
  AuthGuard,
  FocvsSharedStuffModule,
  JwtService,
} from '@PedroCavallaro/focvs-utils';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    FocvsSharedStuffModule,
    ConfigModule.forRoot(),
    WorkoutsModule,
    StatisticsModule,
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
