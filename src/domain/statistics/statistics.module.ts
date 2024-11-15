import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/config/db';
import { StatisticsController, StatisticsService } from './';
import { WorkoutsModule } from '../workouts';

@Module({
  imports: [PrismaModule, WorkoutsModule],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
