import { SwaggerCustomOptions, SwaggerDocumentOptions } from '@nestjs/swagger';

export function getSwaggerOptions() {
  const swaggerOptions: SwaggerDocumentOptions = {};
  return swaggerOptions;
}

export function getSwaggerCustomOptions() {
  const customSwaggerOptions: SwaggerCustomOptions = {
    customSiteTitle: 'Test aero erp',
    validatorUrl: '',
  };
  return customSwaggerOptions;
}
