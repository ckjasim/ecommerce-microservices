"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("../controller/user-controller"));
const controller = new user_controller_1.default();
const Router = express_1.default.Router();
Router.route('/registerUser').post(controller.registerUser.bind(controller));
Router.route('/login').post(controller.login.bind(controller));
exports.default = Router;
//# sourceMappingURL=router.js.map