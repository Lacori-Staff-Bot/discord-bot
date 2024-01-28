import { CommandInteraction, GuildMember, GuildTextBasedChannel } from "discord.js";
import { BLOCK_SYSTEM_EMBED_TYPE } from "../builders/embeds/staff.js";
import { staffBuilders } from "../builders/index.js";
import blocksModel from "../mysqlModels/blocks.js";
import permissionsModel from "../mysqlModels/permissions.js";
import restrictionsModel from "../mysqlModels/restrictions.js";

export enum RESTRICTION_TYPE {
    BAN,
    MUTE,
    WARN,
    PRED
}

class Restrictions {
    private async signal(interaction: CommandInteraction, signalId: string, id: number, target: string) {
        const signalChannel = await interaction.guild!.channels.resolve(signalId) as GuildTextBasedChannel | null;;
        if (signalChannel != null) {
            await signalChannel.send({
                embeds: [staffBuilders.embeds.blockSystem(BLOCK_SYSTEM_EMBED_TYPE.BLOCKED_SIGNAL, { target })],
                components: [staffBuilders.buttons.unblock(id)]
            });
        } else {
            (await interaction.guild!.fetchOwner()).send({
                embeds: [staffBuilders.embeds.blockSystem(BLOCK_SYSTEM_EMBED_TYPE.BLOCKED_SIGNAL, { target })],
                components: [staffBuilders.buttons.unblock(id)]
            });
        }
    }

    public async restrictions(type: RESTRICTION_TYPE, interaction: CommandInteraction, guildId: string, target: GuildMember) {
        const getRestriction = await restrictionsModel.getRestriction(guildId);

        if (getRestriction.restriction!.signalChannel == null) return;
        const getPermissions = await permissionsModel.getPermissions(guildId);

        if (getPermissions.status) {
            for (const permission of getPermissions.getPermission!) {
                if (target.roles.resolve(permission.id) != null) return;
            }
        }
        const getTreckBlock = await blocksModel.getTreckBlock(target.id, guildId);

        switch (type) {
            case RESTRICTION_TYPE.BAN:
                if (getRestriction.restriction!.maxBans != null) {
                    const id: number = await (async (status: boolean = getTreckBlock.status) => {
                        if (status) {
                            return getTreckBlock.block!.id;
                        } else {
                            return (await blocksModel.addBlock(target.id, guildId)).id!;
                        }
                    })();
                    if (getTreckBlock.status && getTreckBlock.block!.bans != null) {
                        if (getTreckBlock.block!.bans + 1 == getRestriction.restriction!.maxBans) {
                            await blocksModel.updateBlock(id, { bans: getTreckBlock.block!.bans + 1, status: 1 });
                            await this.signal(interaction, getRestriction.restriction!.signalChannel, id, target.id);
                            await target.send({
                                embeds: [staffBuilders.embeds.blockSystem(BLOCK_SYSTEM_EMBED_TYPE.BLOCKED_SIGNAL, { target: target.id })]
                            });
                        } else {
                            await blocksModel.updateBlock(id, { bans: getTreckBlock.block!.bans + 1 });
                        }
                    } else if (getRestriction.restriction!.maxBans == 1) {
                        await blocksModel.updateBlock(id, { bans: 1, status: 1 });
                        await this.signal(interaction, getRestriction.restriction!.signalChannel, id, target.id);
                        await target.send({
                            embeds: [staffBuilders.embeds.blockSystem(BLOCK_SYSTEM_EMBED_TYPE.BLOCKED_SIGNAL, { target: target.id })]
                        });
                    } else {
                        await blocksModel.updateBlock(id, { bans: 1 });
                    }
                }
                break;
            case RESTRICTION_TYPE.MUTE:
                if (getRestriction.restriction!.maxMutes != null) {
                    const id: number = await (async (status: boolean = getTreckBlock.status) => {
                        if (status) {
                            return getTreckBlock.block!.id;
                        } else {
                            return (await blocksModel.addBlock(target.id, guildId)).id!;
                        }
                    })();
                    if (getTreckBlock.status && getTreckBlock.block!.mutes != null) {
                        if (getTreckBlock.block!.mutes + 1 == getRestriction.restriction!.maxMutes) {
                            await blocksModel.updateBlock(id, { mutes: getTreckBlock.block!.mutes + 1, status: 1 });
                            await this.signal(interaction, getRestriction.restriction!.signalChannel, id, target.id);
                            await target.send({
                                embeds: [staffBuilders.embeds.blockSystem(BLOCK_SYSTEM_EMBED_TYPE.BLOCKED_SIGNAL, { target: target.id })]
                            });
                        } else {
                            await blocksModel.updateBlock(id, { mutes: getTreckBlock.block!.mutes + 1 });
                        }
                    } else if (getRestriction.restriction!.maxMutes == 1) {
                        await blocksModel.updateBlock(id, { mutes: 1, status: 1 });
                        await this.signal(interaction, getRestriction.restriction!.signalChannel, id, target.id);
                        await target.send({
                            embeds: [staffBuilders.embeds.blockSystem(BLOCK_SYSTEM_EMBED_TYPE.BLOCKED_SIGNAL, { target: target.id })]
                        });
                    } else {
                        await blocksModel.updateBlock(id, { mutes: 1 });
                    }
                }
                break;
            case RESTRICTION_TYPE.WARN:
                if (getRestriction.restriction!.maxWarns != null) {
                    const id: number = await (async (status: boolean = getTreckBlock.status) => {
                        if (status) {
                            return getTreckBlock.block!.id;
                        } else {
                            return (await blocksModel.addBlock(target.id, guildId)).id!;
                        }
                    })();
                    if (getTreckBlock.status && getTreckBlock.block!.warns != null) {
                        if (getTreckBlock.block!.warns + 1 == getRestriction.restriction!.maxWarns) {
                            await blocksModel.updateBlock(id, { warns: getTreckBlock.block!.warns + 1, status: 1 });
                            await this.signal(interaction, getRestriction.restriction!.signalChannel, id, target.id);
                            await target.send({
                                embeds: [staffBuilders.embeds.blockSystem(BLOCK_SYSTEM_EMBED_TYPE.BLOCKED_SIGNAL, { target: target.id })]
                            });
                        } else {
                            await blocksModel.updateBlock(id, { warns: getTreckBlock.block!.warns + 1 });
                        }
                    } else if (getRestriction.restriction!.maxWarns == 1) {
                        await blocksModel.updateBlock(id, { warns: 1, status: 1 });
                        await this.signal(interaction, getRestriction.restriction!.signalChannel, id, target.id);
                        await target.send({
                            embeds: [staffBuilders.embeds.blockSystem(BLOCK_SYSTEM_EMBED_TYPE.BLOCKED_SIGNAL, { target: target.id })]
                        });
                    } else {
                        await blocksModel.updateBlock(id, { warns: 1 });
                    }
                }
                break;
            case RESTRICTION_TYPE.PRED:
                if (getRestriction.restriction!.maxPreds != null) {
                    const id: number = await (async (status: boolean = getTreckBlock.status) => {
                        if (status) {
                            return getTreckBlock.block!.id;
                        } else {
                            return (await blocksModel.addBlock(target.id, guildId)).id!;
                        }
                    })();
                    if (getTreckBlock.status && getTreckBlock.block!.preds != null) {
                        if (getTreckBlock.block!.preds + 1 == getRestriction.restriction!.maxPreds) {
                            await blocksModel.updateBlock(id, { preds: getTreckBlock.block!.preds + 1, status: 1 });
                            await this.signal(interaction, getRestriction.restriction!.signalChannel, id, target.id);
                            await target.send({
                                embeds: [staffBuilders.embeds.blockSystem(BLOCK_SYSTEM_EMBED_TYPE.BLOCKED_SIGNAL, { target: target.id })]
                            });
                        } else {
                            await blocksModel.updateBlock(id, { preds: getTreckBlock.block!.preds + 1 });
                        }
                    } else if (getRestriction.restriction!.maxPreds == 1) {
                        await blocksModel.updateBlock(id, { preds: 1, status: 1 });
                        await this.signal(interaction, getRestriction.restriction!.signalChannel, id, target.id);
                        await target.send({
                            embeds: [staffBuilders.embeds.blockSystem(BLOCK_SYSTEM_EMBED_TYPE.BLOCKED_SIGNAL, { target: target.id })]
                        });
                    } else {
                        await blocksModel.updateBlock(id, { preds: 1 });
                    }
                }
                break;
        }
    }
}

export const restrictions = new Restrictions();