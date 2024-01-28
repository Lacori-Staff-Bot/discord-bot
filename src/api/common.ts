import express from "express";
import BodyParser from "body-parser";
import cors from "cors";

import auth from "./auth.js";
import logout from "./logout.js";
import dashboard from "./dashboard.js";
import mainSettings from "./mainSettings.js";
import restrictions from "./restrictions.js";
import activeBans from "./activeBans.js";
import activeWarns from "./activeWarns.js";
import activeBloks from "./activeBlocks.js";

export const REDIRECT_URI = "http://localhost:3000/auth";
export const CLIENT_ID = "1186970730412388382";
export const CLIENT_SECRET = "IWtp5bojjBbH6RAma0mLMGMKAuCBc7DR";

export const app = express();
app.use(BodyParser.json());
app.use(cors({ origin: true }));

app.use("/auth", auth);
app.use("/logout", logout);
app.use("/dashboard", dashboard);
app.use("/main_settings", mainSettings);
app.use("/restrictions", restrictions);
app.use("/active_bans", activeBans);
app.use("/active_warns", activeWarns);
app.use("/active_blocks", activeBloks);