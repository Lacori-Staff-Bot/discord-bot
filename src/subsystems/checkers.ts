import request from "request";
import { bot } from "../main.js";
import authTokensModel from "../mysqlModels/authtokens.js";
import bansModel from "../mysqlModels/bans.js";
import blocksModel from "../mysqlModels/blocks.js";
import warnsModel from "../mysqlModels/warns.js";
import { CLIENT_ID, CLIENT_SECRET } from "../api/common.js";

interface Token {
    token_type: string,
    access_token: string,
    expires_in: number,
    refresh_token: string,
    scope: string
}

async function renewAuthTokens() {
    const data = Date.now();
    const getOldTokens = await authTokensModel.getOldTokens(data);

    if (getOldTokens.status) {
        for (const token of getOldTokens.tokens!) {
            var params = [];
            params.push("client_id=" + CLIENT_ID);
            params.push("client_secret=" + CLIENT_SECRET);
            params.push("grant_type=refresh_token");
            params.push("refresh_token=" + token.refresh_token);

            request("https://discord.com/api/oauth2/token", {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "POST",
                body: params.join("&")
            }, async (refreshError, refreshResponse, refreshBody) => {
                if (refreshError) {
                    console.log(refreshError);
                    await authTokensModel.removeToken(token.userId);
                    return;
                }
                if (refreshResponse.statusCode == 400) {
                    console.log(refreshBody);
                    await authTokensModel.removeToken(token.userId);
                    return;
                }

                const parsedRefresh = JSON.parse(refreshBody) as Token;
                const data = Date.now() + parsedRefresh.expires_in * 1000;

                await authTokensModel.updateToken(token.userId, { access_token: parsedRefresh.access_token, refresh_token: parsedRefresh.refresh_token, token_type: parsedRefresh.token_type });
            })
        }
    }
}

async function checkBans() {
    const getActiveBans = await bansModel.getActiveBans();

    if (getActiveBans.status) {
        const date = Date.now();
        for (const ban of getActiveBans.getActiveBans!) {
            if (date > ban.data) {
                const member = await (await bot.guilds.fetch(ban.guildId)).members.fetch(ban.target)
                if (member.moderatable) {
                    member.ban({ reason: ban.reasone });
                    await bansModel.makeBaned(ban.id);
                } else {
                    await bansModel.removeBan(ban.id);
                }
            }
        }
    }
}

async function checkBlocks() {
    const getTreckBlocks = await blocksModel.getTreckBlocks();

    if (getTreckBlocks.status) {
        const date = Date.now();
        for (const block of getTreckBlocks.blocks!) {
            if (date > block.data) {
                await blocksModel.removeBlock(block.id);
            }
        }
    }
}

async function checkWarns() {
    const getActiveWarns = await warnsModel.getActiveWarns();

    if (getActiveWarns.status) {
        const date = Date.now();
        for (const warn of getActiveWarns.warns!) {
            if (date > warn.data) {
                await warnsModel.removeWarn(warn.id);
            }
        }
    }
}

export function enableCheckers() {
    setInterval(checkBans, 60 * 60 * 1000);
    setInterval(checkBlocks, 60 * 1000);
    setInterval(checkWarns, 60 * 60 * 1000);
    setInterval(renewAuthTokens, 60 * 1000);
}