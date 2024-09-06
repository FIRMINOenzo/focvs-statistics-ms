import { Module } from '@nestjs/common';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { WorkoutsModule } from './domain/workouts/workouts.module';
import { StatisticsModule } from './domain/statistics/statistics.module';
import {
  AuthGuard,
  FocvsSharedStuffModule,
  JwtService,
} from '@PedroCavallaro/focvs-utils';

@Module({
  imports: [FocvsSharedStuffModule, WorkoutsModule, StatisticsModule],
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
