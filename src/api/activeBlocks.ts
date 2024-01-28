import express from "express";
import authCookiesModel from "../mysqlModels/authcookies.js";
import { bot } from "../main.js";
import { staffBuilders } from "../builders/index.js";
import { BLOCK_SYSTEM_EMBED_TYPE } from "../builders/embeds/staff.js";
import blocksModel from "../mysqlModels/blocks.js";
import { PermissionsBitField } from "discord.js";
const activeBloks = express.Router();

activeBloks.post("/", async (req, res) => {
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
            const blocks = await blocksModel.getActiveBlocksForGuild(req.body.guildId);

            if (!blocks.status) {
                res.send({ blocks: [] });
            } else {
                var parsedBlocks = [];
                for (const block of blocks.blocks!) {
                    const target = await bot.users.fetch(block.target);
                    parsedBlocks.push({ id: block.id, target: target?.globalName, author: "Система", reasone: "Превышение лимита", data: block.data });
                }

                res.send({ blocks: parsedBlocks });
            }

            break;
        }
        case "remove_block": {
            if (req.body.id == undefined) {
                res.sendStatus(500);
                return;
            }

            const block = await blocksModel.getBlockId(req.body.id);

            if (!block.status) {
                res.sendStatus(502);
                return;
            }

            await blocksModel.removeBlock(req.body.id);
            const target = await bot.users.fetch(block.block!.target);
            if (target != null)
                await target!.send({
                    embeds: [staffBuilders.embeds.blockSystem(BLOCK_SYSTEM_EMBED_TYPE.UNBLOCKED_INFO, {})]
                });
            res.sendStatus(200);

            break;
        }
    }
});

export default activeBloks;