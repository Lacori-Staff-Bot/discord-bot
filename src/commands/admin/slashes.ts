import { ApplicationCommandOptionType, Role, type CommandInteraction } from "discord.js";
import { Discord, Slash, SlashGroup, SlashOption } from "discordx";
import guildsModel from "../../mysqlModels/guilds.js";
import { genderSystem } from "../../builders/embeds/admin.js";

@Discord()
@SlashGroup({
  name: "admin",
  description: "Команды администратора",
  dmPermission: false,
  defaultMemberPermissions: ["Administrator"]
})
@SlashGroup({
  root: "admin",
  name: "gendersystem",
  description: "Гендр система"
})
@SlashGroup("admin")
export class Admin {
  @Slash({ description: "Пинг" })
  async ping(interaction: CommandInteraction) {
    await interaction.reply("Понг!");
  }

  @SlashGroup("gendersystem", "admin")
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
    await interaction.deferReply({ ephemeral: true });

    if (!male.editable || !female.editable) {
      var embeds = [];
      if (!male.editable) embeds.push(genderSystem("SetErrorManaged", undefined, undefined, male.id));
      if (!female.editable) embeds.push(genderSystem("SetErrorManaged", undefined, undefined, female.id));

      await interaction.editReply({
        embeds: embeds
      });
    } else {
      const getGuild = await guildsModel.getGuild(interaction.guildId!);

      if (!getGuild.status) {
        await guildsModel.addGuild(interaction.guildId!);
        await guildsModel.updateGuild(interaction.guildId!, { genderRole: true, maleRole: male.id, femaleRole: female.id });

        await interaction.editReply({
          embeds: [genderSystem("SetSuccess", male.id, female.id)]
        });
      } else {
        if (getGuild.guild!.genderRole) {
          if (getGuild.guild!.maleRole == male.id && getGuild.guild!.femaleRole == female.id) {
            await interaction.editReply({
              embeds: [genderSystem("SetErrorSystem")]
            });
          } else {
            if ((await interaction.guild!.roles.fetch(getGuild.guild!.maleRole!)) != null) {
              (await interaction.guild!.members.fetch()).filter(member => member.roles.cache.has(getGuild.guild!.maleRole!)).map(member => member.roles.remove(getGuild.guild!.maleRole!));
            }
            if (await interaction.guild!.roles.fetch(getGuild.guild!.femaleRole!) != null) {
              (await interaction.guild!.members.fetch()).filter(member => member.roles.cache.has(getGuild.guild!.femaleRole!)).map(member => member.roles.remove(getGuild.guild!.femaleRole!));
            }

            await guildsModel.updateGuild(interaction.guildId!, { maleRole: male.id, femaleRole: female.id });

            await interaction.editReply({
              embeds: [genderSystem("SetSuccess", male.id, female.id)]
            });
          }
        } else {
          const updateGuild = await guildsModel.updateGuild(interaction.guildId!, { genderRole: true, maleRole: male.id, femaleRole: female.id });

          if (!updateGuild.status) {
            await interaction.editReply({
              embeds: [genderSystem("SetErrorSystem")]
            });
          } else {
            await interaction.editReply({
              embeds: [genderSystem("SetSuccess", male.id, female.id)]
            });
          }
        }
      }
    }
  }

  @SlashGroup("gendersystem", "admin")
  @Slash({ description: "Сброс гендр системы" })
  async reset(interaction: CommandInteraction) {
    const getGuild = await guildsModel.getGuild(interaction.guildId!);

    if (!getGuild.status) {
      await interaction.reply({
        embeds: [genderSystem("ResetErrorSystem")],
        ephemeral: true
      });
    } else {
      if (getGuild.guild!.genderRole) {
        if ((await interaction.guild!.roles.fetch(getGuild.guild!.maleRole!)) != null) {
          (await interaction.guild!.members.fetch()).filter(member => member.roles.cache.has(getGuild.guild!.maleRole!)).map(member => member.roles.remove(getGuild.guild!.maleRole!));
        }
        if (await interaction.guild!.roles.fetch(getGuild.guild!.femaleRole!) != null) {
          (await interaction.guild!.members.fetch()).filter(member => member.roles.cache.has(getGuild.guild!.femaleRole!)).map(member => member.roles.remove(getGuild.guild!.femaleRole!));
        }
        await guildsModel.updateGuild(interaction.guildId!, { genderRole: false, maleRole: null, femaleRole: null });

        await interaction.reply({
          embeds: [genderSystem("ResetSuccess")],
          ephemeral: true
        });
      } else {
        await interaction.reply({
          embeds: [genderSystem("ResetErrorSystem")],
          ephemeral: true
        });
      }
    }
  }
}