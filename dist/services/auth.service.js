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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const models_1 = require("../models");
const utils_1 = require("../utils");
const session_model_1 = require("../models/session.model");
const restaurant_service_1 = require("./restaurant.service");
class AuthService {
    constructor() { }
    static getInstance() {
        if (AuthService.instance === undefined) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }
    subscribeUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user.name) {
                throw new Error('Missing name');
            }
            if (!user.surname) {
                throw new Error('Missing surname');
            }
            if (!user.password) {
                throw new Error('Missing password');
            }
            if (!user.role) {
                user.role = 1;
            }
            const model = new models_1.UserModel({
                name: user.name,
                surname: user.surname,
                email: user.email,
                password: utils_1.SecurityUtils.sha512(user.password),
                role: user.role
            });
            return model.save();
        });
    }
    logIn(info, platform) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield models_1.UserModel.findOne({
                email: info.email,
                password: utils_1.SecurityUtils.sha512(info.password)
            }).exec();
            if (user === null) {
                throw new Error('User not found');
            }
            // 604_800 -> 1 week in seconds
            const currentDate = new Date();
            const expirationDate = new Date(currentDate.getTime() + 604800000);
            const session = yield session_model_1.SessionModel.create({
                platform,
                expiration: expirationDate,
                user: user._id
            });
            user.sessions.push(session._id); // permet de memoriser la session dans le user
            yield user.save();
            return session;
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return models_1.UserModel.find().exec();
        });
    }
    getById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return models_1.UserModel.findById(userId).exec();
        });
    }
    updateById(userId, props) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.getById(userId);
            if (!user) {
                return null;
            }
            if (props.restaurant !== undefined) {
                const restaurant = restaurant_service_1.RestaurantService.getInstance().getById(props.restaurant);
                if (!restaurant)
                    return null;
                user.restaurant = props.restaurant;
            }
            if (props.name !== undefined) {
                user.name = props.name;
            }
            if (props.surname !== undefined) {
                user.surname = props.surname;
            }
            const res = yield user.save();
            return res;
        });
    }
    getUserFrom(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield session_model_1.SessionModel.findOne({
                _id: token,
                expiration: {
                    $gte: new Date()
                }
            }).populate("user").exec();
            return session ? session.user : null;
        });
    }
    deleteById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield models_1.UserModel.deleteOne({ _id: userId }).exec();
            return res.deletedCount === 1;
        });
    }
    disconnect(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield session_model_1.SessionModel.deleteOne({ _id: token }).exec();
            return res.deletedCount === 1;
        });
    }
    updateRole(props) {
        return __awaiter(this, void 0, void 0, function* () {
            if (props._id == undefined) {
                return null;
            }
            const user = yield this.getById(props._id);
            if (!user) {
                return null;
            }
            if (props.role !== undefined) {
                user.role = props.role;
            }
            const res = yield user.save();
            return res;
        });
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map