import { Controller, Get } from '@nestjs/common';
import { BusinessResponse } from '@common/decorators';
import { SuccessCodes } from '@common/constants';

@Controller('salud')
export class HealthController {
  @Get()
  @BusinessResponse(SuccessCodes.SALUD_200)
  verificar() {
    return;
  }
}
