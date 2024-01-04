import { ApplicationCommandOptionType, CommandInteraction, GuildMember } from "discord.js";
import { Discord, Slash, SlashChoice, SlashGroup, SlashOption } from "discordx";
import guildsModel from "../../mysqlModels/guilds.js";
import { genderRole } from "../../builders/embeds/staff.js";

@Discord()
@SlashGroup({
    name: "staff",
    description: "Команды стафа",
    dmPermission: false
})
@SlashGroup("staff")
export class Staff {
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
        await interaction.deferReply({ ephemeral: true });

        const getGuild = await guildsModel.getGuild(interaction.guildId!);

        if (!getGuild.status || !getGuild.guild!.genderRole) {
            await interaction.editReply({
                embeds: [genderRole("Error")]
            });
        } else {
            switch (role) {
                case 0:
                    if (member.roles.cache.has(getGuild.guild!.femaleRole!)) await member.roles.remove(getGuild.guild!.femaleRole!);
                    await member.roles.add(getGuild.guild!.maleRole!);
                    await interaction.editReply({
                        embeds: [genderRole("Success", member.id, 0)]
                    });
                    break;
                case 1:
                    if (member.roles.cache.has(getGuild.guild!.maleRole!)) await member.roles.remove(getGuild.guild!.maleRole!);
                    await member.roles.add(getGuild.guild!.femaleRole!);
                    await interaction.editReply({
                        embeds: [genderRole("Success", member.id, 1)]
                    });
                    break;
            }
        }
    }
}