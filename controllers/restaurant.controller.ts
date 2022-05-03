import express, {Request, Response, Router} from "express";
import {RestaurantService} from "../services";
import {checkUserConnected, checkUserConnectedToRole} from "../middlewares";

export class RestaurantController {

    async createRestaurant(req: Request, res: Response) {
        try {
            const restaurant = await RestaurantService.getInstance().createRestaurant({
                name: req.body.name,
                address: req.body.address
            });
            res.json(restaurant);
        } catch(err) {
            res.status(400).end();
        }
    }

    async deleteRestaurant(req: Request, res: Response) {
        try {
            const success = await RestaurantService.getInstance().deleteById(req.params.restaurant_id);
            if(success) {
                res.status(204).end();
            } else {
                res.status(404).end();
            }
        } catch(err) {
            res.status(400).end();
        }
    }

    async updateRestaurant(req: Request, res: Response) {
        try {
            const restaurantUpdated = await RestaurantService.getInstance().updateById(req.params.restaurant_id, req.body);
            if(!restaurantUpdated) {
                res.status(404).end();
                return;
            }
            res.json(restaurantUpdated);
        } catch(err) {
            res.status(400).end();
        }
    }

    async getRestaurant(req: Request, res: Response) {
        try {
            const restaurant = await RestaurantService.getInstance().getById(req.params.restaurant_id);
            if(restaurant === null) {
                res.status(404).end();
                return;
            }
            res.json(restaurant);
        } catch(err) {
            res.status(400).end();
            return;
        }
    }

    async getAllRestaurant(req: Request, res: Response) {
        const restaurants = await RestaurantService.getInstance().getAll();
        res.json(restaurants);
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.post('/create', express.json(), checkUserConnectedToRole(5), this.createRestaurant.bind(this));
        router.get('/delete/:restaurant_id', checkUserConnectedToRole(5), this.deleteRestaurant.bind(this));
        router.post('/update/:restaurant_id', express.json(), checkUserConnectedToRole(5), this.updateRestaurant.bind(this));
        router.get('/get/:restaurant_id', checkUserConnected(), this.getRestaurant.bind(this));
        router.get('/get', checkUserConnected(), this.getAllRestaurant.bind(this));
        return router;
    }
}
