import { Injectable } from '@nestjs/common';

@Injectable()
export class CryptoUtils {
  public createRandomString(): string {
    const NUMBER_OF_CHARS = 30;
    const CHARS =
      'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890';
    const randomArray = Array.from(
      { length: NUMBER_OF_CHARS },
      () => CHARS[Math.floor(Math.random() * CHARS.length)]
    );

    const randomString = randomArray.join('');
    return randomString;
  }
}
