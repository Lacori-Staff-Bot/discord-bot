import { bot } from "../main.js";
import bansModel from "../mysqlModels/bans.js";
import blocksModel from "../mysqlModels/blocks.js";
import warnsModel from "../mysqlModels/warns.js";

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
}