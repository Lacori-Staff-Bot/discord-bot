import { CommandInteraction, GuildTextBasedChannel } from "discord.js";
import { BANS_EMBED_TYPE, MUTES_EMBED_TYPE, WARNS_EMBED_TYPE } from "../builders/embeds/staff.js";
import { staffBuilders } from "../builders/index.js";
import guildsModel from "../mysqlModels/guilds.js";

export enum AUDIT_TYPE {
    BAN,
    UNBAN,
    MUTE,
    UNMUTE,
    WARN,
    WARNBAN
}

export async function audit(type: AUDIT_TYPE, interaction: CommandInteraction, replacements: { target: string, reasone?: string, time?: number, id?: number }) {
    const { target = "undefined", reasone = "undefined", time = 0, id = 0 } = replacements;
    const getGuild = await guildsModel.getGuild(interaction.guildId!);

    if (getGuild.guild!.audit) {
        switch (type) {
            case AUDIT_TYPE.BAN: {
                const audit = await interaction.guild!.channels.resolve(getGuild.guild!.audit) as GuildTextBasedChannel | null;
                if (audit != null) {
                    await audit.send({
                        embeds: [staffBuilders.embeds.banSystem(BANS_EMBED_TYPE.BAN_AUDIT, { author: interaction.user.id, target, reasone })],
                        components: [staffBuilders.buttons.unban(id)]
                    });
                } else {
                    await (await interaction.guild!.fetchOwner()).send({
                        embeds: [staffBuilders.embeds.banSystem(BANS_EMBED_TYPE.BAN_AUDIT, { author: interaction.user.id, target, reasone })],
                        components: [staffBuilders.buttons.unban(id)]
                    }).catch(err => console.log(err));
                }
                break;
            }
            case AUDIT_TYPE.UNBAN: {
                const audit = await interaction.guild!.channels.resolve(getGuild.guild!.audit) as GuildTextBasedChannel | null;
                if (audit != null) {
                    await audit.send({
                        embeds: [staffBuilders.embeds.banSystem(BANS_EMBED_TYPE.UNBAN_AUDIT, { author: interaction.user.id, target })]
                    });
                } else {
                    await (await interaction.guild!.fetchOwner()).send({
                        embeds: [staffBuilders.embeds.banSystem(BANS_EMBED_TYPE.UNBAN_AUDIT, { author: interaction.user.id, target })]
                    }).catch(err => console.log(err));
                }
                break;
            }
            case AUDIT_TYPE.MUTE: {
                const audit = await interaction.guild!.channels.resolve(getGuild.guild!.audit) as GuildTextBasedChannel | null;
                if (audit != null) {
                    await audit.send({
                        embeds: [staffBuilders.embeds.muteSystem(MUTES_EMBED_TYPE.MUTE_AUDIT, { author: interaction.user.id, target, time, reasone })],
                        components: [staffBuilders.buttons.unmute(target, interaction.guildId!)]
                    });
                } else {
                    await (await interaction.guild!.fetchOwner()).send({
                        embeds: [staffBuilders.embeds.muteSystem(MUTES_EMBED_TYPE.MUTE_AUDIT, { author: interaction.user.id, target, time, reasone })],
                        components: [staffBuilders.buttons.unmute(target, interaction.guildId!)]
                    }).catch(err => console.log(err));
                }
                break;
            }
            case AUDIT_TYPE.UNMUTE: {
                const audit = await interaction.guild!.channels.resolve(getGuild.guild!.audit) as GuildTextBasedChannel | null;
                if (audit != null) {
                    await audit.send({
                        embeds: [staffBuilders.embeds.muteSystem(MUTES_EMBED_TYPE.UNMUTE_AUDIT, { author: interaction.user.id, target })]
                    });
                } else {
                    await (await interaction.guild!.fetchOwner()).send({
                        embeds: [staffBuilders.embeds.muteSystem(MUTES_EMBED_TYPE.UNMUTE_AUDIT, { author: interaction.user.id, target })]
                    }).catch(err => console.log(err));
                }
                break;
            }
            case AUDIT_TYPE.WARN: {
                const audit = await interaction.guild!.channels.resolve(getGuild.guild!.audit) as GuildTextBasedChannel | null;
                if (audit != null) {
                    await audit.send({
                        embeds: [staffBuilders.embeds.warnSystem(WARNS_EMBED_TYPE.WARN_AUDIT, { author: interaction.user.id, target, reasone })],
                        components: [staffBuilders.buttons.unwarn(id, interaction.guildId!)]
                    });
                } else {
                    await (await interaction.guild!.fetchOwner()).send({
                        embeds: [staffBuilders.embeds.warnSystem(WARNS_EMBED_TYPE.WARN_AUDIT, { author: interaction.user.id, target, reasone })],
                        components: [staffBuilders.buttons.unwarn(id, interaction.guildId!)]
                    }).catch(err => console.log(err));
                }
                break;
            }
            case AUDIT_TYPE.WARNBAN: {
                const audit = await interaction.guild!.channels.resolve(getGuild.guild!.audit) as GuildTextBasedChannel | null;
                if (audit != null) {
                    await audit.send({
                        embeds: [staffBuilders.embeds.warnSystem(WARNS_EMBED_TYPE.WARN_BAN_AUDIT, { target })],
                        components: [staffBuilders.buttons.unban(id)]
                    });
                } else {
                    await (await interaction.guild!.fetchOwner()).send({
                        embeds: [staffBuilders.embeds.warnSystem(WARNS_EMBED_TYPE.WARN_BAN_AUDIT, { target })],
                        components: [staffBuilders.buttons.unban(id)]
                    }).catch(err => console.log(err));
                }
                break;
            }
        }
    }
}