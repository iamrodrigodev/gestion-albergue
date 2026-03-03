import { Controller, Get, Redirect } from '@nestjs/common';
import { BusinessResponse } from '@common/decorators';
import { SuccessCodes } from '@common/constants';

@Controller()
export class HealthController {
  @Get()
  @Redirect('salud', 302)
  root() {
    return;
  }

  @Get('salud')
  @BusinessResponse(SuccessCodes.SALUD_200)
  verificar() {
    return;
  }
}
