"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router_1 = __importDefault(require("./routes/router"));
const dbConnect_1 = __importDefault(require("./config/dbConnect"));
(0, dbConnect_1.default)();
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use("/api/users", router_1.default);
app.listen(3000, () => {
    console.log("Listening on port 3000");
});
//# sourceMappingURL=server.js.map