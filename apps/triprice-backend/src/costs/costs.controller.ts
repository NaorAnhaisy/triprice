import { Controller, Get, Param, Post, Request } from '@nestjs/common';
import { CostsService } from './costs.service';
@Controller('costs')
export class CostsController {
  constructor(private readonly costsService: CostsService) { }

  @Post('create')
  async create(@Request() req) {
    return this.costsService.insertOneCost(req.body);
  }

  @Get(':tripId')
  async getCostsByTripId(@Param('tripId') tripId: string) {
    return this.costsService.findCostsByTripId(tripId);
  }
}
