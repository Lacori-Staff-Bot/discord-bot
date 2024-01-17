import { ApplicationCommandOptionType, Role, type CommandInteraction, ChannelType, GuildTextBasedChannel } from "discord.js";
import { Discord, Slash, SlashGroup, SlashOption } from "discordx";
import { auditSystem, genderSystem, grPermission, predsSet, restrictSystem } from "../../builders/embeds/admin.js";
import guildsModel from "../../mysqlModels/guilds.js";
import restrictionsModel from "../../mysqlModels/restrictions.js";
import permissionsModel from "../../mysqlModels/permissions.js";

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
@SlashGroup({
  root: "admin",
  name: "restrict",
  description: "Система ограничений"
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
    const getGuild = await guildsModel.getGuild(interaction.guildId!);

    if (!getGuild.status) {
      await guildsModel.addGuild(interaction.guildId!);
      if (!channel) {
        await interaction.reply({
          embeds: [auditSystem("ResetError")],
          ephemeral: true
        });
      } else {
        const updateGuild = await guildsModel.updateGuild(interaction.guildId!, { audit: channel.id });

        if (!updateGuild.status) {
          await interaction.reply({
            embeds: [auditSystem("SetError")],
            ephemeral: true
          });
        } else {
          await interaction.reply({
            embeds: [auditSystem("SetSuccess", channel.id)],
            ephemeral: true
          });
        }
      }
    } else {
      if (!channel) {
        const updateGuild = await guildsModel.updateGuild(interaction.guildId!, { audit: null });

        if (!updateGuild.status) {
          await interaction.reply({
            embeds: [auditSystem("ResetError")],
            ephemeral: true
          });
        } else {
          await interaction.reply({
            embeds: [auditSystem("ResetSuccess")],
            ephemeral: true
          });
        }
      } else {
        const updateGuild = await guildsModel.updateGuild(interaction.guildId!, { audit: channel.id });

        if (!updateGuild.status) {
          await interaction.reply({
            embeds: [auditSystem("SetError")],
            ephemeral: true
          });
        } else {
          await interaction.reply({
            embeds: [auditSystem("SetChange", channel.id)],
            ephemeral: true
          });
        }
      }
    }
  }

  @SlashGroup("restrict", "admin")
  @Slash({ description: "Настройка ограничений" })
  async settings(
    @SlashOption({
      name: "channel",
      description: "Сигнальный канал",
      required: false,
      type: ApplicationCommandOptionType.Channel,
      channelTypes: [ChannelType.GuildText]
    })
    channel: GuildTextBasedChannel,
    @SlashOption({
      name: "max_bans",
      description: "Максимальное количество банов в течении 5 минут",
      required: false,
      type: ApplicationCommandOptionType.Number,
      maxValue: 10
    })
    maxBans: number,
    @SlashOption({
      name: "max_mutes",
      description: "Максимальное количество мутов в течении 5 минут",
      required: false,
      type: ApplicationCommandOptionType.Number,
      maxValue: 15
    })
    maxMutes: number,
    @SlashOption({
      name: "max_warns",
      description: "Максимальное количество варнов в течении 5 минут",
      required: false,
      type: ApplicationCommandOptionType.Number,
      maxValue: 15
    })
    maxWarns: number,
    @SlashOption({
      name: "max_preds",
      description: "Максимальное количество предупов в течении 5 минут",
      required: false,
      type: ApplicationCommandOptionType.Number,
      maxValue: 20
    })
    maxPreds: number,
    interaction: CommandInteraction
  ) {
    const getRestriction = await restrictionsModel.getRestriction(interaction.guildId!);

    if (!getRestriction.status) {
      await restrictionsModel.addRestriction(interaction.guildId!);
      if (!channel || (!maxBans && !maxMutes && !maxWarns && !maxPreds)) {
        await interaction.reply({
          embeds: [restrictSystem("ResetError")],
          ephemeral: true
        });
      } else {
        const updateRestriction = await restrictionsModel.updateRestriction(interaction.guildId!, {
          signalChannel: channel.id,
          maxBans: maxBans ? maxBans : undefined,
          maxMutes: maxMutes ? maxMutes : undefined,
          maxWarns: maxWarns ? maxWarns : undefined,
          maxPreds: maxPreds ? maxPreds : undefined
        });

        if (!updateRestriction.status) {
          await interaction.reply({
            embeds: [restrictSystem("CreateError")],
            ephemeral: true
          });
        } else {
          await interaction.reply({
            embeds: [restrictSystem("CreateSuccess")],
            ephemeral: true
          });
        }
      }
    } else {
      if ((channel && !maxBans && !maxMutes && !maxWarns && !maxPreds &&
        getRestriction.restriction!.signalChannel == channel.id) ||
        (maxBans && maxMutes && maxWarns && maxPreds &&
          getRestriction.restriction!.maxBans == maxBans &&
          getRestriction.restriction!.maxMutes == maxMutes &&
          getRestriction.restriction!.maxWarns == maxWarns &&
          getRestriction.restriction!.maxPreds == maxPreds)) {
        await interaction.reply({
          embeds: [restrictSystem("UpdateError")],
          ephemeral: true
        });
      } else if (!channel || (getRestriction.restriction!.maxBans == null &&
        getRestriction.restriction!.maxMutes == null &&
        getRestriction.restriction!.maxWarns == null &&
        getRestriction.restriction!.maxPreds == null &&
        !maxBans && !maxMutes && !maxWarns && !maxPreds)) {
        const updateRestriction = await restrictionsModel.updateRestriction(interaction.guildId!, {
          signalChannel: null,
          maxBans: null,
          maxMutes: null,
          maxWarns: null,
          maxPreds: null
        });

        if (!updateRestriction.status) {
          await interaction.reply({
            embeds: [restrictSystem("ResetError")],
            ephemeral: true
          });
        } else {
          await interaction.reply({
            embeds: [restrictSystem("ResetSuccess")],
            ephemeral: true
          });
        }
      } else {
        const updateRestriction = await restrictionsModel.updateRestriction(interaction.guildId!, {
          signalChannel: channel.id,
          maxBans: maxBans ? maxBans : undefined,
          maxMutes: maxMutes ? maxMutes : undefined,
          maxWarns: maxWarns ? maxWarns : undefined,
          maxPreds: maxPreds ? maxPreds : undefined
        });

        if (!updateRestriction.status) {
          await interaction.reply({
            embeds: [restrictSystem("UpdateError")],
            ephemeral: true
          });
        } else {
          await interaction.reply({
            embeds: [restrictSystem("UpdateSuccess")],
            ephemeral: true
          });
        }
      }
    }
  }

  @SlashGroup("restrict", "admin")
  @Slash({ description: "Предоставить право на обход системы ограничений" })
  async grandpriv(
    @SlashOption({
      name: "role",
      description: "Роль",
      required: true,
      type: ApplicationCommandOptionType.Role
    })
    role: Role,
    interaction: CommandInteraction
  ) {
    const getPermission = await permissionsModel.getPermission(role.id, interaction.guildId!);

    if (!getPermission.status) {
      const addPermission = await permissionsModel.addPermission(role.id, interaction.guildId!);

      if (!addPermission.status) {
        await interaction.reply({
          embeds: [grPermission("GrandErrorSystem", role.id)],
          ephemeral: true
        });
      } else {
        await interaction.reply({
          embeds: [grPermission("GrandSuccess", role.id)],
          ephemeral: true
        });
      }
    } else {
      await interaction.reply({
        embeds: [grPermission("GrandErrorExist", role.id)],
        ephemeral: true
      });
    }
  }

  @SlashGroup("restrict", "admin")
  @Slash({ description: "Изъять право на обход системы ограничений" })
  async removepriv(
    @SlashOption({
      name: "role",
      description: "Роль",
      required: true,
      type: ApplicationCommandOptionType.Role
    })
    role: Role,
    interaction: CommandInteraction
  ) {
    const getPermission = await permissionsModel.getPermission(role.id, interaction.guildId!);

    if (!getPermission.status) {
      await interaction.reply({
        embeds: [grPermission("RemoveErrorNotExist", role.id)],
        ephemeral: true
      });
    } else {
      const removePermission = await permissionsModel.removePermission(role.id, interaction.guildId!);

      if (!removePermission.status) {
        await interaction.reply({
          embeds: [grPermission("RemoveErrorSystem", role.id)],
          ephemeral: true
        });
      } else {
        await interaction.reply({
          embeds: [grPermission("RemoveSuccess", role.id)],
          ephemeral: true
        });
      }
    }
  }

  @SlashGroup("restrict", "admin")
  @Slash({ description: "Изъять все существующие права на обход системы ограничений" })
  async clear(interaction: CommandInteraction) {
    const clearPermission = await permissionsModel.clearPermission(interaction.guildId!);

    if (!clearPermission.status) {
      await interaction.reply({
        embeds: [grPermission("ClearError")],
        ephemeral: true
      });
    } else {
      await interaction.reply({
        embeds: [grPermission("ClearSuccess")],
        ephemeral: true
      });
    }
  }

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
    const getGuild = await guildsModel.getGuild(interaction.guildId!);

    if (preds) {
      if (getGuild.guild!.preds == null) {
        await guildsModel.updateGuild(interaction.guildId!, { preds: preds.id });

        await interaction.reply({
          embeds: [predsSet("SetSuccess", preds.id)],
          ephemeral: true
        });
      } else {
        if (getGuild.guild!.preds != preds.id) {
          await guildsModel.updateGuild(interaction.guildId!, { preds: preds.id });

          await interaction.reply({
            embeds: [predsSet("ChangeSuccess", preds.id)],
            ephemeral: true
          });
        } else {
          await interaction.reply({
            embeds: [predsSet("ChangeErrorAlready", preds.id)],
            ephemeral: true
          });
        }
      }
    } else {
      if (getGuild.guild!.preds != null) {
        await guildsModel.updateGuild(interaction.guildId!, { preds: null });

        await interaction.reply({
          embeds: [predsSet("RemoveSuccess")],
          ephemeral: true
        });
      } else {
        await interaction.reply({
          embeds: [predsSet("RemoveErrorExist")],
          ephemeral: true
        });
      }
    }
  }
}