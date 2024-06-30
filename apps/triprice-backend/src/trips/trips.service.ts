import { Injectable } from '@nestjs/common';
import { ResponseOnUserPostRequest } from '../../../shared/models/users/user';
import { Trip } from '../../../shared/models/trips/userTrip';
import { UpdateHotelData } from '../../../shared/models/hotels/updateHotelData';
import { GraphqlService } from '../graphql/graphql.service';
import { UserInTrip } from 'apps/shared/models/trips/userInTrip';
import { UpdateFlightData } from 'apps/shared/models/flights/updateFlightData';
import { Group } from '../../../shared/models/groups/group';
import { User } from '../../../shared/models/users/user';
import { UserInGroup } from 'apps/shared/models/groups/userInGroup';
import { MailerService } from '../mailer/mailer.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TripsService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly graphqlService: GraphqlService,
    private readonly configService: ConfigService
    ) { }

  public async findTripsByUserId(userId: string) {
    return this.graphqlService.findTripsByUserId(userId);
  }

  public async findTripsByTripId(tripId: string): Promise<Trip | undefined> {
    return this.graphqlService.findTripsByTripId(tripId);
  }

  public async getUsersInTrip(tripId: string) {
    return this.graphqlService.getUsersInTrip(tripId);
  }

  public async getUsersInTripByUserId(userId: string) {
    return this.graphqlService.getUsersInTripByUserId(userId);
  }

  public async findGroupById(id: string) {
    return this.graphqlService.findGroupById(id);
  }

  public async findGroupByUserId(userId: string) {
    return this.graphqlService.findGroupByUserId(userId);
  }

  public async findUserInGroupByUserId(userId: string) {
    return this.graphqlService.findUserInGroupByUserId(userId);
  }

  public async findUserInGroupByGroupId(userId: string) {
    return this.graphqlService.findUserInGroupByGroupId(userId);
  }

  public async insertOneTrip(trip: Trip): Promise<ResponseOnUserPostRequest> {
    return this.graphqlService.insertOneTrip(trip);
  }

  public async createGroup(group: Group): Promise<Group> {
    return this.graphqlService.createGroup(group);
  }

  public async insertUserInGroup(userInGroup: UserInGroup): Promise<ResponseOnUserPostRequest> {
    return this.graphqlService.insertUserInGroup(userInGroup);
  }

  public async inviteUserToGroup(group: Group, user: User) {
    const joinGroupUrl = `${this.configService.get('appUrl')}:${this.configService.get('clientPort')}/joinGroup/${user.id}/${group.id}`;
    await this.mailerService.sendMail(
      user.email,
      'Triprice - join to group',
      'Hello,\n\n' +
      'You receive an invitiation from '+ user.first_name + ' ' + user.last_name + ' to join his group: "' + group.name + '"\n' +
      'If you do want to join the group, please follow the link:\n\n' +
      joinGroupUrl + '\n\n' +
      'Yours, Triprice.',
      "<div style='direction:ltr'>" +
      "<h2>Hello,</h2>" +
      "<p>" +
      "<h3>" +
      'You receive an invitiation from '+ user.first_name + ' ' + user.last_name + ' to join his group: "' + group.name + '"\n' +
      'If you do want to join the group, please follow the link:\n\n' +
      joinGroupUrl + '\n\n' +
      'Yours, Triprice.' +
      "</h2>" +
      "</p>" +
      "</div>"
    );
  }

  public async removeOneTrip(tripId: string): Promise<ResponseOnUserPostRequest> {
    return this.graphqlService.removeOneTrip(tripId);
  } 

  public async removeTripFromUserInTrip(tripId: string): Promise<ResponseOnUserPostRequest> {
    return this.graphqlService.removeTripFromUserInTrip(tripId);
  } 

  public async removeTripCosts(tripId: string): Promise<ResponseOnUserPostRequest> {
    return this.graphqlService.removeTripCosts(tripId);
  } 

  public async insertUserInTrip(userInTrip: UserInTrip): Promise<ResponseOnUserPostRequest> {
    return this.graphqlService.insertUserInTrip(userInTrip);
  }

  public async removeUserFromTrip(userInTrip: UserInTrip): Promise<ResponseOnUserPostRequest> {
    return this.graphqlService.removeUserFromTrip(userInTrip);
  }

  public async removeUserFromGroupByGroupId(groupId: string): Promise<ResponseOnUserPostRequest> {
    return this.graphqlService.removeUserFromGroupByGroupId(groupId);
  }

  public async removeUserFromGroupByUserId(userId: string): Promise<ResponseOnUserPostRequest> {
    return this.graphqlService.removeUserFromGroupByUserId(userId);
  }

  public async removeGroup(groupId: string): Promise<ResponseOnUserPostRequest> {
    return this.graphqlService.removeGroup(groupId);
  }

  public async updateHotel(updateHotelData: UpdateHotelData): Promise<ResponseOnUserPostRequest> {
    return this.graphqlService.updateHotel(updateHotelData);
  }

  public async updateFlight(updateFlightData: UpdateFlightData): Promise<ResponseOnUserPostRequest> {
    return this.graphqlService.updateFlight(updateFlightData);
  }
}