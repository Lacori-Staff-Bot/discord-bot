import { ApplicationCommandOptionType, GuildMember, CommandInteraction } from "discord.js";
import { Discord, Slash, SlashGroup, SlashOption } from "discordx";
import { BLOCK_SYSTEM_EMBED_TYPE, BANS_EMBED_TYPE } from "../../builders/embeds/staff.js";
import { staffBuilders } from "../../builders/index.js";
import { RESTRICTION_TYPE, restrictions } from "../../subsystems/restrictions.js";
import { AUDIT_TYPE, audit } from "../../subsystems/audit.js";
import blocksModel from "../../mysqlModels/blocks.js";
import bansModel from "../../mysqlModels/bans.js";


@Discord()
@SlashGroup("staff")
export class StaffBansSlashes {
    @Slash({ description: "Выдать бан" })
    async ban(
        @SlashOption({
            name: "member",
            description: "Пользователь",
            required: true,
            type: ApplicationCommandOptionType.User
        })
        member: GuildMember,
        @SlashOption({
            name: "reason",
            description: "Причина бана",
            required: true,
            type: ApplicationCommandOptionType.String
        })
        reasone: string,
        interaction: CommandInteraction
    ) {
        const getActiveBan = await bansModel.getActiveBanForTarget(member.id, interaction.guildId!);

        if (!member.moderatable) {
            await interaction.reply({
                embeds: [staffBuilders.embeds.banSystem(BANS_EMBED_TYPE.BAN_ERROR_MOD, { target: member.id })],
                ephemeral: true
            });
        } else if (!getActiveBan.status) {
            const getBlockedTarget = await blocksModel.getBlockedTarget(interaction.user.id, interaction.guildId!);

            if (!getBlockedTarget.status || getBlockedTarget.block!.status == 0) {
                const addBan = await bansModel.addBan(interaction.user.id, member.id, interaction.guildId!, reasone);
                await member.timeout(25 * 60 * 60 * 1000, reasone);

                await interaction.reply({
                    embeds: [staffBuilders.embeds.banSystem(BANS_EMBED_TYPE.BAN_SUCCESS, { target: member.id })],
                    ephemeral: true
                });
                await audit(AUDIT_TYPE.BAN, interaction, { target: member.id, reasone, id: addBan.id! });
                await restrictions.restrictions(RESTRICTION_TYPE.BAN, interaction, interaction.guildId!, interaction.member as GuildMember);
                await member.send({
                    embeds: [staffBuilders.embeds.banSystem(BANS_EMBED_TYPE.BAN_INFO, { guildName: interaction.guild!.name, author: interaction.user.id, reasone })]
                }).catch(err => console.log(err));
            } else {
                await interaction.reply({
                    embeds: [staffBuilders.embeds.blockSystem(BLOCK_SYSTEM_EMBED_TYPE.ERROR_HAS_BLOCKED, {})],
                    ephemeral: true
                });
            }
        } else {
            await interaction.reply({
                embeds: [staffBuilders.embeds.banSystem(BANS_EMBED_TYPE.BAN_ERROR_ACTIVE, { author: getActiveBan.ban!.author, reasone: getActiveBan.ban!.reasone })],
                ephemeral: true
            });
        }
    }

    @Slash({ description: "Снять бан" })
    async unban(
        @SlashOption({
            name: "member",
            description: "Пользователь",
            required: true,
            type: ApplicationCommandOptionType.User
        })
        member: GuildMember,
        interaction: CommandInteraction
    ) {
        const getActiveBan = await bansModel.getActiveBanForTarget(member.id, interaction.guildId!);

        if (!getActiveBan.status) {
            await interaction.reply({
                embeds: [staffBuilders.embeds.banSystem(BANS_EMBED_TYPE.UNBAN_ERROR_ACTIVE, {})],
                ephemeral: true
            });
        } else {
            const getBlockedTarget = await blocksModel.getBlockedTarget(interaction.user.id, interaction.guildId!);

            if (!getBlockedTarget.status || getBlockedTarget.block!.status == 0) {
                await bansModel.removeBan(getActiveBan.ban!.id);
                await member.timeout(null, "unban");

                await interaction.reply({
                    embeds: [staffBuilders.embeds.banSystem(BANS_EMBED_TYPE.UNBAN_SUCCESS, { target: member.id })],
                    ephemeral: true
                });
                await audit(AUDIT_TYPE.UNBAN, interaction, { target: member.id });
                await member.send({
                    embeds: [staffBuilders.embeds.banSystem(BANS_EMBED_TYPE.UNBAN_INFO, { guildName: interaction.guild!.name, author: interaction.user.id })]
                }).catch(err => console.log(err));
            } else {
                await interaction.reply({
                    embeds: [staffBuilders.embeds.blockSystem(BLOCK_SYSTEM_EMBED_TYPE.ERROR_HAS_BLOCKED, {})],
                    ephemeral: true
                });
            }
        }
    }
}