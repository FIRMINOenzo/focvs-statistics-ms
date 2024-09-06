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
import { ClientsModule, Transport } from '@nestjs/microservices';
import { env } from './shared/env';

@Module({
  imports: [
    FocvsSharedStuffModule,
    ConfigModule.forRoot(),
    WorkoutsModule,
    StatisticsModule,
    ClientsModule.register([
      {
        name: 'WORKOUTS_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: env.redis.host,
          port: env.redis.port,
        },
      },
    ]),
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
