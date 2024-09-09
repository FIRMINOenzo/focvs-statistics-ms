import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { PrismaService } from 'src/config/db/prisma/prisma.service';

@Module({
  imports: [PrismaService],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
