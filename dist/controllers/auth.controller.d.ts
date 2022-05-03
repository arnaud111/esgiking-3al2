import { Request, Response, Router } from "express";
export declare class AuthController {
    createUser(req: Request, res: Response): Promise<void>;
    logUser(req: Request, res: Response): Promise<void>;
    me(req: Request, res: Response): Promise<void>;
    getAllUsers(req: Request, res: Response): Promise<void>;
    getUser(req: Request, res: Response): Promise<void>;
    delUser(req: Request, res: Response): Promise<void>;
    updateUser(req: Request, res: Response): Promise<void>;
    updateRole(req: Request, res: Response): Promise<void>;
    disconnectUser(req: Request, res: Response): Promise<void>;
    buildRoutes(): Router;
}
