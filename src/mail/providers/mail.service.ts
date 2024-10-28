import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/users/user.entity';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) { }
    
    public async sendUserWelcome(user: UserEntity):Promise<void> {
        await this.mailerService.sendMail({
            to: user.email,
            from: `Onboarding Team <support@nestjs-blog.com>`,
            subject: 'Welecome to NestHs Blog',
            template: './welcome',
            context: {
                name:user.firstName,
                email: user.email,
                loginUrl:"http://lcoalhost:3000",
            },
        })
    }
}
