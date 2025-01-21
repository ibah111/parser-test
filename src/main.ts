import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'colors';
import { getSwaggerCustomOptions, getSwaggerOptions } from './utils/swagger';
import { CommandFactory } from 'nest-commander';

export const node = process.env.NODE_ENV;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder().setTitle('Parser').build();
  const document = SwaggerModule.createDocument(
    app,
    config,
    getSwaggerOptions(),
  );
  SwaggerModule.setup('api', app, document, getSwaggerCustomOptions());
  app.enableCors();
  await app.listen('3000', '0.0.0.0');
  console.log(`Server started: ${await app.getUrl()}/api`);
}
async function bootstrapCli() {
  const app = await CommandFactory.createWithoutRunning(AppModule, [
    'warn',
    'error',
  ]);
  await CommandFactory.runApplication(app);
}
if (node === 'CLI') {
  bootstrapCli();
} else {
  bootstrap();
}
