import express from "express";
import request from "request";
import authCookiesModel from "../mysqlModels/authcookies.js";
import authTokensModel from "../mysqlModels/authtokens.js";
import { bot } from "../main.js";
const dashboard = express.Router();

interface GuildResponse {
    id: string
    name: string
    icon: string
    owner: boolean
    permissions: number
    permissions_new: string
    features: string[]
}

interface SendingGuilds {
    id: string
    name: string
    icon: string
    hasBot: boolean
}

dashboard.post("/", async (req, res) => {
    const verifyCookie = await authCookiesModel.verifyCookie(req.body.cookie, req.body.key);

    if (!verifyCookie.status) {
        res.sendStatus(501);
        return;
    }

    const getTokenByUser = await authTokensModel.getTokenByUser(verifyCookie.cookie!.userId);

    request("https://discord.com/api/users/@me/guilds", {
        headers: {
            authorization: `${getTokenByUser.authToken!.token_type} ${getTokenByUser.authToken!.access_token}`
        }
    }, async (guildsError, guildsResponse, guildsBody) => {
        if (guildsError) {
            console.log(guildsError);
            res.sendStatus(500);
            return;
        }
        if (guildsResponse.statusCode == 400) {
            console.log(guildsBody);
            res.sendStatus(500);
            return;
        }

        const parsedGuilds: GuildResponse[] = JSON.parse(guildsBody).filter((guild: GuildResponse) => guild.permissions == 2147483647);
        var sendingData: SendingGuilds[] = [];
        for (let guild of parsedGuilds) {
            if (await bot.guilds.resolve(guild.id) != null) sendingData.push({ id: guild.id, name: guild.name, icon: guild.icon, hasBot: true });
            else sendingData.push({ id: guild.id, name: guild.name, icon: guild.icon, hasBot: false });
        }
        res.send(JSON.stringify(sendingData));
    });
});

export default dashboard;