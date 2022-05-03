import { RestaurantDocument, RestaurantProps } from "../models";
export declare class RestaurantService {
    private static instance?;
    static getInstance(): RestaurantService;
    private constructor();
    createRestaurant(restaurant: Partial<RestaurantProps>): Promise<RestaurantDocument | null>;
    getAll(): Promise<RestaurantDocument[]>;
    getById(restaurantId: string | RestaurantProps): Promise<RestaurantDocument | null>;
    updateById(restaurantId: string, props: RestaurantProps): Promise<RestaurantDocument | null>;
    deleteById(restaurantId: string): Promise<boolean>;
}
