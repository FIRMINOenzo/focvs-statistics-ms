import { Module } from '@nestjs/common'
import { WorkoutsService } from './workouts.service'
import { WorkoutsHttpController } from './workouts.http.controller'
import { PrismaModule } from '../../config/db/prisma.module'

@Module({
  imports: [PrismaModule],
  controllers: [WorkoutsHttpController],
  providers: [WorkoutsService],
  exports: [WorkoutsService]
})
export class WorkoutsModule {}
