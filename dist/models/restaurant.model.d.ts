import { Document, Model } from "mongoose";
export interface RestaurantProps {
    _id: string;
    name: string;
    address: string;
}
export declare type RestaurantDocument = RestaurantProps & Document;
export declare const RestaurantModel: Model<RestaurantDocument>;
