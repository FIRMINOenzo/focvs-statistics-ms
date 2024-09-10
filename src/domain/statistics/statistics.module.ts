import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/config/db';
import { StatisticsController, StatisticsService } from './';

@Module({
  imports: [PrismaModule],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
