import { Global, Module } from '@nestjs/common';
import { MailService } from './providers/mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { strict } from 'assert';
@Global()
@Module({
  providers: [MailService],
  exports: [MailService],
  imports: [
    MailerModule.forRootAsync(
      {
        inject: [ConfigService],
        useFactory: async (config: ConfigService) => ({
          transport: {
            hostname: config.get('appConfig.mailHost'),
            secure: false,
            port: 2525,
            auth: {
              user: config.get('appConfig.smtpUsername'),
              pass: config.get('appConfig.smtpPassword')
            },
          },
          default: {
            from: `My Blog <no-reply@nestjs-blog.com>`
          },
          template: {
            dir: join(__dirname, 'templates'),
            adapter: new EjsAdapter(),
            options: { strict: false}
          }
        })
      }
    )
  ]
})
export class MailModule { }
