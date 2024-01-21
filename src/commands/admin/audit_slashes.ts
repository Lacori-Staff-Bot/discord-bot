import { ApplicationCommandOptionType, ChannelType, GuildTextBasedChannel, CommandInteraction } from "discord.js";
import { Discord, Slash, SlashGroup, SlashOption } from "discordx";
import { AUDIT_SYSTEM_EMBED_TYPE } from "../../builders/embeds/admin.js";
import { adminBuilders } from "../../builders/index.js";
import guildsModel from "../../mysqlModels/guilds.js";

@Discord()
@SlashGroup("admin")
export class AdminAuditSlashes {
    @Slash({ description: "Настройка системы аудита" })
    async audit(
        @SlashOption({
            name: "channel",
            description: "Канал аудита",
            required: false,
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildText]
        })
        channel: GuildTextBasedChannel,
        interaction: CommandInteraction
    ) {
        if (!channel) {
            await guildsModel.updateGuild(interaction.guildId!, { audit: null });

            await interaction.reply({
                embeds: [adminBuilders.embeds.auditSystem(AUDIT_SYSTEM_EMBED_TYPE.RESET_SUCCESS, {})],
                ephemeral: true
            });
        } else {
            await guildsModel.updateGuild(interaction.guildId!, { audit: channel.id });

            await interaction.reply({
                embeds: [adminBuilders.embeds.auditSystem(AUDIT_SYSTEM_EMBED_TYPE.SET_SUCCESS, { channel: channel.id })],
                ephemeral: true
            });
        }
    }
}