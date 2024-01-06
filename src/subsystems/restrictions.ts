import { CommandInteraction, GuildMember, GuildTextBasedChannel } from "discord.js";
import { unblock } from "../builders/buttons/staff.js";
import { activeBlock } from "../builders/embeds/staff.js";
import blocksModel from "../mysqlModels/blocks.js";
import permissionsModel from "../mysqlModels/permissions.js";
import restrictionsModel from "../mysqlModels/restrictions.js";

export async function restrictions(type: "ban" | "mute" | "warn" | "pred", interaction: CommandInteraction, guildId: string, author: GuildMember) {
    async function signal(signalId: string, id: number) {
        const signalChannel = await interaction.guild!.channels.resolve(signalId) as GuildTextBasedChannel | null;;
        if (signalChannel != null) {
            await signalChannel.send({
                embeds: [activeBlock("Signal", author.id)],
                components: [unblock(id)]
            });
        } else {
            (await interaction.guild!.fetchOwner()).send({
                embeds: [activeBlock("Signal", author.id)],
                components: [unblock(id)]
            });
        }
    }
    const getRestriction = await restrictionsModel.getRestriction(guildId);


    if (getRestriction.status && getRestriction.restriction!.signalChannel != null) {
        const getPermissions = await permissionsModel.getPermissions(guildId);

        if (!getPermissions.status) {
            const getTreckBlock = await blocksModel.getTreckBlock(author.id, guildId);

            if (!getTreckBlock.status) {
                switch (type) {
                    case "ban":
                        if (getRestriction.restriction!.maxBans != null) {
                            const addBlock = await blocksModel.addBlock(author.id, guildId);
                            if (getRestriction.restriction!.maxBans == 1) {
                                await blocksModel.updateBlock(addBlock.id!, { bans: 1, status: 1 });
                                await signal(getRestriction.restriction!.signalChannel, addBlock.id!);
                                await author.send({
                                    embeds: [activeBlock("Blocked")]
                                });
                            } else {
                                await blocksModel.updateBlock(addBlock.id!, { bans: 1 });
                            }
                        }
                        break;
                    case "mute":
                        if (getRestriction.restriction!.maxMutes != null) {
                            const addBlock = await blocksModel.addBlock(author.id, guildId);
                            if (getRestriction.restriction!.maxMutes == 1) {
                                await blocksModel.updateBlock(addBlock.id!, { mutes: 1, status: 1 });
                                await signal(getRestriction.restriction!.signalChannel, addBlock.id!);
                                await author.send({
                                    embeds: [activeBlock("Blocked")]
                                });
                            } else {
                                await blocksModel.updateBlock(addBlock.id!, { mutes: 1 });
                            }
                        }
                        break;
                    case "warn":
                        if (getRestriction.restriction!.maxWarns != null) {
                            const addBlock = await blocksModel.addBlock(author.id, guildId);
                            if (getRestriction.restriction!.maxWarns == 1) {
                                await blocksModel.updateBlock(addBlock.id!, { warns: 1, status: 1 });
                                await signal(getRestriction.restriction!.signalChannel, addBlock.id!);
                                await author.send({
                                    embeds: [activeBlock("Blocked")]
                                });
                            } else {
                                await blocksModel.updateBlock(addBlock.id!, { warns: 1 });
                            }
                        }
                        break;
                    case "pred":
                        if (getRestriction.restriction!.maxPreds != null) {
                            const addBlock = await blocksModel.addBlock(author.id, guildId);
                            if (getRestriction.restriction!.maxPreds == 1) {
                                await blocksModel.updateBlock(addBlock.id!, { preds: 1, status: 1 });
                                await signal(getRestriction.restriction!.signalChannel, addBlock.id!);
                                await author.send({
                                    embeds: [activeBlock("Blocked")]
                                });
                            } else {
                                await blocksModel.updateBlock(addBlock.id!, { preds: 1 });
                            }
                        }
                        break;
                }
            } else {
                switch (type) {
                    case "ban":
                        if (getRestriction.restriction!.maxBans != null) {
                            if (getTreckBlock.block!.bans != null && getTreckBlock.block!.bans + 1 == getRestriction.restriction!.maxBans) {
                                await blocksModel.updateBlock(getTreckBlock.block!.id, { bans: getTreckBlock.block!.bans + 1, status: 1 });
                                await signal(getRestriction.restriction!.signalChannel, getTreckBlock.block!.id);
                                await author.send({
                                    embeds: [activeBlock("Blocked")]
                                });
                            } else if (getTreckBlock.block!.bans == null) {
                                await blocksModel.updateBlock(getTreckBlock.block!.id, { bans: 1 });
                            } else {
                                await blocksModel.updateBlock(getTreckBlock.block!.id, { bans: getTreckBlock.block!.bans + 1 });
                            }
                        }
                        break;
                    case "mute":
                        if (getRestriction.restriction!.maxMutes != null) {
                            if (getTreckBlock.block!.mutes != null && getTreckBlock.block!.mutes + 1 == getRestriction.restriction!.maxMutes) {
                                await blocksModel.updateBlock(getTreckBlock.block!.id, { mutes: getTreckBlock.block!.mutes + 1, status: 1 });
                                await signal(getRestriction.restriction!.signalChannel, getTreckBlock.block!.id);
                                await author.send({
                                    embeds: [activeBlock("Blocked")]
                                });
                            } else if (getTreckBlock.block!.mutes == null) {
                                await blocksModel.updateBlock(getTreckBlock.block!.id, { mutes: 1 });
                            } else {
                                await blocksModel.updateBlock(getTreckBlock.block!.id, { mutes: getTreckBlock.block!.mutes + 1 });
                            }
                        }
                        break;
                    case "warn":
                        if (getRestriction.restriction!.maxWarns != null) {
                            if (getTreckBlock.block!.warns != null && getTreckBlock.block!.warns + 1 == getRestriction.restriction!.maxWarns) {
                                await blocksModel.updateBlock(getTreckBlock.block!.id, { warns: getTreckBlock.block!.warns + 1, status: 1 });
                                await signal(getRestriction.restriction!.signalChannel, getTreckBlock.block!.id);
                                await author.send({
                                    embeds: [activeBlock("Blocked")]
                                });
                            } else if (getTreckBlock.block!.warns == null) {
                                await blocksModel.updateBlock(getTreckBlock.block!.id, { warns: 1 });
                            } else {
                                await blocksModel.updateBlock(getTreckBlock.block!.id, { warns: getTreckBlock.block!.warns + 1 });
                            }
                        }
                        break;
                    case "pred":
                        if (getRestriction.restriction!.maxPreds != null) {
                            if (getTreckBlock.block!.preds != null && getTreckBlock.block!.preds + 1 == getRestriction.restriction!.maxPreds) {
                                await blocksModel.updateBlock(getTreckBlock.block!.id, { preds: getTreckBlock.block!.preds + 1, status: 1 });
                                await signal(getRestriction.restriction!.signalChannel, getTreckBlock.block!.id);
                                await author.send({
                                    embeds: [activeBlock("Blocked")]
                                });
                            } else if (getTreckBlock.block!.preds == null) {
                                await blocksModel.updateBlock(getTreckBlock.block!.id, { preds: 1 });
                            } else {
                                await blocksModel.updateBlock(getTreckBlock.block!.id, { preds: getTreckBlock.block!.preds + 1 });
                            }
                        }
                        break;
                }
            }
        } else {
            for (const permission of getPermissions.getPermission!) {
                if (author.roles.resolve(permission.id) != null) return;
            }

            const getTreckBlock = await blocksModel.getTreckBlock(author.id, guildId);

            if (!getTreckBlock.status) {
                switch (type) {
                    case "ban":
                        if (getRestriction.restriction!.maxBans != null) {
                            const addBlock = await blocksModel.addBlock(author.id, guildId);
                            if (getRestriction.restriction!.maxBans == 1) {
                                await blocksModel.updateBlock(addBlock.id!, { bans: 1, status: 1 });
                                await signal(getRestriction.restriction!.signalChannel, addBlock.id!);
                                await author.send({
                                    embeds: [activeBlock("Blocked")]
                                });
                            } else {
                                await blocksModel.updateBlock(addBlock.id!, { bans: 1 });
                            }
                        }
                        break;
                    case "mute":
                        if (getRestriction.restriction!.maxMutes != null) {
                            const addBlock = await blocksModel.addBlock(author.id, guildId);
                            if (getRestriction.restriction!.maxMutes == 1) {
                                await blocksModel.updateBlock(addBlock.id!, { mutes: 1, status: 1 });
                                await signal(getRestriction.restriction!.signalChannel, addBlock.id!);
                                await author.send({
                                    embeds: [activeBlock("Blocked")]
                                });
                            } else {
                                await blocksModel.updateBlock(addBlock.id!, { mutes: 1 });
                            }
                        }
                        break;
                    case "warn":
                        if (getRestriction.restriction!.maxWarns != null) {
                            const addBlock = await blocksModel.addBlock(author.id, guildId);
                            if (getRestriction.restriction!.maxWarns == 1) {
                                await blocksModel.updateBlock(addBlock.id!, { warns: 1, status: 1 });
                                await signal(getRestriction.restriction!.signalChannel, addBlock.id!);
                                await author.send({
                                    embeds: [activeBlock("Blocked")]
                                });
                            } else {
                                await blocksModel.updateBlock(addBlock.id!, { warns: 1 });
                            }
                        }
                        break;
                    case "pred":
                        if (getRestriction.restriction!.maxPreds != null) {
                            const addBlock = await blocksModel.addBlock(author.id, guildId);
                            if (getRestriction.restriction!.maxPreds == 1) {
                                await blocksModel.updateBlock(addBlock.id!, { preds: 1, status: 1 });
                                await signal(getRestriction.restriction!.signalChannel, addBlock.id!);
                                await author.send({
                                    embeds: [activeBlock("Blocked")]
                                });
                            } else {
                                await blocksModel.updateBlock(addBlock.id!, { preds: 1 });
                            }
                        }
                        break;
                }
            } else {
                switch (type) {
                    case "ban":
                        if (getRestriction.restriction!.maxBans != null) {
                            if (getTreckBlock.block!.bans != null && getTreckBlock.block!.bans + 1 == getRestriction.restriction!.maxBans) {
                                await blocksModel.updateBlock(getTreckBlock.block!.id, { bans: getTreckBlock.block!.bans + 1, status: 1 });
                                await signal(getRestriction.restriction!.signalChannel, getTreckBlock.block!.id);
                                await author.send({
                                    embeds: [activeBlock("Blocked")]
                                });
                            } else if (getTreckBlock.block!.bans == null) {
                                await blocksModel.updateBlock(getTreckBlock.block!.id, { bans: 1 });
                            } else {
                                await blocksModel.updateBlock(getTreckBlock.block!.id, { bans: getTreckBlock.block!.bans + 1 });
                            }
                        }
                        break;
                    case "mute":
                        if (getRestriction.restriction!.maxMutes != null) {
                            if (getTreckBlock.block!.mutes != null && getTreckBlock.block!.mutes + 1 == getRestriction.restriction!.maxMutes) {
                                await blocksModel.updateBlock(getTreckBlock.block!.id, { mutes: getTreckBlock.block!.mutes + 1, status: 1 });
                                await signal(getRestriction.restriction!.signalChannel, getTreckBlock.block!.id);
                                await author.send({
                                    embeds: [activeBlock("Blocked")]
                                });
                            } else if (getTreckBlock.block!.mutes == null) {
                                await blocksModel.updateBlock(getTreckBlock.block!.id, { mutes: 1 });
                            } else {
                                await blocksModel.updateBlock(getTreckBlock.block!.id, { mutes: getTreckBlock.block!.mutes + 1 });
                            }
                        }
                        break;
                    case "warn":
                        if (getRestriction.restriction!.maxWarns != null) {
                            if (getTreckBlock.block!.warns != null && getTreckBlock.block!.warns + 1 == getRestriction.restriction!.maxWarns) {
                                await blocksModel.updateBlock(getTreckBlock.block!.id, { warns: getTreckBlock.block!.warns + 1, status: 1 });
                                await signal(getRestriction.restriction!.signalChannel, getTreckBlock.block!.id);
                                await author.send({
                                    embeds: [activeBlock("Blocked")]
                                });
                            } else if (getTreckBlock.block!.warns == null) {
                                await blocksModel.updateBlock(getTreckBlock.block!.id, { warns: 1 });
                            } else {
                                await blocksModel.updateBlock(getTreckBlock.block!.id, { warns: getTreckBlock.block!.warns + 1 });
                            }
                        }
                        break;
                    case "pred":
                        if (getRestriction.restriction!.maxPreds != null) {
                            if (getTreckBlock.block!.preds != null && getTreckBlock.block!.preds + 1 == getRestriction.restriction!.maxPreds) {
                                await blocksModel.updateBlock(getTreckBlock.block!.id, { preds: getTreckBlock.block!.preds + 1, status: 1 });
                                await signal(getRestriction.restriction!.signalChannel, getTreckBlock.block!.id);
                                await author.send({
                                    embeds: [activeBlock("Blocked")]
                                });
                            } else if (getTreckBlock.block!.preds == null) {
                                await blocksModel.updateBlock(getTreckBlock.block!.id, { preds: 1 });
                            } else {
                                await blocksModel.updateBlock(getTreckBlock.block!.id, { preds: getTreckBlock.block!.preds + 1 });
                            }
                        }
                        break;
                }
            }
        }
    }
}