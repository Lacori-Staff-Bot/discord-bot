import express from "express";
import BodyParser from "body-parser";
import cors from "cors";

import auth from "./auth.js";
import dashboard from "./dashboard.js";
import mainSettings from "./mainSettings.js";
import restrictions from "./restrictions.js";

export const REDIRECT_URI = "http://localhost:3000/auth";
export const CLIENT_ID = "1186970730412388382";
export const CLIENT_SECRET = "IWtp5bojjBbH6RAma0mLMGMKAuCBc7DR";

export const app = express();
app.use(BodyParser.json());
app.use(cors({ origin: true }));

app.use("/auth", auth);
app.use("/dashboard", dashboard);
app.use("/main_settings", mainSettings);
app.use("/restrictions", restrictions);