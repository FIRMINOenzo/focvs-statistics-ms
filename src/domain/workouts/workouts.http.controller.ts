import { Controller, Get, Param } from '@nestjs/common';
import { AuthUser, JwtPayloadDTO } from '@PedroCavallaro/focvs-utils';
import { WorkoutsService } from './workouts.service';

@Controller('performed/workouts')
export class WorkoutsHttpController {
  constructor(private readonly service: WorkoutsService) {}

  @Get()
  async findAll(@AuthUser() { id }: JwtPayloadDTO) {
    return await this.service.findAll(id);
  }

  @Get(':id')
  async findOne(@AuthUser() { id }: JwtPayloadDTO, @Param('id') workoutId: string) {
    return await this.service.findOne(id, workoutId);
  }
}
