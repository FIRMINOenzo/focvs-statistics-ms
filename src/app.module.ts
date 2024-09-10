import { Module } from '@nestjs/common';
import { APP_GUARD, Reflector } from '@nestjs/core';
import {
  AuthGuard,
  FocvsSharedStuffModule,
  JwtService,
} from '@PedroCavallaro/focvs-utils';
import { ConfigModule } from '@nestjs/config';
import { env } from './shared/env';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { StatisticsModule } from './domain/statistics/statistics.module';
import { WorkoutsModule } from './domain/workouts/workouts.module';

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
