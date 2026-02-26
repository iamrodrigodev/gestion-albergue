import { SetMetadata } from '@nestjs/common';
import { DetalleCodigoExito } from '@common/constants';

export const BUSINESS_RESPONSE_KEY = 'business_response_key';
export const BusinessResponse = (detalle: DetalleCodigoExito) =>
  SetMetadata(BUSINESS_RESPONSE_KEY, detalle);
