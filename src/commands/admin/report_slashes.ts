import { ApplicationCommandOptionType, BaseGuildVoiceChannel, CategoryChannel, ChannelType, CommandInteraction, GuildTextBasedChannel } from "discord.js";
import { Discord, Slash, SlashGroup, SlashOption } from "discordx";
import { adminBuilders } from "../../builders/index.js";
import { REPORT_SYSTEM_EMBED_TYPE } from "../../builders/embeds/admin.js";
import reportChannelsModel from "../../mysqlModels/reportchannels.js";

@Discord()
@SlashGroup("report", "admin")
export class AdminReportSlashes {
    @Slash({ description: "Инициализировать систему" })
    async setup(
        @SlashOption({
            name: "from",
            description: "Канал или категория откуда будут приходить репорты",
            required: true,
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildText, ChannelType.GuildCategory, ChannelType.GuildVoice]
        })
        from: GuildTextBasedChannel | CategoryChannel | BaseGuildVoiceChannel,
        interaction: CommandInteraction
    ) {
        const getChannel = await reportChannelsModel.getChannel(interaction.channelId);

        if (!getChannel.status) await reportChannelsModel.addChannel(interaction.channelId, interaction.guildId!);

        if (from.type == ChannelType.GuildCategory) {
            const channels = await (await interaction.guild!.channels.fetch()).filter(c => c!.parentId == from.id);
            if (channels.size != 0) {
                for (const channel of channels) {
                    if (channel[1]!.isVoiceBased()) await channel[1].send({
                        embeds: [adminBuilders.embeds.reportSystem(REPORT_SYSTEM_EMBED_TYPE.SETUP_CHANNEL_MESSAGE, {})],
                        components: [adminBuilders.buttons.report(interaction.channelId)]
                    });
                }
                await interaction.reply({
                    embeds: [adminBuilders.embeds.reportSystem(REPORT_SYSTEM_EMBED_TYPE.SETUP_CHANNEL_SUCCESS, {
                        channel: interaction.channelId,
                        from: from.id
                    })],
                    ephemeral: true
                });
            } else {
                await interaction.reply({
                    embeds: [adminBuilders.embeds.reportSystem(REPORT_SYSTEM_EMBED_TYPE.SETUP_CHANNEL_ERROR_NULL_CATEGORY, {
                        from: from.id
                    })],
                    ephemeral: true
                });
            }
        } else {
            await from.send({
                embeds: [adminBuilders.embeds.reportSystem(REPORT_SYSTEM_EMBED_TYPE.SETUP_CHANNEL_MESSAGE, {})],
                components: [adminBuilders.buttons.report(interaction.channelId)]
            });
            await interaction.reply({
                embeds: [adminBuilders.embeds.reportSystem(REPORT_SYSTEM_EMBED_TYPE.SETUP_CHANNEL_SUCCESS, {
                    channel: interaction.channelId,
                    from: from.id
                })],
                ephemeral: true
            });
        }
    }

    @Slash({ description: "Отключить канал" })
    async remove(interaction: CommandInteraction) {
        const getChannel = await reportChannelsModel.getChannel(interaction.channelId);

        if (getChannel.status) await reportChannelsModel.removeChannel(interaction.channelId);

        await interaction.reply({
            embeds: [adminBuilders.embeds.reportSystem(REPORT_SYSTEM_EMBED_TYPE.REMOVE_CHANNEL_SUCCESS, {
                channel: interaction.channelId
            })],
            ephemeral: true
        });
    }

    @Slash({ description: "Отключить все каналы репортов на сервере" })
    async clear(interaction: CommandInteraction) {
        await reportChannelsModel.clearChannels(interaction.guildId!);

        await interaction.reply({
            embeds: [adminBuilders.embeds.reportSystem(REPORT_SYSTEM_EMBED_TYPE.CLEAR_CHANNELS_SUCCESS, {})],
            ephemeral: true
        });
    }
}