import {CategoryEnum} from "../category/category.enum";
import { User } from "../users/user";

export interface Cost {
    user_id: string;
    description: string;
    trip_id: string;
    cost: number;
    category: CategoryEnum;
    user?:User;
}
