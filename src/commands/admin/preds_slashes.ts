import { ApplicationCommandOptionType, ChannelType, GuildTextBasedChannel, CommandInteraction } from "discord.js";
import { Discord, Slash, SlashGroup, SlashOption } from "discordx";
import { PREDS_SYSTEM_EMBED_TYPE } from "../../builders/embeds/admin.js";
import { adminBuilders } from "../../builders/index.js";
import guildsModel from "../../mysqlModels/guilds.js";

@Discord()
@SlashGroup("admin")
export class AdminPredsSlashes {
    @Slash({ description: "Установить канал предупреждений" })
    async preds(
        @SlashOption({
            name: "channel",
            description: "Канал",
            required: false,
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildText]
        })
        preds: GuildTextBasedChannel,
        interaction: CommandInteraction
    ) {
        if (preds) {
            await guildsModel.updateGuild(interaction.guildId!, { preds: preds.id });

            await interaction.reply({
                embeds: [adminBuilders.embeds.predsSystem(PREDS_SYSTEM_EMBED_TYPE.SET_SUCCESS, { channel: preds.id })],
                ephemeral: true
            });
        } else {
            await guildsModel.updateGuild(interaction.guildId!, { preds: null });

            await interaction.reply({
                embeds: [adminBuilders.embeds.predsSystem(PREDS_SYSTEM_EMBED_TYPE.RESET_SUCCESS, {})],
                ephemeral: true
            });
        }
    }
}