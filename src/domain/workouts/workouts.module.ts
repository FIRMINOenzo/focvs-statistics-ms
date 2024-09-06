import { Module } from '@nestjs/common';
import { WorkoutsService } from './workouts.service';
import { WorkoutsHttpController } from './workouts.http.controller';
import { WorkoutsEventsController } from './workouts.events.controller';

@Module({
  controllers: [WorkoutsHttpController, WorkoutsEventsController],
  providers: [WorkoutsService],
})
export class WorkoutsModule {}
