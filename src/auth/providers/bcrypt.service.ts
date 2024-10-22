import * as bcrypt from 'bcrypt';
import { HashingService } from './hashing.service';
import { Injectable } from '@nestjs/common';

 @Injectable()
export class BcryptService implements HashingService {
  public async hashPassword(data: string | Buffer): Promise<string> {
        // Generate salt
        const salt = await bcrypt.genSalt()
        return bcrypt.hash(data,salt)
    }


    comparePassword(data: string | Buffer, encrypted: string): Promise<boolean> {
        return bcrypt.compare(data,encrypted);
    }
}
