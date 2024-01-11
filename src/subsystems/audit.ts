import { CommandInteraction, GuildTextBasedChannel } from "discord.js";
import { unban, unmute } from "../builders/buttons/staff.js";
import { MuteUnmute, banUnban } from "../builders/embeds/staff.js";
import guildsModel from "../mysqlModels/guilds.js";

export async function audit(type: "ban" | "unban" | "mute" | "unmute", interaction: CommandInteraction, target: string, reason?: string, time?: number, id?: number) {
    switch (type) {
        case "ban": {
            const getGuild = await guildsModel.getGuild(interaction.guildId!);
            if (getGuild.status && getGuild.guild!.audit) {
                const audit = await interaction.guild!.channels.resolve(getGuild.guild!.audit) as GuildTextBasedChannel | null;
                if (audit != null) {
                    await audit.send({
                        embeds: [banUnban("BanAudit", target, reason, interaction.user.id)],
                        components: [unban(id!)]
                    });
                } else {
                    await (await interaction.guild!.fetchOwner()).send({
                        embeds: [banUnban("BanAudit", target, reason, interaction.user.id)],
                        components: [unban(id!)]
                    });
                }
            }
            break;
        }
        case "unban": {
            const getGuild = await guildsModel.getGuild(interaction.guildId!);
            if (getGuild.status && getGuild.guild!.audit) {
                const audit = await interaction.guild!.channels.resolve(getGuild.guild!.audit) as GuildTextBasedChannel | null;
                if (audit != null) {
                    await audit.send({
                        embeds: [banUnban("UnbanAudit", target, undefined, interaction.user.id)]
                    });
                } else {
                    await (await interaction.guild!.fetchOwner()).send({
                        embeds: [banUnban("UnbanAudit", target, undefined, interaction.user.id)]
                    });
                }
            }
            break;
        }
        case "mute": {
            const getGuild = await guildsModel.getGuild(interaction.guildId!);
            if (getGuild.status && getGuild.guild!.audit) {
                const audit = await interaction.guild!.channels.resolve(getGuild.guild!.audit) as GuildTextBasedChannel | null;
                if (audit != null) {
                    await audit.send({
                        embeds: [MuteUnmute("MuteAudit", target, reason, time, interaction.user.id)],
                        components: [unmute(target, interaction.guildId!)]
                    });
                } else {
                    await (await interaction.guild!.fetchOwner()).send({
                        embeds: [MuteUnmute("MuteAudit", target, reason, time, interaction.user.id)],
                        components: [unmute(target, interaction.guildId!)]
                    });
                }
            }
            break;
        }
        case "unmute": {
            const getGuild = await guildsModel.getGuild(interaction.guildId!);
            if (getGuild.status && getGuild.guild!.audit) {
                const audit = await interaction.guild!.channels.resolve(getGuild.guild!.audit) as GuildTextBasedChannel | null;
                if (audit != null) {
                    await audit.send({
                        embeds: [MuteUnmute("UnmuteAudit", target, undefined, undefined, interaction.user.id)]
                    });
                } else {
                    await (await interaction.guild!.fetchOwner()).send({
                        embeds: [MuteUnmute("UnmuteAudit", target, undefined, undefined, interaction.user.id)]
                    });
                }
            }
            break;
        }
    }
}