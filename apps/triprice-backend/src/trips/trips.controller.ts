import { Body, Controller, Get, Param, Post, Put, Request } from '@nestjs/common';
import { TripsService } from './trips.service';
import { UpdateHotelData } from 'apps/shared/models/hotels/updateHotelData';
import { UpdateFlightData } from 'apps/shared/models/flights/updateFlightData';

@Controller('trips')
export class TripsController {
  constructor(private tripsService: TripsService) {}

  @Post('create')
  async create(@Request() req) {
    return this.tripsService.insertOneTrip(req.body);
  }

  @Post('createGroup')
  async createGroup(@Request() req) {
    return this.tripsService.createGroup(req.body);
  }

  @Post('insertUserInGroup')
  async insertUserInGroup(@Request() req) {
    return this.tripsService.insertUserInGroup(req.body);
  }

  @Post('inviteToGroup')
  async inviteUserToGroup(@Request() req) {
    return await this.tripsService.inviteUserToGroup(req.body.group, req.body.user);
  }

  @Post('remove')
  async remove(@Request() req) {
    this.tripsService.removeTripFromUserInTrip(req.body.id);
    this.tripsService.removeTripCosts(req.body.id);
    return this.tripsService.removeOneTrip(req.body.id);
  }

  @Put('updateHotel')
  async updateHotel(@Body() updateData: UpdateHotelData): Promise<any> {
    return this.tripsService.updateHotel({
      tripId: updateData.tripId,
      hotelId: updateData.hotelId,
      hotel: updateData.hotel
    });
  }

  @Put('updateFlight')
  async updateFlight(@Body() updateData: UpdateFlightData): Promise<any> {
    return this.tripsService.updateFlight({
      tripId: updateData.tripId,
      flightId: updateData.flightId,
      flight: updateData.flight
    });
  }

  @Post('addUserToTrip')
  async addUserToTrip(@Request() req) {
    return this.tripsService.insertUserInTrip(req.body);
  }

  @Post('removeUserFromTrip')
  async removeUserFromTrip(@Request() req) {
    return this.tripsService.removeUserFromTrip(req.body);
  }

  @Post('removeUserFromGroupByGroupId/:groupId')
  async removeUserFromGroupByGroupId(@Param('groupId') groupId: string) {
    return this.tripsService.removeUserFromGroupByGroupId(groupId);
  }

  @Post('removeUserFromGroupByUserId/:userId')
  async removeUserFromGroupByUserId(@Param('userId') userId: string) {
    return this.tripsService.removeUserFromGroupByUserId(userId);
  }

  @Post('removeGroup/:groupId')
  async removeGroup(@Param('groupId') groupId: string) {
    return this.tripsService.removeGroup(groupId);
  }

  @Get(':userId')
  async getTripsByUserId(@Param('userId') userId: string) {
    return this.tripsService.findTripsByUserId(userId);
  }

  @Get('getByTripId/:tripId')
  async getTripsByTripId(@Param('tripId') tripId: string) {
    return this.tripsService.findTripsByTripId(tripId);
  }

  @Get('getUsersInTrip/:tripId')
  async getUsersInTrip(@Param('tripId') tripId: string) {
    return this.tripsService.getUsersInTrip(tripId);
  }

  @Get('getUsersInTripByUserId/:userId')
  async getUsersInTripByUserId(@Param('userId') userId: string) {
    return this.tripsService.getUsersInTripByUserId(userId);
  }


  @Get('/groupById/:id')
  async findGroupById(@Param('id') id: string) {
    return this.tripsService.findGroupById(id);
  }

  @Get('/groupByUserId/:userId')
  async findGroupByUserId(@Param('userId') userId: string) {
    return this.tripsService.findGroupByUserId(userId);
  }

  @Get('/userInGroupByUserId/:userId')
  async findUserInGroupByUserId(@Param('userId') userId: string) {
    return this.tripsService.findUserInGroupByUserId(userId);
  }

  @Get('/userInGroupByGroupId/:groupId')
  async findUserInGroupByGroupId(@Param('groupId') groupId: string) {
    return this.tripsService.findUserInGroupByGroupId(groupId);
  }
}
