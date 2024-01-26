import express from "express";
import request from "request";
import authTokensModel from "../mysqlModels/authtokens.js";
import authCookiesModel from "../mysqlModels/authcookies.js";
import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } from "./common.js";
const auth = express.Router();

interface Token {
    token_type: string,
    access_token: string,
    expires_in: number,
    refresh_token: string,
    scope: string
}

interface User {
    id: string
    username: string
    avatar: string | null
    discriminator: string
    public_flags: number
    premium_type: number
    flags: number
    banner: string | null
    accent_color: number | null
    global_name: string | null
    avatar_decoration_data: string | null
    banner_color: string
    mfa_enabled: boolean
    locale: string
}

auth.post("/", async (req, res) => {
    var params = [];
    params.push("client_id=" + CLIENT_ID);
    params.push("client_secret=" + CLIENT_SECRET);
    params.push("grant_type=authorization_code");
    params.push("code=" + req.body.code);
    params.push("redirect_uri=" + REDIRECT_URI);
    params.push("scope=identify");

    request("https://discord.com/api/oauth2/token", {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        body: params.join("&")
    }, (tokenError, tokenResponse, tokenBody) => {
        if (tokenError) {
            console.log(tokenError);
            res.sendStatus(500);
            return;
        }
        if (tokenResponse.statusCode == 400) {
            console.log(tokenBody);
            res.sendStatus(500);
            return;
        }

        const parsedToken = JSON.parse(tokenBody) as Token;
        request("https://discord.com/api/users/@me", {
            headers: {
                authorization: `${parsedToken.token_type} ${parsedToken.access_token}`
            }
        }, async (userError, userResponse, userBody) => {
            if (userError) {
                console.log(userError);
                res.sendStatus(500);
                return;
            }
            if (userResponse.statusCode == 400) {
                console.log(userBody);
                res.sendStatus(500);
                return;
            }

            const data = Date.now() + parsedToken.expires_in * 1000;
            const parsedUser = JSON.parse(userBody) as User;

            const getTokenByUser = await authTokensModel.getTokenByUser(parsedUser.id);

            if (!getTokenByUser.status) {
                const addAuthToken = await authTokensModel.addAuthToken(parsedUser.id, parsedToken.access_token, parsedToken.refresh_token, parsedToken.token_type, data);

                if (!addAuthToken.status) {
                    res.sendStatus(500);
                } else {
                    var abc = "abcdefghijklmnopqrsuvtwxyz";
                    var cookie = "";
                    cookie += req.body.key;
                    for (let i = 0; i < 15; i++) {
                        cookie += abc[Math.floor(Math.random() * abc.length)];
                    }
                    cookie += parsedUser.id;
                    var cookieData = Date.now() + 7 * 24 * 60 * 60 * 1000;
                    await authCookiesModel.addCookie(cookie, req.body.key, parsedUser.id, cookieData);

                    res.send(JSON.stringify({ cookie }));
                }
            } else {
                const updateToken = await authTokensModel.updateToken(parsedUser.id, { access_token: parsedToken.access_token, token_type: parsedToken.token_type, refresh_token: parsedToken.refresh_token, data });

                if (!updateToken.status) {
                    res.sendStatus(500);
                } else {
                    var abc = "abcdefghijklmnopqrsuvtwxyz";
                    var cookie = "";
                    cookie += req.body.key;
                    for (let i = 0; i < 15; i++) {
                        cookie += abc[Math.floor(Math.random() * abc.length)];
                    }
                    cookie += parsedUser.id;
                    var cookieData = Date.now() + 7 * 24 * 60 * 60 * 1000;
                    await authCookiesModel.addCookie(cookie, req.body.key, parsedUser.id, cookieData);

                    res.send(JSON.stringify({ cookie }));
                }
            }
        });
    });
});

export default auth;