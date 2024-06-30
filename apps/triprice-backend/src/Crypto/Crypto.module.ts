import { Module } from '@nestjs/common';
import { HashingService } from './Hashing.service';
import { CryptoUtils } from './cryptoUtils.service';

@Module({
    providers: [HashingService, CryptoUtils],
    exports: [HashingService, CryptoUtils]
})

export class CryptoModule {};
