import express from "express";
import authCookiesModel from "../mysqlModels/authcookies.js";
const logout = express.Router();

logout.post("/", async (req, res) => {
    if (req.body.cookie == undefined || req.body.key == undefined) {
        res.sendStatus(500);
        return;
    }

    const verifyCookie = await authCookiesModel.verifyCookie(req.body.cookie, req.body.key);

    if (!verifyCookie.status) {
        res.sendStatus(501);
        return;
    }

    await authCookiesModel.removeCookie(req.body.cookie);
    res.sendStatus(200);
});

export default logout;