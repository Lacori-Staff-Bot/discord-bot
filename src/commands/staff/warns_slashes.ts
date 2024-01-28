import { ApplicationCommandOptionType, GuildMember, CommandInteraction } from "discord.js";
import { Discord, Slash, SlashGroup, SlashOption } from "discordx";
import { BLOCK_SYSTEM_EMBED_TYPE, WARNS_EMBED_TYPE } from "../../builders/embeds/staff.js";
import { staffBuilders } from "../../builders/index.js";
import { RESTRICTION_TYPE, restrictions } from "../../subsystems/restrictions.js";
import { AUDIT_TYPE, audit } from "../../subsystems/audit.js";
import bansModel from "../../mysqlModels/bans.js";
import blocksModel from "../../mysqlModels/blocks.js";
import warnsModel from "../../mysqlModels/warns.js";

@Discord()
@SlashGroup("staff")
export class StaffWarnsSlashes {
    @Slash({ description: "Выдать варн" })
    async warn(
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
        if (member.moderatable) {
            const getBlockedTarget = await blocksModel.getBlockedTarget(interaction.user.id, interaction.guildId!);

            if (!getBlockedTarget.status || getBlockedTarget.block!.status == 0) {
                const getTargetWarns = await warnsModel.getTargetWarns(interaction.guildId!, member.id);

                if (!getTargetWarns.status || getTargetWarns.warns!.length == 1) {
                    const addWarn = await warnsModel.addWarn(interaction.guildId!, member.id, interaction.user.id, reasone);

                    await interaction.reply({
                        embeds: [staffBuilders.embeds.warnSystem(WARNS_EMBED_TYPE.WARN_SUCCESS, { target: member.id })],
                        ephemeral: true
                    });
                    await audit(AUDIT_TYPE.WARN, interaction, { target: member.id, reasone, id: addWarn.id! });
                    await restrictions.restrictions(RESTRICTION_TYPE.WARN, interaction, interaction.guildId!, interaction.member as GuildMember);
                    await member.send({
                        embeds: [staffBuilders.embeds.warnSystem(WARNS_EMBED_TYPE.WARN_INFO, { guildName: interaction.guild!.name, author: interaction.user.id, reasone })]
                    });
                } else {
                    const addWarn = await warnsModel.addWarn(interaction.guildId!, member.id, interaction.user.id, reasone);
                    const addBan = await bansModel.addBan("0", member.id, interaction.guildId!, "Достижение лимита варнов");
                    await member.timeout(25 * 60 * 60 * 1000, "Max warns");

                    await interaction.reply({
                        embeds: [staffBuilders.embeds.warnSystem(WARNS_EMBED_TYPE.WARN_SUCCESS, { target: member.id })],
                        ephemeral: true
                    });
                    await audit(AUDIT_TYPE.WARN, interaction, { target: member.id, reasone, id: addWarn.id! });
                    await audit(AUDIT_TYPE.WARNBAN, interaction, { target: member.id, id: addBan.id! });
                    await restrictions.restrictions(RESTRICTION_TYPE.WARN, interaction, interaction.guildId!, interaction.member as GuildMember);
                    await member.send({
                        embeds: [
                            staffBuilders.embeds.warnSystem(WARNS_EMBED_TYPE.WARN_INFO, { guildName: interaction.guild!.name, author: interaction.user.id, reasone }),
                            staffBuilders.embeds.warnSystem(WARNS_EMBED_TYPE.WANR_BAN, {})
                        ]
                    });
                }
            } else {
                await interaction.reply({
                    embeds: [staffBuilders.embeds.blockSystem(BLOCK_SYSTEM_EMBED_TYPE.ERROR_HAS_BLOCKED, {})],
                    ephemeral: true
                });
            }
        } else {
            await interaction.reply({
                embeds: [staffBuilders.embeds.warnSystem(WARNS_EMBED_TYPE.WARN_ERROR_MOD, {})],
                ephemeral: true
            });
        }
    }
}