import { Injectable } from '@nestjs/common';
import { SHA256 } from 'crypto-js';
@Injectable()
export class HashingService {
  public hashString(plainText: string): string {
    const hash: string = SHA256(plainText).toString();
    return hash;
  }
 
  public compareHash(plainText: string, hash: string): boolean {
    const result: boolean = SHA256(plainText).toString() === hash;
    return result;
  }
}
