import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from 'src/users/users.module';
import { PostsModule } from 'src/posts/posts.module';
import { AuthModule } from 'src/auth/auth.module';
import { TagsModule } from 'src/tags/tags.module';
import { MetaOptionsModule } from 'src/meta-options/meta-options.module';
import appConfig from 'src/config/app.config';
import databaseConfig from 'src/config/database.config';
import enviromentValidation from '../config/environment.validation';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from 'src/auth/config/jwt.config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AccessTokenGuard } from 'src/auth/guards/access-token/access-token.guard';
import { AuthenticationGuard } from 'src/auth/guards/authentication/authentication.guard';
import { DataResponseInterceptor } from 'src/common/interceptors/data-response/data-response.interceptor';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    UsersModule,
    PostsModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
      load: [appConfig, databaseConfig],
      validationSchema: enviromentValidation,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
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
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    TagsModule,
    MetaOptionsModule,
    PaginationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // implement acces token guard to the entire modules exitent
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: DataResponseInterceptor,
    },
    AccessTokenGuard,
  ],
})
export class AppModule {}
