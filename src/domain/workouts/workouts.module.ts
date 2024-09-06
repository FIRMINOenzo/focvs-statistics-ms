import { Module } from '@nestjs/common';
import { WorkoutsService } from './workouts.service';
import { WorkoutsHttpController } from './workouts.http.controller';
import { WorkoutsEventsController } from './workouts.events.controller';
import { PrismaModule } from '../../config/db/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [WorkoutsHttpController, WorkoutsEventsController],
  providers: [WorkoutsService],
})
export class WorkoutsModule {}
