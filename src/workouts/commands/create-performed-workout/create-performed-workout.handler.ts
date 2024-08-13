import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePerformedWorkoutCommand } from './create-performed-workout.command';
import { CreatePerformedWorkoutDto } from './create-performed-workout.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@CommandHandler(CreatePerformedWorkoutCommand)
export class CreatePerformedWorkoutHandler
  implements
    ICommandHandler<CreatePerformedWorkoutCommand, CreatePerformedWorkoutDto>
{
  constructor(private readonly prismaService: PrismaService) {}

  async execute(
    command: CreatePerformedWorkoutCommand
  ): Promise<CreatePerformedWorkoutDto> {
    try {
      return await this.prismaService.performedWorkout.create({
        data: {
          userId: command.userId,
          name: command.name,
          spentMinutes: command.spentMinutes,
          date: command.date,
          PerformedExercises: {
            createMany: {
              data: command.exercises,
            },
          },
        },
      });
    } catch (error) {
      PrismaService.handleError(error);
    }
  }
}
