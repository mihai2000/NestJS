import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      // if a property doesnt exist on DTO nestJS will not accept it
      whitelist: true,
      // throws back the req as error if some property is not on DTO
      forbidNonWhitelisted: true,
      // transform an incoming proocess iinto a instanceof DTO class after validation
      transform: true,
      // to do the implicit conversion when needed for the values in dto, for not using @Type for them
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // swagger configuration
  const swaggerConfig = new DocumentBuilder()
    .setTitle('NestJS MasterClass - Blog app API')
    .setDescription('Use the base API URL as http://localhost:3000')
    .setTermsOfService('http://localhost:3000/terms-of-service')
    .setLicense(
      'MIT License',
      'https://github.com/git/git-scm.com/blob/main/MIT-LICENSE.txt',
    )
    .addServer('http://localhost:3000')
    .setVersion('1.0')
    .build();
  // instantiate Document
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  // Setup the aws sdk used uploading files to aws s3 bucket
  const configService = app.get(ConfigService);
  config.update({
    credentials: {
      accessKeyId: configService.get<string>('appConfig.awsAccessKeyId'),
      secretAccessKey: configService.get<string>(
        'appConfig.awsSecretAccessKey',
      ),
    },
    region: configService.get<string>('appConfig.awsRegion'),
  });
  // enable cors
  app.enableCors();
  await app.listen(3000);
}
bootstrap();