import express from "express";
import authCookiesModel from "../mysqlModels/authcookies.js";
import { bot } from "../main.js";
import { ChannelType, PermissionsBitField } from "discord.js";
import guildsModel from "../mysqlModels/guilds.js";
const mainSettings = express.Router();

mainSettings.post("/", async (req, res) => {
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
            const roles = (await guild.roles.fetch()).filter(role => role.editable && role.name != "@everyone");
            const channels = (await guild.channels.fetch()).filter(channel => channel?.type == ChannelType.GuildText);

            var parsedRoles = [];
            for (const role of roles) {
                parsedRoles.push({ id: role[1].id, name: role[1].name });
            }

            var parsedChannels = [];
            if (channels)
                for (const channel of channels) {
                    parsedChannels.push({ id: channel[1]?.id, name: channel[1]?.name });
                }
            else
                parsedChannels.push({ id: 1, name: "" });

            const getGuild = await guildsModel.getGuild(req.body.guildId);

            res.send({ channels: parsedChannels, roles: parsedRoles, currentAudit: getGuild.guild!.audit, currentMale: getGuild.guild!.maleRole, currentFemale: getGuild.guild!.femaleRole, currentPreds: getGuild.guild!.preds });
            break;
        }
        case "set_settings": {
            if (req.body.audit == undefined || req.body.male == undefined || req.body.female == undefined || req.body.preds == undefined) {
                res.sendStatus(500);
                return;
            }

            const updateGuild = await guildsModel.updateGuild(req.body.guildId, {
                genderRole: req.body.male != 0 ? true : false,
                maleRole: req.body.male != 0 ? req.body.male : req.body.female,
                femaleRole: req.body.female != 0 ? req.body.female : req.body.female,
                audit: req.body.audit != 0 ? req.body.audit : null,
                preds: req.body.preds != 0 ? req.body.preds : null
            });

            if (!updateGuild.status) {
                res.sendStatus(502);
            } else {
                res.sendStatus(200);
            }
            break;
        }
    }
});

export default mainSettings;