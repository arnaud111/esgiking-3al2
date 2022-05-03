import {UserDocument, UserModel, UserProps} from "../models";
import {SecurityUtils} from "../utils";
import {SessionDocument, SessionModel} from "../models/session.model";
import {Session} from "inspector";
import {RestaurantService} from "./restaurant.service";

export class AuthService {

    private static instance?: AuthService;

    public static getInstance(): AuthService {
        if(AuthService.instance === undefined) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    private constructor() { }

    public async subscribeUser(user: Partial<UserProps>): Promise<UserDocument> {
        if(!user.name) {
            throw new Error('Missing name');
        } if(!user.surname) {
            throw new Error('Missing surname');
        } if(!user.password) {
            throw new Error('Missing password');
        } if(!user.role) {
            user.role = 1;
        }
        const model = new UserModel({
            name: user.name,
            surname: user.surname,
            email: user.email,
            password: SecurityUtils.sha512(user.password),
            role: user.role
        }); 
        return model.save();
    }

    public async logIn(info: Pick<UserProps, 'email' | 'password'>, platform: string): Promise<SessionDocument | null> {
        const user = await UserModel.findOne({
            email: info.email,
            password: SecurityUtils.sha512(info.password)
        }).exec();
        if(user === null) {
            throw new Error('User not found');
        }
        // 604_800 -> 1 week in seconds
        const currentDate = new Date();
        const expirationDate = new Date(currentDate.getTime() + 604_800_000);
        const session = await SessionModel.create({
            platform,
            expiration: expirationDate,
            user: user._id
        });
        user.sessions.push(session._id); // permet de memoriser la session dans le user
        await user.save();
        return session;
    }

    async getAll(): Promise<UserDocument[]> {
        return UserModel.find().exec();
    }

    async getById(userId: string): Promise<UserDocument | null> {
        return UserModel.findById(userId).exec();
    }

    async updateById(userId: string, props: UserProps): Promise<UserDocument | null> {
        const user = await this.getById(userId);
        if(!user) {
            return null;
        }
        if(props.restaurant !== undefined) {
            const restaurant = RestaurantService.getInstance().getById(props.restaurant);
            if (!restaurant)
                return null;
            user.restaurant = props.restaurant;
        } if(props.name !== undefined) {
            user.name = props.name;
        } if(props.surname !== undefined) {
            user.surname = props.surname;
        }
        const res = await user.save();
        return res;
    }

    public async getUserFrom(token: string): Promise<UserProps | null> {
        const session = await SessionModel.findOne({
           _id: token,
           expiration: {
               $gte: new Date()
           }
        }).populate("user").exec();
        return session ? session.user as UserProps : null;
    }

    async deleteById(userId: string): Promise<boolean> {
        const res = await UserModel.deleteOne({_id: userId}).exec();
        return res.deletedCount === 1;
    }

    async disconnect(token: string): Promise<boolean> {
        const res = await SessionModel.deleteOne({_id: token}).exec();
        return res.deletedCount === 1;
    }

    async updateRole(props: UserProps): Promise<UserDocument | null> {
        if (props._id == undefined) {
            return null;
        }
        const user = await this.getById(props._id);
        if(!user) {
            return null;
        } if(props.role !== undefined) {
            user.role = props.role;
        }
        const res = await user.save();
        return res;
    }
}
