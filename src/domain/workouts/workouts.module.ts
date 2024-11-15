import { Module } from '@nestjs/common';
import { WorkoutsService } from './workouts.service';
import { WorkoutsHttpController } from './workouts.http.controller';
import { WorkoutsEventsController } from './workouts.events.controller';
import { PrismaModule } from '../../config/db/prisma/prisma.module';
import { env } from 'src/shared/env';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    PrismaModule,
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
  controllers: [WorkoutsHttpController, WorkoutsEventsController],
  providers: [WorkoutsService],
  exports: [WorkoutsService],
})
export class WorkoutsModule {}
