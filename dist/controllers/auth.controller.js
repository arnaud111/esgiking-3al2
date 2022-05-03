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
exports.AuthController = void 0;
const express_1 = __importDefault(require("express"));
const services_1 = require("../services");
const middlewares_1 = require("../middlewares");
class AuthController {
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield services_1.AuthService.getInstance().subscribeUser({
                    name: req.body.name,
                    surname: req.body.surname,
                    email: req.body.email,
                    password: req.body.password,
                    role: req.body.role
                });
                res.json(user);
            }
            catch (err) {
                res.status(400).end();
            }
        });
    }
    logUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const platform = req.headers['user-agent'] || "Unknown";
            try {
                const session = yield services_1.AuthService.getInstance().logIn({
                    email: req.body.email,
                    password: req.body.password
                }, platform);
                res.json({
                    token: session === null || session === void 0 ? void 0 : session._id
                });
            }
            catch (err) {
                res.status(401).end(); // unauthorized
            }
        });
    }
    me(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.json(req.user);
        });
    }
    getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield services_1.AuthService.getInstance().getAll();
            res.json(users);
        });
    }
    getUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield services_1.AuthService.getInstance().getById(req.params.user_id);
                if (user === null) {
                    res.status(404).end();
                    return;
                }
                res.json(user);
            }
            catch (err) {
                res.status(400).end();
                return;
            }
        });
    }
    delUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // @ts-ignore
                const success = yield services_1.AuthService.getInstance().deleteById(req.user._id);
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
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // @ts-ignore
                const user = yield services_1.AuthService.getInstance().updateById(req.user._id, req.body);
                if (!user) {
                    res.status(404).end();
                    return;
                }
                res.json(user);
            }
            catch (err) {
                res.status(400).end();
            }
        });
    }
    updateRole(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // @ts-ignore
                const user = yield services_1.AuthService.getInstance().updateRole(req.body);
                if (!user) {
                    res.status(404).end();
                    return;
                }
                res.json(user);
            }
            catch (err) {
                res.status(400).end();
            }
        });
    }
    disconnectUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const authorization = req.headers['authorization'];
            if (authorization === undefined) {
                res.status(401).end();
                return;
            }
            const parts = authorization.split(" ");
            if (parts.length !== 2) {
                res.status(401).end();
                return;
            }
            if (parts[0] !== 'Bearer') {
                res.status(401).end();
                return;
            }
            const token = parts[1];
            try {
                const success = yield services_1.AuthService.getInstance().disconnect(token);
                if (success) {
                    res.status(204).end();
                }
                else {
                    res.status(404).end();
                }
            }
            catch (err) {
                res.status(401).end();
            }
        });
    }
    buildRoutes() {
        const router = express_1.default.Router();
        router.post('/subscribe', express_1.default.json(), this.createUser.bind(this));
        router.post('/login', express_1.default.json(), this.logUser.bind(this));
        router.get('/me', (0, middlewares_1.checkUserConnected)(), this.me.bind(this));
        router.get('/get/:user_id', (0, middlewares_1.checkUserConnectedToRole)(5), this.getUser.bind(this));
        router.get('/get', (0, middlewares_1.checkUserConnectedToRole)(5), this.getAllUsers.bind(this));
        router.post('/del', (0, middlewares_1.checkUserConnected)(), this.delUser.bind(this));
        router.post('/update', (0, middlewares_1.checkUserConnected)(), express_1.default.json(), this.updateUser.bind(this));
        router.post('/updateRole', (0, middlewares_1.checkUserConnectedToRole)(5), express_1.default.json(), this.updateRole.bind(this));
        router.get('/disconnect', this.disconnectUser.bind(this));
        return router;
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map