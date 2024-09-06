import { Controller, Get, Param } from '@nestjs/common';
import { WorkoutsService } from './workouts.service';
import { AuthUser } from '@PedroCavallaro/focvs-utils';
import { AuthToken } from '../../shared/types/auth-token.type';

@Controller('performed/workouts')
export class WorkoutsHttpController {
  constructor(private readonly service: WorkoutsService) {}

  @Get()
  async findAll(@AuthUser() { id }: AuthToken) {
    return await this.service.findAll(id);
  }

  @Get(':id')
  async findOne(@AuthUser() { id }: AuthToken, @Param('id') workoutId: string) {
    return await this.service.findOne(id, workoutId);
  }
}
