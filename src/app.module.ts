import { Module } from '@nestjs/common'
import { APP_GUARD, Reflector } from '@nestjs/core'
import { AuthGuard, FocvsSharedStuffModule, JwtService } from '@PedroCavallaro/focvs-utils'
import { ConfigModule } from '@nestjs/config'
import { StatisticsModule } from './domain/statistics/statistics.module'
import { WorkoutsModule } from './domain/workouts/workouts.module'
import { PrismaModule } from './config/db'
import { AppController } from './app.controller'

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    FocvsSharedStuffModule,
    WorkoutsModule,
    StatisticsModule
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useFactory: (jwtService: JwtService) => new AuthGuard(jwtService, new Reflector()),
      inject: [JwtService]
    }
  ]
})
export class AppModule {}
