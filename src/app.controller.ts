import { Controller, Get } from '@nestjs/common'
import { Public } from '@PedroCavallaro/focvs-utils'

@Controller('/')
export class AppController {
  @Public()
  @Get()
  async healthCheck() {
    return 'Hi!'
  }
}
