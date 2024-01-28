import express from "express";
import authCookiesModel from "../mysqlModels/authcookies.js";
import { bot } from "../main.js";
import { staffBuilders } from "../builders/index.js";
import { WARNS_EMBED_TYPE } from "../builders/embeds/staff.js";
import warnsModel from "../mysqlModels/warns.js";
import { PermissionsBitField } from "discord.js";
const activeWarns = express.Router();

activeWarns.post("/", async (req, res) => {
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
            const warns = await warnsModel.getActiveWarnsForGuild(req.body.guildId);

            if (!warns.status) {
                res.send({ warns: [] });
            } else {
                var parsedWarns = [];
                for (const warn of warns.warns!) {
                    const target = await bot.users.resolve(warn.targetId);
                    var author;
                    if (warn.author != "0") {
                        author = await bot.users.resolve(warn.author);
                    } else {
                        author = { globalName: "Система" };
                    }
                    parsedWarns.push({ id: warn.id, target: target?.globalName, author: author?.globalName, reasone: warn.reasone, data: warn.data });
                }

                res.send({ warns: parsedWarns });
            }

            break;
        }
        case "remove_warn": {
            if (req.body.id == undefined) {
                res.sendStatus(500);
                return;
            }

            const warn = await warnsModel.getWarnById(req.body.id);

            if (!warn.status) {
                res.sendStatus(502);
                return;
            }

            await warnsModel.removeWarn(req.body.id);
            const target = await bot.users.fetch(warn.warn!.targetId);
            if (target != null)
                await target!.send({
                    embeds: [staffBuilders.embeds.warnSystem(WARNS_EMBED_TYPE.UNWARN_INFO, { guildName: guild.name, author: verifyCookie.cookie!.userId })]
                });
            res.sendStatus(200);

            break;
        }
    }
});

export default activeWarns;