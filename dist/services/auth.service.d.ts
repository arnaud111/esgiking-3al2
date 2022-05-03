import { UserDocument, UserProps } from "../models";
import { SessionDocument } from "../models/session.model";
export declare class AuthService {
    private static instance?;
    static getInstance(): AuthService;
    private constructor();
    subscribeUser(user: Partial<UserProps>): Promise<UserDocument>;
    logIn(info: Pick<UserProps, 'email' | 'password'>, platform: string): Promise<SessionDocument | null>;
    getAll(): Promise<UserDocument[]>;
    getById(userId: string): Promise<UserDocument | null>;
    updateById(userId: string, props: UserProps): Promise<UserDocument | null>;
    getUserFrom(token: string): Promise<UserProps | null>;
    deleteById(userId: string): Promise<boolean>;
    disconnect(token: string): Promise<boolean>;
    updateRole(props: UserProps): Promise<UserDocument | null>;
}
