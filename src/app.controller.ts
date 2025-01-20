import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({
    summary: 'Return "Hello world!"',
  })
  @Get('Hello World')
  getHello(): string {
    return this.appService.getHello();
  }
}
