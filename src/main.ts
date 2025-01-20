import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'colors';
import { getSwaggerCustomOptions, getSwaggerOptions } from './utils/swagger';

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
bootstrap();
