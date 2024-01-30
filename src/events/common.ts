import type { ArgsOf } from "discordx";
import { Discord, On } from "discordx";
import guildsModel from "../mysqlModels/guilds.js";
import restrictionsModel from "../mysqlModels/restrictions.js";
import reportChannelsModel from "../mysqlModels/reportchannels.js";
import { AuditLogEvent, ChannelType } from "discord.js";
import { adminBuilders } from "../builders/index.js";
import { ANTI_CRASH_SYSTEM_EMBED_TYPE } from "../builders/embeds/admin.js";
import permissionsModel from "../mysqlModels/permissions.js";

@Discord()
export class Common {
  channels: { [key: string]: string } = {};

  @On({ event: "guildCreate" })
  async guildCreate([guild]: ArgsOf<"guildCreate">) {
    const getGuild = await guildsModel.getGuild(guild.id);

    if (!getGuild.status) {
      await guildsModel.addGuild(guild.id);
      await restrictionsModel.addRestriction(guild.id);
    }
  }

  @On({ event: "guildDelete" })
  async guildDelete([guild]: ArgsOf<"guildDelete">) {
    await restrictionsModel.removeRestriction(guild.id);
    await guildsModel.removeGuild(guild.id);
    await reportChannelsModel.clearChannels(guild.id);
  }

  @On({ event: "channelDelete" })
  async guildAuditLogEntryCreate([channel]: ArgsOf<"channelDelete">) {
    if (channel.type == ChannelType.GuildText || channel.type == ChannelType.GuildCategory || channel.type == ChannelType.GuildVoice) {
      const auditLog = (await channel.guild.fetchAuditLogs()).entries.first();
      const member = await channel.guild.members.fetch(auditLog!.executorId!);
      if (!member.manageable) {
        if (channel.type == ChannelType.GuildText) {
          const getGuild = await guildsModel.getGuild(channel.guildId);
          if (getGuild.guild!.audit == channel.id || getGuild.guild!.preds == channel.id) {
            await guildsModel.updateGuild(channel.guildId, {
              audit: getGuild.guild!.audit == channel.id ? null : undefined,
              preds: getGuild.guild!.preds == channel.id ? null : undefined
            });
          }

          const getRestrictions = restrictionsModel.getRestriction(channel.guildId);
          if ((await getRestrictions).restriction!.signalChannel == channel.id) await restrictionsModel.updateRestriction(channel.guildId, { signalChannel: null });

          const getChannel = await reportChannelsModel.getChannel(channel.id);
          if (getChannel.status) await reportChannelsModel.removeChannel(channel.id);
        }
        
        return;
      }
      const owner = await channel.guild.fetchOwner();
      if (member != null) member.roles.set([]);

      if (channel.type == ChannelType.GuildCategory) {
        const newChannel = await channel.guild.channels.create({
          name: channel.name,
          type: ChannelType.GuildCategory,
          permissionOverwrites: channel.permissionOverwrites.cache,
          position: channel.position
        });
        setTimeout(async () => {
          for (const [key, value] of Object.entries(this.channels)) {
            if (value == channel.id) {
              (await channel.guild.channels.fetch(key))?.edit({ parent: newChannel.id });
              delete this.channels[key];
            }
          }
        }, 5000);
        await owner.send({
          embeds: [adminBuilders.embeds.antiCrashSystem(ANTI_CRASH_SYSTEM_EMBED_TYPE.DELETED_CATEGORY, { member: member.id, channelName: channel.name })]
        });
      }

      if (channel.type == ChannelType.GuildText) {
        await channel.guild.channels.create({
          name: channel.name,
          type: ChannelType.GuildText,
          topic: channel.topic != null ? channel.topic : undefined,
          permissionOverwrites: channel.permissionOverwrites.cache,
          parent: channel.parent,
          position: channel.position
        });
        const getGuild = await guildsModel.getGuild(channel.guildId);
        if (getGuild.guild!.audit == channel.id || getGuild.guild!.preds == channel.id) {
          await guildsModel.updateGuild(channel.guildId, {
            audit: getGuild.guild!.audit == channel.id ? null : undefined,
            preds: getGuild.guild!.preds == channel.id ? null : undefined
          });
        }

        const getRestrictions = restrictionsModel.getRestriction(channel.guildId);
        if ((await getRestrictions).restriction!.signalChannel == channel.id) await restrictionsModel.updateRestriction(channel.guildId, { signalChannel: null });

        const getChannel = await reportChannelsModel.getChannel(channel.id);
        if (getChannel.status) await reportChannelsModel.removeChannel(channel.id);

        await owner.send({
          embeds: [adminBuilders.embeds.antiCrashSystem(ANTI_CRASH_SYSTEM_EMBED_TYPE.DELETED_TEXT_CHANNEL, { member: member.id, channelName: channel.name })]
        });
      }

      if (channel.type == ChannelType.GuildVoice) {
        await channel.guild.channels.create({
          name: channel.name,
          type: ChannelType.GuildVoice,
          permissionOverwrites: channel.permissionOverwrites.cache,
          parent: channel.parent,
          position: channel.position
        });
        await owner.send({
          embeds: [adminBuilders.embeds.antiCrashSystem(ANTI_CRASH_SYSTEM_EMBED_TYPE.DELETED_VOICE_CHANNEL, { member: member.id, channelName: channel.name })]
        });
      }
    }
  }

  @On({ event: "channelUpdate" })
  async channelUpdate([oldChannel, newChannel]: ArgsOf<"channelUpdate">) {
    if ((oldChannel.type == ChannelType.GuildText || oldChannel.type == ChannelType.GuildVoice) && (newChannel.type == ChannelType.GuildText || newChannel.type == ChannelType.GuildVoice)) {
      const auditLog = (await oldChannel.guild.fetchAuditLogs()).entries.first();
      const member = await oldChannel.guild.members.fetch(auditLog!.executorId!);
      if (!member.manageable) return;
      if (auditLog!.action == AuditLogEvent.ChannelDelete && oldChannel.parentId && !newChannel.parentId) {
        this.channels[oldChannel.id] = oldChannel.parentId;
      }
    }
  }

  @On({ event: "guildMemberAdd" })
  async guildMemberAdd([bot]: ArgsOf<"guildMemberAdd">) {
    if (bot.user.bot) {
      const auditLog = (await bot.guild.fetchAuditLogs()).entries.first();
      const member = await bot.guild.members.fetch(auditLog!.executorId!);
      if (!member.manageable) return;
      await bot.kick();
      const owner = await bot.guild.fetchOwner();
      member.roles.set([]);

      await owner.send({
        embeds: [adminBuilders.embeds.antiCrashSystem(ANTI_CRASH_SYSTEM_EMBED_TYPE.BOT_ADDED, { member: member.id, bot: bot.id })]
      });
    }
  }

  @On({ event: "roleDelete" })
  async roleDelete([role]: ArgsOf<"roleDelete">) {
    const auditLog = (await role.guild.fetchAuditLogs()).entries.first();
    const member = await role.guild.members.fetch(auditLog!.executorId!);
    if (!member.manageable) {
      const getGuild = await guildsModel.getGuild(role.guild.id);
      if (getGuild.guild!.genderRole == true && (getGuild.guild!.maleRole == role.id || getGuild.guild!.femaleRole == role.id)) {
        await guildsModel.updateGuild(role.guild.id, {
          genderRole: false,
          maleRole: null,
          femaleRole: null
        });
      }
      const getPermission = await permissionsModel.getPermission(role.id, role.guild.id);
      if (getPermission.status) await permissionsModel.removePermission(role.id, role.guild.id);

      return;
    }
    const owner = await role.guild.fetchOwner();
    member.roles.set([]);

    await role.guild.roles.create({
      name: role.name,
      color: role.color,
      position: role.position,
      permissions: role.permissions,
      mentionable: role.mentionable,
      hoist: role.hoist,
    });
    const getGuild = await guildsModel.getGuild(role.guild.id);
    if (getGuild.guild!.genderRole == true && (getGuild.guild!.maleRole == role.id || getGuild.guild!.femaleRole == role.id)) {
      await guildsModel.updateGuild(role.guild.id, {
        genderRole: false,
        maleRole: null,
        femaleRole: null
      });
    }
    const getPermission = await permissionsModel.getPermission(role.id, role.guild.id);
    if (getPermission.status) await permissionsModel.removePermission(role.id, role.guild.id);

    await owner.send({
      embeds: [adminBuilders.embeds.antiCrashSystem(ANTI_CRASH_SYSTEM_EMBED_TYPE.ROLE_DELETED, { member: member.id, role: role.name })]
    });
  }
}
