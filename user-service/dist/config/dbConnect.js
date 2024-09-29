"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = dbConnect;
const mongoose_1 = require("mongoose");
const dbUrl = 'mongodb+srv://jasim:XTlFg5ggiUVQvN9n@cluster0.ijunqha.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
async function dbConnect() {
    await (0, mongoose_1.connect)(dbUrl)
        .then(() => {
        console.log("connected to DB");
    })
        .catch((err) => {
        console.log(err);
    });
}
//# sourceMappingURL=dbConnect.js.map