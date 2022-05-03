import express, {Request, Response, Router} from "express";
import {AuthService} from "../services";
import {checkUserConnected, checkUserConnectedToRole} from "../middlewares";

export class AuthController {

    async createUser(req: Request, res: Response) {
        try {
            const user = await AuthService.getInstance().subscribeUser({
                name: req.body.name,
                surname: req.body.surname,
                email: req.body.email,
                password: req.body.password,
                role: req.body.role
            });
            res.json(user);
        } catch(err) {
            res.status(400).end();
        }
    }

    async logUser(req: Request, res: Response) {
        const platform = req.headers['user-agent'] || "Unknown";
        try {
            const session = await AuthService.getInstance().logIn({
                email: req.body.email,
                password: req.body.password
            }, platform);
            res.json({
                token: session?._id
            });
        } catch(err) {
            res.status(401).end(); // unauthorized
        }
    }

    async me(req: Request, res: Response) {
        res.json(req.user);
    }

    async getAllUsers(req: Request, res: Response) {
        const users = await AuthService.getInstance().getAll();
        res.json(users);
    }

    async getUser(req: Request, res: Response) {
        try {
            const user = await AuthService.getInstance().getById(req.params.user_id);
            if(user === null) {
                res.status(404).end();
                return;
            }
            res.json(user);
        } catch(err) {
            res.status(400).end();
            return;
        }
    }

    async delUser(req: Request, res: Response) {
        try {
            // @ts-ignore
            const success = await AuthService.getInstance().deleteById(req.user._id);
            if(success) {
                res.status(204).end();
            } else {
                res.status(404).end();
            }
        } catch(err) {
            res.status(400).end();
        }
    }

    async updateUser(req: Request, res: Response) {
        try {
            // @ts-ignore
            const user = await AuthService.getInstance().updateById(req.user._id, req.body);
            if(!user) {
                res.status(404).end();
                return;
            }
            res.json(user);
        } catch (err) {
            res.status(400).end();
        }
    }

    async updateRole(req: Request, res: Response) {
        try {
            // @ts-ignore
            const user = await AuthService.getInstance().updateRole(req.body);
            if(!user) {
                res.status(404).end();
                return;
            }
            res.json(user);
        } catch (err) {
            res.status(400).end();
        }
    }

    async disconnectUser(req: Request, res: Response) {
        const authorization = req.headers['authorization'];
        if(authorization === undefined) {
            res.status(401).end();
            return;
        }
        const parts = authorization.split(" ");
        if(parts.length !== 2) {
            res.status(401).end();
            return;
        } if(parts[0] !== 'Bearer') {
            res.status(401).end();
            return;
        }
        const token = parts[1];
        try {
            const success = await AuthService.getInstance().disconnect(token);
            if(success) {
                res.status(204).end();
            } else {
                res.status(404).end();
            }
        } catch(err) {
            res.status(401).end();
        }
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.post('/subscribe', express.json(), this.createUser.bind(this));
        router.post('/login', express.json(), this.logUser.bind(this));
        router.get('/me', checkUserConnected(), this.me.bind(this));
        router.get('/get/:user_id', checkUserConnectedToRole(5), this.getUser.bind(this));
        router.get('/get', checkUserConnectedToRole(5), this.getAllUsers.bind(this));
        router.post('/del', checkUserConnected(), this.delUser.bind(this));
        router.post('/update', checkUserConnected(), express.json(), this.updateUser.bind(this));
        router.post('/updateRole', checkUserConnectedToRole(5), express.json(), this.updateRole.bind(this));
        router.get('/disconnect', this.disconnectUser.bind(this));
        return router;
    }
}
