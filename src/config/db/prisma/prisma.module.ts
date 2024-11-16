import { Global, Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'

@Global()
@Module({
  providers: [
    {
      provide: PrismaService,
      useValue: PrismaService.instance
    }
  ],
  exports: [PrismaService]
})
export class PrismaModule {}
