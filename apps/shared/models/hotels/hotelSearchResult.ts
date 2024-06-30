export interface HotelSearchResult {
    hotel: Hotel;
    offers: HotelOffers[];
    imagesURI: string[];
}

export interface Hotel {
    hotelId: string;
    name: string;
    cityCode: string;
}

export interface HotelOffers {
    checkInDate: string;
    checkOutDate: string;
    boardType: string;
    room: Room;
    guests: Guests;
    price: Price;
}

export interface Room {
    typeEstimated?: RoomType;
}

export interface RoomType {
    category: string;
    beds: string;
    bedType: string;
}

export interface Guests {
    adults: string;
}

export interface Price {
    currency: string;
    total: number;
}