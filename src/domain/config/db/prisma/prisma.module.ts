import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [
    {
      provide: PrismaService,
      useValue: PrismaService.instance,
    },
  ],
  exports: [PrismaService],
})
export class PrismaModule {}
