"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.get('/api/v1/teste', (req, res) => {
    res.send({ status: 200 });
});
const port = 3000;
app.listen(port, () => {
    console.log(`Server listen in http://localhost:${port}`);
});
