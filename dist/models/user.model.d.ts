import { Document, Model } from "mongoose";
import { SessionProps } from "./session.model";
import { RestaurantProps } from "./restaurant.model";
export interface UserProps {
    _id: string;
    name: string;
    surname: string;
    email: string;
    password: string;
    role: number;
    restaurant: string | RestaurantProps;
    sessions: string[] | SessionProps[];
}
export declare type UserDocument = UserProps & Document;
export declare const UserModel: Model<UserDocument>;
