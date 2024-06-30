import { User } from "../users/user";

export interface Review {
    id?: string;
    user_id: string;
    city_name: string;
    description: string;
    price_rating: number;
    rating: number;
    title: string;
    user?: User;
  };
  