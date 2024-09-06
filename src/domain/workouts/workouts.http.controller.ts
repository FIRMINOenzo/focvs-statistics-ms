import { Controller, Get, Param } from '@nestjs/common';
import { WorkoutsService } from './workouts.service';

@Controller('performed/workouts')
export class WorkoutsHttpController {
  constructor(private readonly service: WorkoutsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}
