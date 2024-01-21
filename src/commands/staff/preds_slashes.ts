import { ApplicationCommandOptionType, GuildMember, CommandInteraction, GuildTextBasedChannel } from "discord.js";
import { Discord, Slash, SlashGroup, SlashOption } from "discordx";
import { BLOCK_SYSTEM_EMBED_TYPE, PREDS_EMBED_TYPE } from "../../builders/embeds/staff.js";
import { staffBuilders } from "../../builders/index.js";
import { RESTRICTION_TYPE, restrictions } from "../../subsystems/restrictions.js";
import blocksModel from "../../mysqlModels/blocks.js";
import guildsModel from "../../mysqlModels/guilds.js";

@Discord()
@SlashGroup("staff")
export class StaffPredsSlashes {
    @Slash({ description: "Выдать предупреждение" })
    async pred(
        @SlashOption({
            name: "member",
            description: "Пользователь",
            required: true,
            type: ApplicationCommandOptionType.User
        })
        member: GuildMember,
        @SlashOption({
            name: "reasone",
            description: "Причина",
            required: true,
            type: ApplicationCommandOptionType.String
        })
        reasone: string,
        interaction: CommandInteraction
    ) {
        const getGuild = await guildsModel.getGuild(interaction.guildId!);

        if (getGuild.guild!.preds != null) {
            const getBlockedTarget = await blocksModel.getBlockedTarget(interaction.user.id, interaction.guildId!);

            if (!getBlockedTarget.status || getBlockedTarget.block!.status == 0) {
                const preds = await interaction.guild!.channels.fetch(getGuild.guild!.preds) as GuildTextBasedChannel | null;

                if (preds != null) {
                    await restrictions.restrictions(RESTRICTION_TYPE.PRED, interaction, interaction.guildId!, interaction.member as GuildMember);
                    await interaction.reply({
                        embeds: [staffBuilders.embeds.predSystem(PREDS_EMBED_TYPE.PRED_SUCCESS, { target: member.id })],
                        ephemeral: true
                    });
                    await preds.send({
                        embeds: [staffBuilders.embeds.predSystem(PREDS_EMBED_TYPE.PRED_SIGNAL, { author: interaction.user.id, target: member.id, reasone })]
                    });
                    await member.send({
                        embeds: [staffBuilders.embeds.predSystem(PREDS_EMBED_TYPE.PRED_INFO, { guildName: interaction.guild!.name, author: interaction.user.id, reasone })]
                    });
                } else {
                    await interaction.reply({
                        embeds: [staffBuilders.embeds.predSystem(PREDS_EMBED_TYPE.ERROR_SYSTEM_DISABLED, {})],
                        ephemeral: true
                    });

                    await guildsModel.updateGuild(interaction.guildId!, { preds: null });
                }
            } else {
                await interaction.reply({
                    embeds: [staffBuilders.embeds.blockSystem(BLOCK_SYSTEM_EMBED_TYPE.ERROR_HAS_BLOCKED, {})],
                    ephemeral: true
                });
            }
        } else {
            await interaction.reply({
                embeds: [staffBuilders.embeds.predSystem(PREDS_EMBED_TYPE.ERROR_SYSTEM_DISABLED, {})],
                ephemeral: true
            });
        }
    }
}