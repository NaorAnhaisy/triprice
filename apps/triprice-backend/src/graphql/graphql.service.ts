import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import {
  ResponseOnUserPostRequest,
  User,
} from '../../../shared/models/users/user';
import { catchError, lastValueFrom, map } from 'rxjs';
import {
  getAllUsers,
  findUserByEmail,
  findUserByResetToken,
  findUserById,
  insertOneUser,
  deleteOneUser,
  findTripsByUserId,
  insertOneTrip,
  insertUserInTrip,
  getUsersInTrip,
  updateUserResetPassword,
  resetUserPassword,
  insertOneReview,
  findReviews,
  removeOneTrip,
  updateHotelMutation,
  updateFlightMutation,
  getUsersInTripByUserId,
  findTripsByTripId,
  removeUserFromTrip,
  removeTripFromUserInTrip,
  removeUserFromGroupByGroupId,
  removeUserFromGroupByUserId,
  removeGroup,
  removeTripCosts,
  findTripsByEndDate,
  insertOneCost,
  findCostsByTripId,
  createGroup,
  insertUserInGroup,
  findGroupById,
  findGroupByUserId,
  findUserInGroupByUserId,
  findUserInGroupByGroupId,
  findCalculatedPricesByCityId,
  insertCalculatedPrices,
  updateCalculatedPricesMutation,
  updatePlannedPricesMutation,
  insertPlannedPrices,
  insertOnePlannedPrice,
  findPlannedPricesByTripId,
  removeOneReview,
  updateOneReview,
} from './schema';
import { Trip } from '../../../shared/models/trips/userTrip';
import { Group } from '../../../shared/models/groups/group';
import { UserInGroup } from '../../../shared/models/groups/userInGroup';
import { UserInTrip } from '../../../shared/models/trips/userInTrip';
import { Review } from '../../../shared/models/reviews/review';
import { UpdateHotelData } from '../../../shared/models/hotels/updateHotelData';
import { UpdateFlightData } from '../../../shared/models/flights/updateFlightData';
import { Cost } from '../../../shared/models/costs/cost';
import { CalculatedPrice } from '../../../shared/models/calculatedPrices/calculatedPrice';
import { AppConfigService } from '../config/AppConfig.service';
import { PlannedPrice } from '../../../shared/models/plannedPrices/plannedPrice';

const HASURA_URL = 'https://triprice.hasura.app/v1/graphql';

@Injectable()
export class GraphqlService {
  private headersConfig: {
    'Content-Type': string;
    'x-hasura-admin-secret': string;
  };
  private readonly logger: Logger = new Logger(GraphqlService.name);
  constructor(
    private readonly httpService: HttpService,
    configService: AppConfigService
  ) {
    this.headersConfig = {
      'Content-Type': 'application/json',
      'x-hasura-admin-secret': configService.getConfig().hasura.key ?? '',
    };
  }

  public async getAllUsers(): Promise<User[]> {
    const res = await lastValueFrom(
      this.httpService
        .post(HASURA_URL, getAllUsers, { headers: this.headersConfig })
        .pipe(
          map((response) => {
            return response.data;
          })
        )
        .pipe(
          catchError((error: AxiosError) => {
            console.error(error);
            throw 'An error happened!';
          })
        )
    );
    if (res?.data?.errors?.length) {
      return res?.data?.errors;
    } else {
      return res.data?.users;
    }
  }

  public async findUserByEmail(email: string): Promise<User | null> {
    const res = await lastValueFrom(
      this.httpService
        .post(HASURA_URL, findUserByEmail(email), {
          headers: this.headersConfig,
        })
        .pipe(
          catchError((error: AxiosError) => {
            console.error(error);
            throw 'An error happened!';
          })
        )
    );

    return res?.data?.data?.users?.length ? res?.data?.data?.users[0] : null;
  }

  public async findUserByResetToken(resetToken: string): Promise<User | null> {
    const res = await lastValueFrom(
      this.httpService
        .post(HASURA_URL, findUserByResetToken(resetToken), {
          headers: this.headersConfig,
        })
        .pipe(
          catchError((error: AxiosError) => {
            console.error(error);
            throw 'An error happened!';
          })
        )
    );

    return res?.data?.data?.users?.length ? res?.data?.data?.users[0] : null;
  }

  public async findUserById(user_id: string): Promise<User | null> {
    const res = await lastValueFrom(
      this.httpService
        .post(HASURA_URL, findUserById(user_id), {
          headers: this.headersConfig,
        })
        .pipe(
          catchError((error: AxiosError) => {
            console.error(error);
            throw 'An error happened!';
          })
        )
    );

    return res?.data?.data?.users?.length ? res?.data?.data?.users[0] : null;
  }

  public async findGroupById(id: string): Promise<Group | null> {
    const res = await lastValueFrom(
      this.httpService
        .post(HASURA_URL, findGroupById(id), {
          headers: this.headersConfig,
        })
        .pipe(
          catchError((error: AxiosError) => {
            console.error(error);
            throw 'An error happened!';
          })
        )
    );

    return res?.data?.data?.groups?.length ? res?.data?.data?.groups[0] : null;
  }

  public async findGroupByUserId(user_id: string): Promise<Group | null> {
    const res = await lastValueFrom(
      this.httpService
        .post(HASURA_URL, findGroupByUserId(user_id), {
          headers: this.headersConfig,
        })
        .pipe(
          catchError((error: AxiosError) => {
            console.error(error);
            throw 'An error happened!';
          })
        )
    );

    return res?.data?.data?.groups?.length ? res?.data?.data?.groups : null;
  }

  public async findUserInGroupByUserId(
    user_id: string
  ): Promise<UserInGroup | null> {
    const res = await lastValueFrom(
      this.httpService
        .post(HASURA_URL, findUserInGroupByUserId(user_id), {
          headers: this.headersConfig,
        })
        .pipe(
          catchError((error: AxiosError) => {
            console.error(error);
            throw 'An error happened!';
          })
        )
    );

    return res?.data?.data?.userInGroup?.length
      ? res?.data?.data?.userInGroup
      : null;
  }

  public async findUserInGroupByGroupId(
    group_id: string
  ): Promise<UserInGroup | null> {
    const res = await lastValueFrom(
      this.httpService
        .post(HASURA_URL, findUserInGroupByGroupId(group_id), {
          headers: this.headersConfig,
        })
        .pipe(
          catchError((error: AxiosError) => {
            console.error(error);
            throw 'An error happened!';
          })
        )
    );

    return res?.data?.data?.userInGroup?.length
      ? res?.data?.data?.userInGroup
      : null;
  }

  public async getUsersInTrip(
    tripId: string
  ): Promise<ResponseOnUserPostRequest> {
    const res = await lastValueFrom(
      this.httpService
        .post(HASURA_URL, getUsersInTrip(tripId), {
          headers: this.headersConfig,
        })
        .pipe(
          catchError((error: AxiosError) => {
            console.error(error);
            throw 'An error happened!';
          })
        )
    );

    return res?.data?.data?.userInTrip?.length
      ? res?.data?.data?.userInTrip
      : null;
  }

  public async getUsersInTripByUserId(
    userId: string
  ): Promise<ResponseOnUserPostRequest> {
    const res = await lastValueFrom(
      this.httpService
        .post(HASURA_URL, getUsersInTripByUserId(userId), {
          headers: this.headersConfig,
        })
        .pipe(
          catchError((error: AxiosError) => {
            console.error(error);
            throw 'An error happened!';
          })
        )
    );

    return res?.data?.data?.userInTrip?.length
      ? res?.data?.data?.userInTrip
      : null;
  }

  public async findTripsByUserId(userId: string): Promise<Trip | null> {
    const res = await lastValueFrom(
      this.httpService
        .post(HASURA_URL, findTripsByUserId(userId), {
          headers: this.headersConfig,
        })
        .pipe(
          catchError((error: AxiosError) => {
            console.error(error);
            throw 'An error happened!';
          })
        )
    );

    return res?.data?.data?.trips?.length ? res?.data?.data?.trips : null;
  }

  public async findTripsByEndDate(endDate: string): Promise<Trip[]> {
    const res = await lastValueFrom(
      this.httpService
        .post(HASURA_URL, findTripsByEndDate(endDate), {
          headers: this.headersConfig,
        })
        .pipe(
          catchError((error: AxiosError) => {
            console.error(error);
            throw 'An error happened!';
          })
        )
    );

    return res?.data?.data?.trips?.length ? res?.data?.data?.trips : [];
  }

  public async findPlannedPricesByTripId(
    tripId: string
  ): Promise<PlannedPrice[]> {
    const res = await lastValueFrom(
      this.httpService
        .post(HASURA_URL, findPlannedPricesByTripId(tripId), {
          headers: this.headersConfig,
        })
        .pipe(
          catchError((error: AxiosError) => {
            console.error(error);
            throw 'An error happened!';
          })
        )
    );

    return res?.data?.data?.plannedPrices?.length
      ? res?.data?.data?.plannedPrices
      : [];
  }

  public async findCostsByTripId(tripId: string): Promise<Cost[]> {
    const res = await lastValueFrom(
      this.httpService
        .post(HASURA_URL, findCostsByTripId(tripId), {
          headers: this.headersConfig,
        })
        .pipe(
          catchError((error: AxiosError) => {
            console.error(error);
            throw 'An error happened!';
          })
        )
    );

    return res?.data?.data?.costs?.length ? res?.data?.data?.costs : [];
  }

  public async findCalculatedPricesByCityId(
    cityId: string
  ): Promise<CalculatedPrice[]> {
    const res = await lastValueFrom(
      this.httpService
        .post(HASURA_URL, findCalculatedPricesByCityId(cityId), {
          headers: this.headersConfig,
        })
        .pipe(
          catchError((error: AxiosError) => {
            console.error(error);
            throw 'An error happened!';
          })
        )
    );

    return res?.data?.data?.calculatedPrices?.length
      ? res?.data?.data?.calculatedPrices
      : [];
  }

  public async insertCalculatedPrice(
    calculatedPrices: CalculatedPrice[]
  ): Promise<ResponseOnUserPostRequest> {
    const res = await lastValueFrom(
      this.httpService
        .post(HASURA_URL, insertCalculatedPrices(calculatedPrices), {
          headers: this.headersConfig,
        })
        .pipe(
          catchError((error: AxiosError) => {
            console.error(error);
            throw { isSucceed: false, error: error };
          })
        )
    );

    if (res?.data?.errors?.length) {
      return { isSucceed: false, error: res?.data?.errors[0].message };
    }

    return { isSucceed: true, error: res?.data?.errors };
  }

  public async updateCalculatedPrices(
    calculatedPrices: CalculatedPrice[]
  ): Promise<ResponseOnUserPostRequest> {
    const res = await lastValueFrom(
      this.httpService
        .post(HASURA_URL, updateCalculatedPricesMutation(calculatedPrices), {
          headers: this.headersConfig,
        })
        .pipe(
          catchError((error: AxiosError) => {
            console.error(error);
            throw { isSucceed: false, error: error };
          })
        )
    );

    if (res?.data?.errors?.length) {
      return { isSucceed: false, error: res?.data?.errors[0].message };
    }

    return { isSucceed: true, error: res?.data?.errors };
  }

  public async findTripsByTripId(tripId: string): Promise<Trip | null> {
    const res = await lastValueFrom(
      this.httpService
        .post(HASURA_URL, findTripsByTripId(tripId), {
          headers: this.headersConfig,
        })
        .pipe(
          catchError((error: AxiosError) => {
            console.error(error);
            throw 'An error happened!';
          })
        )
    );

    return res?.data?.data?.trips?.length ? res?.data?.data?.trips[0] : null;
  }

  public async insertOneUser(user: User): Promise<ResponseOnUserPostRequest> {
    const res = await lastValueFrom(
      this.httpService
        .post(HASURA_URL, insertOneUser(user), { headers: this.headersConfig })
        .pipe(
          catchError((error: AxiosError) => {
            console.error(error);
            throw { isSucceed: false, error: error };
          })
        )
    );

    if (res?.data?.errors?.length) {
      return { isSucceed: false, error: res?.data?.errors[0].message };
    }

    return { isSucceed: true, error: null };
  }

  public async createGroup(group: Group): Promise<Group> {
    const res = await lastValueFrom(
      this.httpService
        .post(HASURA_URL, createGroup(group), { headers: this.headersConfig })
        .pipe(
          catchError((error: AxiosError) => {
            console.error(error);
            throw { isSucceed: false, error: error };
          })
        )
    );

    return res?.data?.data?.insert_groups ? res?.data?.data?.insert_groups : {};
  }

  public async insertUserInGroup(
    userInGroup: UserInGroup
  ): Promise<ResponseOnUserPostRequest> {
    await lastValueFrom(
      this.httpService
        .post(HASURA_URL, insertUserInGroup(userInGroup), {
          headers: this.headersConfig,
        })
        .pipe(
          catchError((error: AxiosError) => {
            console.error(error);
            throw { isSucceed: false, error: error };
          })
        )
    );

    return { isSucceed: true, error: null };
  }

  public async insertOneCost(cost: Cost): Promise<ResponseOnUserPostRequest> {
    const res = await lastValueFrom(
      this.httpService
        .post(HASURA_URL, insertOneCost(cost), { headers: this.headersConfig })
        .pipe(
          catchError((error: AxiosError) => {
            console.error(error);
            throw { isSucceed: false, error: error };
          })
        )
    );

    if (res?.data?.errors?.length) {
      return { isSucceed: false, error: res?.data?.errors[0].message };
    }

    const costId = res?.data?.data?.insert_costs?.returning[0].id;
    return { isSucceed: true, error: res?.data?.errors, id: costId };
  }

  public async insertOneTrip(trip: Trip): Promise<ResponseOnUserPostRequest> {
    this.logger.log({
      message: 'Insert one new trip:',
      data: trip,
    });
    const res = await lastValueFrom(
      this.httpService
        .post(HASURA_URL, insertOneTrip(trip), { headers: this.headersConfig })
        .pipe(
          catchError((error: AxiosError) => {
            console.error(error);
            throw { isSucceed: false, error: error };
          })
        )
    );

    if (res?.data?.errors?.length) {
      return { isSucceed: false, error: res?.data?.errors[0].message };
    }

    const tripId = res?.data?.data?.insert_trips?.returning[0].id;
    return { isSucceed: true, error: res?.data?.errors, id: tripId };
  }

  public async removeOneTrip(
    tripId: string
  ): Promise<ResponseOnUserPostRequest> {
    const res = await lastValueFrom(
      this.httpService
        .post(HASURA_URL, removeOneTrip(tripId), {
          headers: this.headersConfig,
        })
        .pipe(
          catchError((error: AxiosError) => {
            console.error(error);
            throw { isSucceed: false, error: error };
          })
        )
    );

    if (res?.data?.errors?.length) {
      return { isSucceed: false, error: res?.data?.errors[0].message };
    }

    const affectedRows = res?.data?.data?.delete_trips?.affected_rows;
    if (affectedRows > 0) {
      return { isSucceed: true, error: res?.data?.errors };
    } else {
      return { isSucceed: false, error: 'Failed to delete trip.' };
    }
  }

  public async insertUserInTrip(
    userInTrip: UserInTrip
  ): Promise<ResponseOnUserPostRequest> {
    const res = await lastValueFrom(
      this.httpService
        .post(HASURA_URL, insertUserInTrip(userInTrip), {
          headers: this.headersConfig,
        })
        .pipe(
          catchError((error: AxiosError) => {
            console.error(error);
            throw { isSucceed: false, error: error };
          })
        )
    );

    if (res?.data?.errors?.length) {
      return { isSucceed: false, error: res?.data?.errors[0].message };
    }

    const userInTripId = res?.data?.data?.insert_userInTrip?.returning[0].id;
    return { isSucceed: true, error: res?.data?.errors, id: userInTripId };
  }

  public async removeUserFromTrip(
    userInTrip: UserInTrip
  ): Promise<ResponseOnUserPostRequest> {
    const res = await lastValueFrom(
      this.httpService
        .post(HASURA_URL, removeUserFromTrip(userInTrip), {
          headers: this.headersConfig,
        })
        .pipe(
          catchError((error: AxiosError) => {
            console.error(error);
            throw { isSucceed: false, error: error };
          })
        )
    );

    if (res?.data?.errors?.length) {
      return { isSucceed: false, error: res?.data?.errors[0].message };
    }

    return { isSucceed: true, error: res?.data?.errors };
  }

  public async removeUserFromGroupByGroupId(
    groupId: string
  ): Promise<ResponseOnUserPostRequest> {
    const res = await lastValueFrom(
      this.httpService
        .post(HASURA_URL, removeUserFromGroupByGroupId(groupId), {
          headers: this.headersConfig,
        })
        .pipe(
          catchError((error: AxiosError) => {
            console.error(error);
            throw { isSucceed: false, error: error };
          })
        )
    );

    if (res?.data?.errors?.length) {
      return { isSucceed: false, error: res?.data?.errors[0].message };
    }

    return { isSucceed: true, error: res?.data?.errors };
  }

  public async removeUserFromGroupByUserId(
    userId: string
  ): Promise<ResponseOnUserPostRequest> {
    const res = await lastValueFrom(
      this.httpService
        .post(HASURA_URL, removeUserFromGroupByUserId(userId), {
          headers: this.headersConfig,
        })
        .pipe(
          catchError((error: AxiosError) => {
            console.error(error);
            throw { isSucceed: false, error: error };
          })
        )
    );

    if (res?.data?.errors?.length) {
      return { isSucceed: false, error: res?.data?.errors[0].message };
    }

    return { isSucceed: true, error: res?.data?.errors };
  }

  public async removeGroup(
    groupId: string
  ): Promise<ResponseOnUserPostRequest> {
    const res = await lastValueFrom(
      this.httpService
        .post(HASURA_URL, removeGroup(groupId), {
          headers: this.headersConfig,
        })
        .pipe(
          catchError((error: AxiosError) => {
            console.error(error);
            throw { isSucceed: false, error: error };
          })
        )
    );

    if (res?.data?.errors?.length) {
      return { isSucceed: false, error: res?.data?.errors[0].message };
    }

    return { isSucceed: true, error: res?.data?.errors };
  }

  public async removeTripFromUserInTrip(
    trip_id: string
  ): Promise<ResponseOnUserPostRequest> {
    const res = await lastValueFrom(
      this.httpService
        .post(HASURA_URL, removeTripFromUserInTrip(trip_id), {
          headers: this.headersConfig,
        })
        .pipe(
          catchError((error: AxiosError) => {
            console.error(error);
            throw { isSucceed: false, error: error };
          })
        )
    );

    if (res?.data?.errors?.length) {
      return { isSucceed: false, error: res?.data?.errors[0].message };
    }

    return { isSucceed: true, error: res?.data?.errors };
  }

  public async removeTripCosts(
    trip_id: string
  ): Promise<ResponseOnUserPostRequest> {
    const res = await lastValueFrom(
      this.httpService
        .post(HASURA_URL, removeTripCosts(trip_id), {
          headers: this.headersConfig,
        })
        .pipe(
          catchError((error: AxiosError) => {
            console.error(error);
            throw { isSucceed: false, error: error };
          })
        )
    );

    if (res?.data?.errors?.length) {
      return { isSucceed: false, error: res?.data?.errors[0].message };
    }

    return { isSucceed: true, error: res?.data?.errors };
  }

  public async deleteOneUser(
    userID: string
  ): Promise<ResponseOnUserPostRequest> {
    const res = await lastValueFrom(
      this.httpService
        .post(HASURA_URL, deleteOneUser(userID), {
          headers: this.headersConfig,
        })
        .pipe(
          catchError((error: AxiosError) => {
            console.error(error);
            throw { isSucceed: false, error: error };
          })
        )
    );

    if (res?.data?.errors) {
      return { isSucceed: false, error: res?.data?.errors[0]?.message };
    } else {
      return { isSucceed: true };
    }
  }

  public async updateUserResetPassword(
    userEmail: string,
    resetPasswordToken: string,
    resetPasswordExpired: number
  ): Promise<ResponseOnUserPostRequest> {
    const res = await lastValueFrom(
      this.httpService
        .post(
          HASURA_URL,
          updateUserResetPassword(
            userEmail,
            resetPasswordToken,
            resetPasswordExpired
          ),
          { headers: this.headersConfig }
        )
        .pipe(
          catchError((error: AxiosError) => {
            console.error(error);
            throw { isSucceed: false, error: error };
          })
        )
    );

    if (res?.data?.data?.update_users?.affected_rows === 1) {
      return {
        isSucceed: true,
        error: null,
        data: res.data.data.update_users.returning[0],
      };
    } else if (res?.data?.data?.update_users?.affected_rows === 0) {
      return { isSucceed: false, error: 'User not found' };
    } else if (res?.data?.errors) {
      return { isSucceed: false, error: res?.data?.errors[0]?.message };
    } else {
      return { isSucceed: false, error: 'Error accured' };
    }
  }

  public async resetUserPassword(
    userEmail: string,
    userNewPassword: string
  ): Promise<ResponseOnUserPostRequest> {
    this.logger.log({
      message: `Reset password for user email: '${userEmail}', and user new password: '${userNewPassword}'`,
    });
    const res = await lastValueFrom(
      this.httpService
        .post(HASURA_URL, resetUserPassword(userEmail, userNewPassword), {
          headers: this.headersConfig,
        })
        .pipe(
          catchError((error: AxiosError) => {
            console.error(error);
            throw { isSucceed: false, error: error };
          })
        )
    );

    if (res?.data?.data?.update_users?.affected_rows === 1) {
      return {
        isSucceed: true,
        error: null,
        data: res.data.data.update_users.returning[0],
      };
    } else if (res?.data?.data?.update_users?.affected_rows === 0) {
      return { isSucceed: false, error: 'User not found' };
    } else if (res?.data?.errors) {
      return { isSucceed: false, error: res?.data?.errors[0]?.message };
    } else {
      return { isSucceed: false, error: 'Error accured' };
    }
  }

  public async insertOneReview(
    review: Review
  ): Promise<ResponseOnUserPostRequest> {
    const res = await lastValueFrom(
      this.httpService
        .post(HASURA_URL, insertOneReview(review), {
          headers: this.headersConfig,
        })
        .pipe(
          catchError((error: AxiosError) => {
            console.error(error);
            throw { isSucceed: false, error: error };
          })
        )
    );

    if (res?.data?.errors?.length) {
      return { isSucceed: false, error: res?.data?.errors[0].message };
    }

    const reviewId = res?.data?.data?.insert_reviews_one?.id;
    return { isSucceed: true, error: res?.data?.errors, id: reviewId };
  }

  public async updateOneReview(
    review: Review
  ): Promise<ResponseOnUserPostRequest> {
    try {
      const res = await this.httpService
        .post(
          HASURA_URL,
          { query: updateOneReview(review) },
          {
            headers: this.headersConfig,
          }
        )
        .pipe(
          catchError((error: AxiosError) => {
            console.error(error);
            throw { isSucceed: false, error: error };
          })
        )
        .toPromise();

      if (res?.data?.errors?.length) {
        throw { isSucceed: false, error: res?.data?.errors[0].message };
      }

      const affectedRows = res?.data?.data?.update_reviews?.returning?.length;
      if (affectedRows > 0) {
        return { isSucceed: true, error: null };
      } else {
        throw { isSucceed: false, error: 'Failed to update review.' };
      }
    } catch (error) {
      console.error(error);
      throw { isSucceed: false, error };
    }
  }

  public async findReviews(): Promise<Review[]> {
    const res = await lastValueFrom(
      this.httpService
        .post(HASURA_URL, findReviews(), { headers: this.headersConfig })
        .pipe(
          catchError((error: AxiosError) => {
            console.error(error);
            throw 'An error happened!';
          })
        )
    );

    return res?.data?.data?.reviews?.length ? res?.data?.data?.reviews : [];
  }

  public async removeOneReview(
    reviewId: string
  ): Promise<ResponseOnUserPostRequest> {
    try {
      const res = await this.httpService
        .post(HASURA_URL, removeOneReview(reviewId), {
          headers: this.headersConfig,
        })
        .pipe(
          catchError((error: AxiosError) => {
            console.error(error);
            throw { isSucceed: false, error: error };
          })
        )
        .toPromise();

      if (res?.data?.errors?.length) {
        throw { isSucceed: false, error: res?.data?.errors };
      }

      const affectedRows = res?.data?.data?.delete_reviews?.affected_rows;
      if (affectedRows === 0) {
        throw { isSucceed: false, error: 'Failed to delete review.' };
      }
      return { isSucceed: true, error: res?.data?.errors };
    } catch (error) {
      console.error(error);
      throw { isSucceed: false, error: error };
    }
  }

  public async updateHotel(
    updateHotelData: UpdateHotelData
  ): Promise<ResponseOnUserPostRequest> {
    const res = await lastValueFrom(
      this.httpService
        .post(
          `${HASURA_URL}`,
          { query: updateHotelMutation(updateHotelData) },
          {
            headers: this.headersConfig,
          }
        )
        .pipe(
          catchError((error: any) => {
            console.error(error);
            throw { isSucceed: false, error: error };
          })
        )
    );

    if (res?.data?.errors?.length) {
      return { isSucceed: false, error: res?.data?.errors[0].message };
    }

    const update_trip_id = res?.data?.data?.update_trips?.returning[0].id;
    return { isSucceed: true, error: res?.data?.errors, id: update_trip_id };
  }

  public async updateFlight(
    updateFlightData: UpdateFlightData
  ): Promise<ResponseOnUserPostRequest> {
    const res = await lastValueFrom(
      this.httpService
        .post(
          `${HASURA_URL}`,
          { query: updateFlightMutation(updateFlightData) },
          {
            headers: this.headersConfig,
          }
        )
        .pipe(
          catchError((error: any) => {
            console.error(error);
            throw { isSucceed: false, error: error };
          })
        )
    );

    if (res?.data?.errors?.length) {
      return { isSucceed: false, error: res?.data?.errors[0].message };
    }

    const update_trip_id = res?.data?.data?.update_trips?.returning[0].id;
    return { isSucceed: true, error: res?.data?.errors, id: update_trip_id };
  }

  public async insertPlannedPrices(
    plannedPrices: PlannedPrice[]
  ): Promise<ResponseOnUserPostRequest> {
    const res = await lastValueFrom(
      this.httpService
        .post(HASURA_URL, insertPlannedPrices(plannedPrices), {
          headers: this.headersConfig,
        })
        .pipe(
          catchError((error: AxiosError) => {
            console.error(error);
            throw { isSucceed: false, error: error };
          })
        )
    );

    if (res?.data?.errors?.length) {
      return { isSucceed: false, error: res?.data?.errors[0].message };
    }

    return { isSucceed: true, error: res?.data?.errors };
  }

  public async updatePlannedPrices(
    plannedPrices: PlannedPrice[]
  ): Promise<ResponseOnUserPostRequest> {
    const res = await lastValueFrom(
      this.httpService
        .post(HASURA_URL, updatePlannedPricesMutation(plannedPrices), {
          headers: this.headersConfig,
        })
        .pipe(
          catchError((error: AxiosError) => {
            console.error(error);
            throw { isSucceed: false, error: error };
          })
        )
    );

    if (res?.data?.errors?.length) {
      return { isSucceed: false, error: res?.data?.errors[0].message };
    }

    return { isSucceed: true, error: res?.data?.errors };
  }

  public async insertOnePlannedPrice(
    plannedPrice: PlannedPrice
  ): Promise<ResponseOnUserPostRequest> {
    const res = await lastValueFrom(
      this.httpService
        .post(HASURA_URL, insertOnePlannedPrice(plannedPrice), {
          headers: this.headersConfig,
        })
        .pipe(
          catchError((error: AxiosError) => {
            console.error(error);
            throw { isSucceed: false, error: error };
          })
        )
    );

    if (res?.data?.errors?.length) {
      return { isSucceed: false, error: res?.data?.errors[0].message };
    }

    const plannedPriceId =
      res?.data?.data?.insert_plannedPrices?.returning[0].id;
    return { isSucceed: true, error: res?.data?.errors, id: plannedPriceId };
  }
}
