import { CalculatedPrice } from '../../../shared/models/calculatedPrices/calculatedPrice';
import { Cost } from '../../../shared/models/costs/cost';
import { UpdateFlightData } from '../../../shared/models/flights/updateFlightData';
import { Group } from '../../../shared/models/groups/group';
import { UserInGroup } from '../../../shared/models/groups/userInGroup';
import { UpdateHotelData } from '../../../shared/models/hotels/updateHotelData';
import { PlannedPrice } from '../../../shared/models/plannedPrices/plannedPrice';
import { Review } from '../../../shared/models/reviews/review';
import { UserInTrip } from '../../../shared/models/trips/userInTrip';
import { Trip } from '../../../shared/models/trips/userTrip';
import { User } from '../../../shared/models/users/user';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const stringifyObject = require('stringify-object');

export const getAllUsers = {
  query: `
      query {
        users {
          id,
          first_name,
          last_name,
          email,
          phone_number,
          password,
          reset_password_expired,
          reset_password_token,
          avatar_url
        }
    }
  `,
};

export const findUserByEmail = (email: string) => {
  return {
    query: `
      query {
        users(
          where: {email: {_eq: "${email}"}}
        ) {
          id,
          first_name,
          last_name,
          email,
          phone_number,
          password,
          reset_password_expired,
          reset_password_token,
          avatar_url
        }
      }
    `,
  };
};

export const findUserByResetToken = (resetToken: string) => {
  return {
    query: `
      query {
        users(
          where: {reset_password_token: {_eq: "${resetToken}"}}
        ) {
          id,
          first_name,
          last_name,
          email,
          phone_number,
          password,
          reset_password_expired,
          reset_password_token,
          avatar_url
        }
      }
    `,
  };
};

export const findUserById = (user_id: string) => {
  return {
    query: `
      query {
        users(
          where: {id: {_eq: "${user_id}"}}
        ) {
          id,
          first_name,
          last_name,
          email,
          phone_number,
          avatar_url
        }
      }
    `,
  };
};

export const findTripsByUserId = (userId: string) => {
  return {
    query: `
      query {
        trips(
          where: {user_id: {_eq: "${userId}"}}
        ) {
          id,
          start_date
          end_date
          flight_id
          hotel_id,
          hotels,
          flights,
          city_id,
          user_id,
          numberOfTravelers
          plannedPrices {
            id
            category
            price
          }
        }
      }
    `,
  };
};

export const findTripsByTripId = (tripId: string) => {
  return {
    query: `
      query {
        trips(
          where: {id: {_eq: "${tripId}"}}
        ) {
          id,
          start_date,
          end_date,
          flight_id
          hotel_id,
          hotels,
          flights,
          city_id,
          user_id,
          numberOfTravelers
          plannedPrices {
            id
            category
            price
          }
        }
      }
    `,
  };
};

export const findTripsByEndDate = (endDate: string) => {
  return {
    query: `
      query {
        trips(
          where: {end_date: {_eq: "${endDate}"}}
        ) {
          id,
          start_date
          end_date
          flight_id
          hotel_id,
          hotels,
          flights,
          city_id,
          numberOfTravelers,
          costs {
            id
            category
            cost
          }
        }
      }
    `,
  };
};

export const findPlannedPricesByTripId = (tripId: string) => {
  return {
    query: `
      query {
        plannedPrices(
          where: {trip_id: {_eq: "${tripId}"}}
        ) {
          id,
          trip_id,
          price,
          category
        }
      }
    `,
  };
};

export const findCostsByTripId = (tripId: string) => {
  return {
    query: `
      query {
        costs(
          where: {trip_id: {_eq: "${tripId}"}}
        ) {
          id,
          trip_id
          user_id
          cost
          description,
          category,
          user {
            id
            first_name
            last_name
          }
        }
      }
    `,
  };
};

export const findCalculatedPricesByCityId = (cityId: string) => {
  return {
    query: `
      query {
        calculatedPrices(
          where: {city_id: {_eq: "${cityId}"}}
        ) {
          id,
          city_id
          category
          numberOfTrips
          price,
        }
      }
    `,
  };
};

export const insertOneUser = (user: User) => {
  const avatar_url = user.avatar_url
    ? `${user.avatar_url.replace(/["\\"]/g, '/')}`
    : `https://api.multiavatar.com/${user.email.toLowerCase()}.png?apikey=MUN0hC9vlqQm7j`;
  return {
    query: `
      mutation {
        insert_users(
            objects: [
              {
                first_name: "${user.first_name}",
                last_name: "${user.last_name}",
                email: "${user.email.toLowerCase()}",
                phone_number: "${user.phone_number}",
                avatar_url: "${avatar_url}",
                password: "${user.password}",
              }
            ]
          ) {
          returning {
            id
          }
        }
      }
    `,
  };
};

export const createGroup = (group: Group) => {
  return {
    query: `
      mutation {
        insert_groups(
            objects: [
              {
                name: "${group.name}",
                user_id: "${group.user_id}"
              }
            ]
          ) {
          returning {
            id
            name
            user_id
          }
        }
      }
    `,
  };
};

export const insertUserInGroup = (userInGroup: UserInGroup) => {
  return {
    query: `
      mutation {
        insert_userInGroup(
            objects: [
              {
                group_id: "${userInGroup.group_id}",
                user_id: "${userInGroup.user_id}"
              }
            ]
          ) {
          returning {
            id
          }
        }
      }
    `,
  };
};

export const findGroupById = (id: string) => {
  return {
    query: `
      query {
        groups(
          where: {id: {_eq: "${id}"}}
        ) {
          name
          id
          user_id
        }
      }
    `,
  };
};

export const findGroupByUserId = (user_id: string) => {
  return {
    query: `
      query {
        groups(
          where: {user_id: {_eq: "${user_id}"}}
        ) {
          name
          id
          user_id
        }
      }
    `,
  };
};

export const findUserInGroupByUserId = (user_id: string) => {
  return {
    query: `
      query {
        userInGroup(
          where: {user_id: {_eq: "${user_id}"}}
        ) {
          group_id
          id
          user_id
        }
      }
    `,
  };
};

export const findUserInGroupByGroupId = (group_id: string) => {
  return {
    query: `
      query {
        userInGroup(
          where: {group_id: {_eq: "${group_id}"}}
        ) {
          group_id
          id
          user_id
        }
      }
    `,
  };
};
// export const updateUserAvatar = (userID: string, userEmail: string) => {
//   return {
//     query: `
//     mutation {
//       update_users(where: {id: {_eq: "${userID}"}},
//       _set: {avatar_url: "https://api.multiavatar.com/${userEmail.toLowerCase()}.png?apikey=MUN0hC9vlqQm7j"}) {
//         returning {
//           email
//         }
//         affected_rows
//       }
//     }
//     `,
//   };
// };

export const insertOneCost = (cost: Cost) => {
  return {
    query: `
      mutation {
        insert_costs(
            objects: [
              {
                user_id: "${cost.user_id}",
                trip_id: "${cost.trip_id}",
                description: "${cost.description}",
                category: "${cost.category}",
                cost: "${cost.cost}"
              }
            ]
          ) {
          returning {
            id
          }
        }
      }
    `,
  };
};

export const insertOnePlannedPrice = (plannedPrice: PlannedPrice) => {
  return {
    query: `
      mutation {
        insert_plannedPrices(
            objects: [
              {
                trip_id: "${plannedPrice.trip_id}",
                category: "${plannedPrice.category}",
                price: "${plannedPrice.price}"
              }
            ]
          ) {
          returning {
            id
          }
        }
      }
    `,
  };
};

// flight: ${JSON.stringify(trip.flight)},

export const insertOneTrip = (trip: Trip) => {
  const string = {
    query: `
      mutation {
        insert_trips(
            objects: [
              {
                start_date: "${trip.start_date}",
                end_date: "${trip.end_date}",
                user_id: "${trip.user_id}",
                numberOfTravelers: "${trip.numberOfTravelers}",
                hotels: ${stringifyObject(trip.hotels, {
                  singleQuotes: false,
                })},
                flights: ${stringifyObject(trip.flights, {
                  singleQuotes: false,
                })},
                city_id: "${trip.city_id}",
              }
            ]
          ) {
          returning {
            id
          }
        }
      }
    `,
  };
  return string;
};

export const removeOneTrip = (tripId: string) => {
  return {
    query: `
      mutation {
        delete_trips(
          where: { id: { _eq: "${tripId}" } }
        ) {
          affected_rows
        }
      }
    `,
  };
};

export const removeTripCosts = (tripId: string) => {
  return {
    query: `
      mutation {
        delete_costs(
          where: {trip_id: {_eq: "${tripId}"}}
          ) {
          affected_rows
        }
      }
    `,
  };
};

export const removeTripFromUserInTrip = (tripId: string) => {
  return {
    query: `
      mutation {
        delete_userInTrip(
            where: {trip_id: {_eq: "${tripId}"}}
          ) {
          affected_rows
        }
      }
    `,
  };
};

export const removeUserFromTrip = (userInTrip: UserInTrip) => {
  return {
    query: `
      mutation {
        delete_userInTrip(
            where: {id: {_eq: "${userInTrip.id}"}}
          ) {
          affected_rows
        }
      }
    `,
  };
};

export const removeUserFromGroupByGroupId = (groupId: string) => {
  return {
    query: `
      mutation {
        delete_userInGroup(
            where: {group_id: {_eq: "${groupId}"}}
          ) {
          affected_rows
        }
      }
    `,
  };
};

export const removeUserFromGroupByUserId = (userId: string) => {
  return {
    query: `
      mutation {
        delete_userInGroup(
            where: {user_id: {_eq: "${userId}"}}
          ) {
          affected_rows
        }
      }
    `,
  };
};

export const removeGroup = (groupId: string) => {
  return {
    query: `
      mutation {
        delete_groups(
            where: {id: {_eq: "${groupId}"}}
          ) {
          affected_rows
        }
      }
    `,
  };
};

export const insertUserInTrip = (userInTrip: UserInTrip) => {
  return {
    query: `
      mutation {
        insert_userInTrip(
            objects: [
              {
                trip_id: "${userInTrip.trip_id}",
                user_id: "${userInTrip.user_id}",
              }
            ]
          ) {
          returning {
            id
          }
        }
      }
    `,
  };
};

export const getUsersInTrip = (tripId: string) => {
  return {
    query: `
      query {
        userInTrip(
          where: {trip_id: {_eq: "${tripId}"}}
        ) {
          trip_id
          user_id
          id
        }
      }
    `,
  };
};

export const getUsersInTripByUserId = (userId: string) => {
  return {
    query: `
      query {
        userInTrip(
          where: {user_id: {_eq: "${userId}"}}
        ) {
          trip_id
          user_id
          id
        }
      }
    `,
  };
};

export const deleteOneUser = (userID: string) => {
  return {
    query: `
      mutation {
        delete_users_by_pk (
          id: "${userID}"
        ) {
          id,
          email,
          first_name,
          last_name
        }
      }
    `,
  };
};

export const updateUserResetPassword = (
  userEmail: string,
  resetPasswordToken: string,
  resetPasswordExpired: number
) => {
  return {
    query: `
      mutation {
        update_users(where: {email: {_eq: "${userEmail.toLowerCase()}"}}, _set: {reset_password_expired: "${resetPasswordExpired}", reset_password_token: "${resetPasswordToken}"}) {
          returning {
            id
            email,
            first_name,
            last_name
          }
          affected_rows
        }
      }
    `,
  };
};

export const resetUserPassword = (
  userEmail: string,
  userNewPassword: string
) => {
  return {
    query: `
      mutation {
        update_users(where: {email: {_eq: "${userEmail.toLowerCase()}"}}, _set: {password: "${userNewPassword}",reset_password_expired: null, reset_password_token: null}) {
          returning {
            id
            email,
            first_name,
            last_name
          }
          affected_rows
        }
      }
    `,
  };
};

export const insertOneReview = (review: Review) => {
  return {
    query: `
      mutation {
        insert_reviews_one(
            object:
              {
                city_name: "${review.city_name}",
                description: "${review.description}",
                user_id: "${review.user_id}",
                price_rating: "${review.price_rating}",
                rating: "${review.rating}",
                title: "${review.title}",
              }
          ) {
            id
        }
      }
    `,
  };
};

export const findReviews = () => {
  return {
    query: `
      query {
        reviews {
          id,
          city_name
          description
          price_rating
          rating,
          title,
          user_id
          user {
            id
            first_name
            last_name,
            avatar_url
          }
        }
      }
    `,
  };
};

export const removeOneReview = (reviewId: string) => {
  return {
    query: `
      mutation {
        delete_reviews(
          where: { id: { _eq: "${reviewId}" } }
        ) {
          affected_rows
        }
      }
    `,
  };
};

export const updateOneReview = (review: Review) => {
  return `
    mutation {
      update_reviews(
        where: { id: { _eq: "${review.id}" } },
        _set: {
          city_name: "${review.city_name}",
          description: "${review.description}",
          user_id: "${review.user_id}",
          price_rating: "${review.price_rating}",
          rating: "${review.rating}",
          title: "${review.title}",
        }
      ) {
        returning {
          id
        }
      }
    }
  `;
};

export const insertPlannedPrices = (plannedPrices: PlannedPrice[]) => {
  let mutation = `
    mutation {
      insert_plannedPrices(objects:[`;

  plannedPrices.forEach((plannedPrice) => {
    mutation += ` {
      trip_id: "${plannedPrice.trip_id}",
      category: "${plannedPrice.category}",
      price:${plannedPrice.price}
    }`;
  });

  mutation += `]) {
      returning {
        id
      }
    }
  }`;

  return {
    query: mutation,
  };
};

export const updatePlannedPricesMutation = (plannedPrices: PlannedPrice[]) => {
  let mutation = `
    mutation {
      update_plannedPrices_many(updates: [`;

  plannedPrices.forEach((plannedPrice) => {
    mutation += `{
      _set: {price: ${plannedPrice.price}},
      where: {id: { _eq: "${plannedPrice.id}"}}
    }`;
  });

  mutation += `]) {
      returning {
        id
      }
    }
  }`;

  return {
    query: mutation,
  };
};

export const insertCalculatedPrices = (calculatedPrices: CalculatedPrice[]) => {
  let mutation = `
    mutation {
      insert_calculatedPrices(objects:[`;

  calculatedPrices.forEach((calculatedPrice) => {
    mutation += ` {
      city_id: "${calculatedPrice.city_id}",
      category: "${calculatedPrice.category}",
      numberOfTrips: ${calculatedPrice.numberOfTrips},
      price:${calculatedPrice.price}
    }`;
  });

  mutation += `]) {
      returning {
        id
      }
    }
  }`;

  return {
    query: mutation,
  };
};

export const updateCalculatedPricesMutation = (
  calculatedPrices: CalculatedPrice[]
) => {
  let mutation = `
    mutation {
      update_calculatedPrices_many(updates: [`;

  calculatedPrices.forEach((calculatedPrice) => {
    mutation += `{
      _set: {price: ${calculatedPrice.price}, numberOfTrips: ${calculatedPrice.numberOfTrips}},
      where: {id: { _eq: "${calculatedPrice.id}"}}
    }`;
  });

  mutation += `]) {
      returning {
        id
      }
    }
  }`;

  return {
    query: mutation,
  };
};

export const updateHotelMutation = (updateHotelData: UpdateHotelData) => {
  return `
      mutation {
        update_trips(
          where: { id: { _eq: "${updateHotelData.tripId}" } },
          _set: { hotel_id: "${
            updateHotelData.hotelId
          }", hotels: ${stringifyObject(updateHotelData.hotel, {
    singleQuotes: false,
  })} }
        ) {
          returning {
            id
          }
        }
      }
    `;
};

export const updateFlightMutation = (updateFlightData: UpdateFlightData) => {
  return `
      mutation {
        update_trips(
          where: { id: { _eq: "${updateFlightData.tripId}" } },
          _set: { flight_id: "${
            updateFlightData.flightId
          }", flights: ${stringifyObject(updateFlightData.flight, {
    singleQuotes: false,
  })} }
        ) {
          returning {
            id
          }
        }
      }
    `;
};
