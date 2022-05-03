import { RequestHandler } from "express";
import { UserProps } from "../models";
declare module 'express' {
    interface Request {
        user?: UserProps;
        files?: any;
    }
}
export declare function checkUserConnected(): RequestHandler;
export declare function checkUserConnectedToRole(role: number): RequestHandler;
