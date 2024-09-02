import { Module } from '@nestjs/common';
import { WorkoutsModule } from './domain/workouts/workouts.module';
import { StatisticsModule } from './domain/statistics/statistics.module';

@Module({
  imports: [WorkoutsModule, StatisticsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
