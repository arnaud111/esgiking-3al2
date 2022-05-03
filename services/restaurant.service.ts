import {RestaurantDocument, RestaurantModel, RestaurantProps} from "../models";
import {SecurityUtils} from "../utils";

export class RestaurantService {

    private static instance?: RestaurantService;

    public static getInstance(): RestaurantService {
        if(RestaurantService.instance === undefined) {
            RestaurantService.instance = new RestaurantService();
        }
        return RestaurantService.instance;
    }

    private constructor() { }

    public async createRestaurant(restaurant: Partial<RestaurantProps>): Promise<RestaurantDocument | null> {

        const model = new RestaurantModel({
            name: restaurant.name,
            address: restaurant.address
        });

        return model.save();
    }

    async getAll(): Promise<RestaurantDocument[]> {
        return RestaurantModel.find().exec();
    }

    async getById(restaurantId: string | RestaurantProps): Promise<RestaurantDocument | null> {
        return RestaurantModel.findById(restaurantId).exec();
    }

    async updateById(restaurantId: string, props: RestaurantProps): Promise<RestaurantDocument | null> {
        const restaurant = await this.getById(restaurantId);
        if(!restaurant) {
            return null;
        }
        if(props.name !== undefined) {
            restaurant.name = props.name;
        } if(props.address !== undefined) {
            restaurant.address = props.address;
        }
        const res = await restaurant.save();
        return res;
    }

    async deleteById(restaurantId: string): Promise<boolean> {
        const res = await RestaurantModel.deleteOne({_id: restaurantId}).exec();
        return res.deletedCount === 1;
    }
}
