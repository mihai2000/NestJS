import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { PostsModule } from 'src/posts/posts.module';
import { AuthModule } from 'src/auth/auth.module';
import appConfig from 'src/config/app.config';
import databaseConfig from 'src/config/database.config';
import environmentValidation from 'src/config/environment.validation';
import { TagsModule } from 'src/tags/tags.module';
import { MetaOptionsModule } from 'src/meta-options/meta-options.module';
/**
 * Importing Entities
 * */


// Get the current NODE_ENV
const ENV = process.env.NODE_ENV;
console.log(ENV);
@Module({
  imports: [
    UsersModule,
    PostsModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
      load: [appConfig, databaseConfig],
      validationSchema: environmentValidation,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        synchronize: configService.get('database.synchronize'),
        port: configService.get('database.port'),
        username: configService.get('database.user'),
        password: configService.get('database.password'),
        host: configService.get('database.host'),
        autoLoadEntities: configService.get('database.autoLoadEntities'),
        database: configService.get('database.name'),
      }),
    }),
    TagsModule,
    MetaOptionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}