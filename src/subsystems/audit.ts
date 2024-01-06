import { CommandInteraction, GuildTextBasedChannel } from "discord.js";
import { unban } from "../builders/buttons/staff.js";
import { banUnban } from "../builders/embeds/staff.js";
import guildsModel from "../mysqlModels/guilds.js";

export async function audit(type: "ban" | "unban", interaction: CommandInteraction, target: string, reason?: string, time?: string, id?: number) {
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
    }
}