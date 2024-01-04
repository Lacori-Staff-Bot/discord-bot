import express from "express";
import BodyParser from "body-parser";

const app = express();
app.use(BodyParser.json());

export default app;