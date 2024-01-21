import { ApplicationCommandOptionType, Role, CommandInteraction, EmbedBuilder } from "discord.js";
import { Discord, Slash, SlashGroup, SlashOption } from "discordx";
import { GENDER_ROLE_SYSTEM_EMBED_TYPE } from "../../builders/embeds/admin.js";
import { adminBuilders } from "../../builders/index.js";
import guildsModel from "../../mysqlModels/guilds.js";

@Discord()
@SlashGroup("gendersystem", "admin")
export class AdminGenderRoleSlashes {
    @Slash({ description: "Настройка гендр системы" })
    async set(
        @SlashOption({
            name: "male",
            description: "Мужская роль",
            required: true,
            type: ApplicationCommandOptionType.Role
        })
        male: Role,
        @SlashOption({
            name: "female",
            description: "Женская роль",
            required: true,
            type: ApplicationCommandOptionType.Role
        })
        female: Role,
        interaction: CommandInteraction
    ) {
        var embeds: EmbedBuilder[] = [];
        if (!male.editable) embeds.push(adminBuilders.embeds.genderRoleSystem(GENDER_ROLE_SYSTEM_EMBED_TYPE.SET_ERROR_MANAGED, { role: male.id }));
        if (!female.editable) embeds.push(adminBuilders.embeds.genderRoleSystem(GENDER_ROLE_SYSTEM_EMBED_TYPE.SET_ERROR_MANAGED, { role: female.id }));

        if (embeds.length != 0) {
            await interaction.editReply({
                embeds: embeds
            });
            return;
        }

        const getGuild = await guildsModel.getGuild(interaction.guildId!);

        if (getGuild.guild!.genderRole) {
            if ((await interaction.guild!.roles.fetch(getGuild.guild!.maleRole!)) != null) {
                (await interaction.guild!.members.fetch()).filter(member => member.roles.cache.has(getGuild.guild!.maleRole!))
                    .map(member => member.roles.remove(getGuild.guild!.maleRole!));
            }
            if (await interaction.guild!.roles.fetch(getGuild.guild!.femaleRole!) != null) {
                (await interaction.guild!.members.fetch()).filter(member => member.roles.cache.has(getGuild.guild!.femaleRole!))
                    .map(member => member.roles.remove(getGuild.guild!.femaleRole!));
            }

            await guildsModel.updateGuild(interaction.guildId!, { maleRole: male.id, femaleRole: female.id });

            await interaction.editReply({
                embeds: [adminBuilders.embeds.genderRoleSystem(GENDER_ROLE_SYSTEM_EMBED_TYPE.CHANGE_SUCCESS, { male: male.id, female: female.id })]
            });
        } else {
            await guildsModel.updateGuild(interaction.guildId!, { genderRole: true, maleRole: male.id, femaleRole: female.id });

            await interaction.editReply({
                embeds: [adminBuilders.embeds.genderRoleSystem(GENDER_ROLE_SYSTEM_EMBED_TYPE.SET_SUCCESS, { male: male.id, female: female.id })]
            });
        }
    }

    @Slash({ description: "Сброс гендр системы" })
    async reset(interaction: CommandInteraction) {
        const getGuild = await guildsModel.getGuild(interaction.guildId!);

        if (getGuild.guild!.genderRole) {
            if ((await interaction.guild!.roles.fetch(getGuild.guild!.maleRole!)) != null) {
                (await interaction.guild!.members.fetch()).filter(member => member.roles.cache.has(getGuild.guild!.maleRole!))
                    .map(member => member.roles.remove(getGuild.guild!.maleRole!));
            }
            if (await interaction.guild!.roles.fetch(getGuild.guild!.femaleRole!) != null) {
                (await interaction.guild!.members.fetch()).filter(member => member.roles.cache.has(getGuild.guild!.femaleRole!))
                    .map(member => member.roles.remove(getGuild.guild!.femaleRole!));
            }
        }
        await guildsModel.updateGuild(interaction.guildId!, { genderRole: false, maleRole: null, femaleRole: null });

        await interaction.reply({
            embeds: [adminBuilders.embeds.genderRoleSystem(GENDER_ROLE_SYSTEM_EMBED_TYPE.RESET_SUCCESS, {})],
            ephemeral: true
        });
    }
}