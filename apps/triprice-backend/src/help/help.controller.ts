import { Controller, Post, Request } from '@nestjs/common';
import { HelpService } from './help.service';

@Controller('help')
export class HelpController {
  constructor(private helpService: HelpService) {}

  @Post('sendHelpEmail')
  async sendHelpEmail(@Request() req) {
    return await this.helpService.sendHelpEmailToTriPriceAdmin(req.body.header, req.body.content);
  }
}
