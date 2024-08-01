import { Module } from '@nestjs/common';
import { WorkoutsController } from './workouts.controller';
import { QueryHandlers } from './queries';

@Module({
  controllers: [WorkoutsController],
  providers: [...QueryHandlers]
})
export class WorkoutsModule {}
