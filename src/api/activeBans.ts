import express from "express";
import authCookiesModel from "../mysqlModels/authcookies.js";
import bansModel from "../mysqlModels/bans.js";
import { bot } from "../main.js";
import { staffBuilders } from "../builders/index.js";
import { BANS_EMBED_TYPE } from "../builders/embeds/staff.js";
import { PermissionsBitField } from "discord.js";
const activeBans = express.Router();

activeBans.post("/", async (req, res) => {
    if (req.body.type == undefined || req.body.cookie == undefined || req.body.key == undefined || req.body.guildId == undefined) {
        res.sendStatus(500);
        return;
    }

    const verifyCookie = await authCookiesModel.verifyCookie(req.body.cookie, req.body.key);

    if (!verifyCookie.status) {
        res.sendStatus(501);
        await authCookiesModel.removeCookie(req.body.cookie);
        return;
    }

    const guild = await bot.guilds.fetch(req.body.guildId);

    if (!(await guild.members.fetch(verifyCookie.cookie!.userId)).permissions.has(PermissionsBitField.Flags.Administrator, true)) {
        res.sendStatus(501);
        await authCookiesModel.removeCookie(req.body.cookie);
        return;
    }

    switch (req.body.type) {
        case "get_info": {
            const bans = await bansModel.getActiveBansForGuild(req.body.guildId);

            if (!bans.status) {
                res.send({ bans: [] });
            } else {
                var parsedBans = [];
                for (const ban of bans.bans!) {
                    const target = await bot.users.fetch(ban.target);
                    var author;
                    if (ban.author != "0") {
                        author = await bot.users.fetch(ban.author);
                    } else {
                        author = { globalName: "Система" };
                    }
                    parsedBans.push({ id: ban.id, target: target?.globalName, author: author?.globalName, reasone: ban.reasone, data: ban.data });
                }

                res.send({ bans: parsedBans });
            }

            break;
        }
        case "remove_ban": {
            if (req.body.id == undefined) {
                res.sendStatus(500);
                return;
            }

            const ban = await bansModel.getActiveBanForId(req.body.id);

            if (!ban.status) {
                res.sendStatus(502);
                return;
            }

            await bansModel.removeBan(req.body.id);
            if (ban.ban!.status == 1) {
                await guild.members.unban(ban.ban!.target);
            }
            const target = await bot.users.fetch(ban.ban!.target);
            if (target != null)
                await target!.send({
                    embeds: [staffBuilders.embeds.banSystem(BANS_EMBED_TYPE.UNBAN_INFO, { guildName: guild.name, author: verifyCookie.cookie!.userId })]
                });
            res.sendStatus(200);

            break;
        }
    }
});

export default activeBans;