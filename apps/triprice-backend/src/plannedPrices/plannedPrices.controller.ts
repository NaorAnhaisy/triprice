import { Controller, Get, Param, Post, Put, Request } from '@nestjs/common';
import { PlannedPricesService } from './plannedPrices.service';
@Controller('plannedPrices')
export class PlannedPricesController {
  constructor(private readonly plannedPricesService: PlannedPricesService) { }

  @Post('create')
  async create(@Request() req) {
    return this.plannedPricesService.insertOnePlannedPrice(req.body);
  }

  @Post('createMany')
  async createPlannedPrices(@Request() req) {
    return this.plannedPricesService.insertPlannedPrices(req.body);
  }

  @Put('updateMany')
  async updatePlannedPrices(@Request() req) {
    return this.plannedPricesService.updatePlannedPrices(req.body);
  }

  @Get(':tripId')
  async getCostsByTripId(@Param('tripId') tripId: string) {
    return this.plannedPricesService.findPlannedPricesByTripId(tripId);
  }
}
