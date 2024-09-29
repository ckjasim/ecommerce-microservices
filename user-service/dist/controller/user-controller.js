"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = __importDefault(require("../model/userModel"));
class UserController {
    constructor() {
        this.userModel = userModel_1.default;
    }
    async registerUser(req, res) {
        try {
            const { name, email, password } = req.body;
            const userData = await this.userModel.findOne({ email });
            if (userData) {
                return res.status(400).json({ message: "User already exists" });
            }
            const user = await this.userModel.create({ name, email, password });
            return res.status(201).json({ message: "User created", user });
        }
        catch (error) {
            console.log(error);
            return res
                .status(500)
                .json({ message: "An internal server error occurred" });
        }
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const userData = await this.userModel.findOne({ email });
            if (!userData) {
                return res.status(400).json({ message: "User doesnt exists" });
            }
            else {
                const isMatch = userData.comparePassword(password);
                if (!isMatch) {
                    return res.status(400).json({ message: "Incorrect password" });
                }
                else {
                    return res.status(200).json({ message: "User successfully logged in" });
                }
            }
        }
        catch (error) { }
    }
}
exports.default = UserController;
//# sourceMappingURL=user-controller.js.map