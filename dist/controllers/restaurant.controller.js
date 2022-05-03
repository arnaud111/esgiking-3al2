"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantController = void 0;
const express_1 = __importDefault(require("express"));
const services_1 = require("../services");
const middlewares_1 = require("../middlewares");
class RestaurantController {
    createRestaurant(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const restaurant = yield services_1.RestaurantService.getInstance().createRestaurant({
                    name: req.body.name,
                    address: req.body.address
                });
                res.json(restaurant);
            }
            catch (err) {
                res.status(400).end();
            }
        });
    }
    deleteRestaurant(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const success = yield services_1.RestaurantService.getInstance().deleteById(req.params.restaurant_id);
                if (success) {
                    res.status(204).end();
                }
                else {
                    res.status(404).end();
                }
            }
            catch (err) {
                res.status(400).end();
            }
        });
    }
    updateRestaurant(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const restaurantUpdated = yield services_1.RestaurantService.getInstance().updateById(req.params.restaurant_id, req.body);
                if (!restaurantUpdated) {
                    res.status(404).end();
                    return;
                }
                res.json(restaurantUpdated);
            }
            catch (err) {
                res.status(400).end();
            }
        });
    }
    getRestaurant(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const restaurant = yield services_1.RestaurantService.getInstance().getById(req.params.restaurant_id);
                if (restaurant === null) {
                    res.status(404).end();
                    return;
                }
                res.json(restaurant);
            }
            catch (err) {
                res.status(400).end();
                return;
            }
        });
    }
    getAllRestaurant(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const restaurants = yield services_1.RestaurantService.getInstance().getAll();
            res.json(restaurants);
        });
    }
    buildRoutes() {
        const router = express_1.default.Router();
        router.post('/create', express_1.default.json(), (0, middlewares_1.checkUserConnectedToRole)(5), this.createRestaurant.bind(this));
        router.get('/delete/:restaurant_id', (0, middlewares_1.checkUserConnectedToRole)(5), this.deleteRestaurant.bind(this));
        router.post('/update/:restaurant_id', express_1.default.json(), (0, middlewares_1.checkUserConnectedToRole)(5), this.updateRestaurant.bind(this));
        router.get('/get/:restaurant_id', (0, middlewares_1.checkUserConnected)(), this.getRestaurant.bind(this));
        router.get('/get', (0, middlewares_1.checkUserConnected)(), this.getAllRestaurant.bind(this));
        return router;
    }
}
exports.RestaurantController = RestaurantController;
//# sourceMappingURL=restaurant.controller.js.map