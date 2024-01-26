import express from "express";
import restrictionsModel from "../mysqlModels/restrictions.js";
import authCookiesModel from "../mysqlModels/authcookies.js";
import { bot } from "../main.js";
import { ChannelType } from "discord.js";
import permissionsModel from "../mysqlModels/permissions.js";
const restrictions = express.Router();

restrictions.post("/", async (req, res) => {
    if (!req.body.type) {
        res.sendStatus(500);
        return;
    }

    switch (req.body.type) {
        case "get_info": {
            if (req.body.cookie == undefined || req.body.key == undefined || req.body.guildId == undefined) {
                res.sendStatus(500);
                return;
            }

            const verifyCookie = await authCookiesModel.verifyCookie(req.body.cookie, req.body.key);

            if (!verifyCookie.status) {
                res.sendStatus(501);
                await authCookiesModel.removeCookie(req.body.cookie);
                return;
            }

            const guild = await bot.guilds.resolve(req.body.guildId);
            const roles = (await guild.roles.fetch()).filter(role => role.editable && role.name != "@everyone");
            const channels = (await guild.channels.fetch()).filter(channel => channel?.type == ChannelType.GuildText);

            const getRestriction = await restrictionsModel.getRestriction(req.body.guildId);
            const getPermissions = await permissionsModel.getPermissions(req.body.guildId);

            var parsedRoles = [];
            if (roles)
                for (const role of roles) {
                    if (getPermissions.status && getPermissions.getPermission!.find(permission => permission.id == role[1].id)) {
                        parsedRoles.push({ id: role[1]?.id, name: role[1]?.name, selected: true });
                    } else {
                        parsedRoles.push({ id: role[1]?.id, name: role[1]?.name, selected: false });
                    }
                }
            else
                parsedRoles.push({ id: 1, name: "", selected: false });

            var parsedChannels = [];
            if (channels)
                for (const channel of channels) {
                    parsedChannels.push({ id: channel[1]?.id, name: channel[1]?.name });
                }
            else
                parsedChannels.push({ id: 1, name: "" });

            res.send(JSON.stringify({ channels: parsedChannels, roles: parsedRoles, signalChannel: getRestriction.restriction!.signalChannel, maxBans: getRestriction.restriction!.maxBans, maxMutes: getRestriction.restriction!.maxMutes, maxWarns: getRestriction.restriction!.maxWarns, maxPreds: getRestriction.restriction!.maxPreds }));
            break;
        }
    }
});