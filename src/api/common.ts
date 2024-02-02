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

if (!process.env.FRONT_END_URL) {
    throw Error("Could not find FRONT_END_URL in your environment");
}
if (!process.env.CLIENT_ID) {
    throw Error("Could not find CLIENT_ID in your environment");
}
if (!process.env.CLIENT_SECRET) {
    throw Error("Could not find CLIENT_SECRET in your environment");
}

export const FRONT_END_URL = `${process.env.FRONT_END_URL}/auth`;
export const CLIENT_ID = process.env.CLIENT_ID;
export const CLIENT_SECRET = process.env.CLIENT_SECRET;

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