import { HotelSearchOffer } from './hotelSearchOffer';

export interface UpdateHotelData {
  tripId: string;
  hotelId: string;
  hotel: HotelSearchOffer;
}
