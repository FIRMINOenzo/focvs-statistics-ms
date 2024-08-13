import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { PrismaModule } from 'src/prisma/prisma.module';
import { WorkoutsController } from './workouts.controller';
import { CommandHandlers } from './commands';
import { QueryHandlers } from './queries';

@Module({
  imports: [CqrsModule, PrismaModule],
  controllers: [WorkoutsController],
  providers: [...QueryHandlers, ...CommandHandlers],
})
export class WorkoutsModule {}
