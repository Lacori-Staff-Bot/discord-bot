import { ApplicationCommandOptionType, GuildMember, CommandInteraction } from "discord.js";
import { Discord, Slash, SlashChoice, SlashGroup, SlashOption } from "discordx";
import guildsModel from "../../mysqlModels/guilds.js";
import { staffBuilders } from "../../builders/index.js";
import { GENDER_ROLE_EMBED_TYPE } from "../../builders/embeds/staff.js";

@Discord()
@SlashGroup("staff")
export class StaffGenderRoleSlashes {
    @Slash({ description: "Выдать гендер роль" })
    async genderrole(
        @SlashOption({
            name: "member",
            description: "Пользователь",
            required: true,
            type: ApplicationCommandOptionType.User,
        })
        member: GuildMember,
        @SlashChoice({ name: "Мужская", value: 0 })
        @SlashChoice({ name: "Женская", value: 1 })
        @SlashOption({
            name: "role",
            description: "Гендер роль",
            required: true,
            type: ApplicationCommandOptionType.Number
        })
        role: number,
        interaction: CommandInteraction
    ) {
        const getGuild = await guildsModel.getGuild(interaction.guildId!);

        if (!getGuild.guild!.genderRole) {
            await interaction.reply({
                embeds: [staffBuilders.embeds.genderRoleSystem(GENDER_ROLE_EMBED_TYPE.ERROR_SYSTEM_DISABLED, {})],
                ephemeral: true
            });
        } else {
            switch (role) {
                case 0:
                    if (member.roles.cache.has(getGuild.guild!.femaleRole!)) await member.roles.remove(getGuild.guild!.femaleRole!);
                    await member.roles.add(getGuild.guild!.maleRole!);
                    await interaction.reply({
                        embeds: [staffBuilders.embeds.genderRoleSystem(GENDER_ROLE_EMBED_TYPE.GRANT_SUCCESS, { target: member.id, role: 0 })],
                        ephemeral: true
                    });
                    break;
                case 1:
                    if (member.roles.cache.has(getGuild.guild!.maleRole!)) await member.roles.remove(getGuild.guild!.maleRole!);
                    await member.roles.add(getGuild.guild!.femaleRole!);
                    await interaction.reply({
                        embeds: [staffBuilders.embeds.genderRoleSystem(GENDER_ROLE_EMBED_TYPE.GRANT_SUCCESS, { target: member.id, role: 1 })],
                        ephemeral: true
                    });
                    break;
            }
        }
    }
}