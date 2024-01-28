import { ApplicationCommandOptionType, ChannelType, GuildTextBasedChannel, CommandInteraction, Role } from "discord.js";
import { Discord, Slash, SlashGroup, SlashOption } from "discordx";
import { PERMISSION_SYSTEM_EMBED_TYPE, RESTRICTION_SYSTEM_EMBED_TYPE } from "../../builders/embeds/admin.js";
import { adminBuilders } from "../../builders/index.js";
import permissionsModel from "../../mysqlModels/permissions.js";
import restrictionsModel from "../../mysqlModels/restrictions.js";

@Discord()
@SlashGroup("restrict", "admin")
export class AdminRestrictionSlashes {
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

        if (getRestriction.restriction!.signalChannel == null && !channel) {
            await interaction.reply({
                embeds: [adminBuilders.embeds.restrictionSystem(RESTRICTION_SYSTEM_EMBED_TYPE.EDIT_ERROR_DISABLED)],
                ephemeral: true
            });
            return;
        }

        if (!channel && !maxBans && !maxMutes && !maxWarns && !maxPreds) {
            await restrictionsModel.removeRestriction(interaction.guildId!);

            await interaction.reply({
                embeds: [adminBuilders.embeds.restrictionSystem(RESTRICTION_SYSTEM_EMBED_TYPE.CLEAR_SUCCESS)],
                ephemeral: true
            });
            return;
        }

        var replacements: {
            signalChannel?: string,
            maxBans?: number,
            maxMutes?: number,
            maxWarns?: number,
            maxPreds?: number
        } = {};

        if (channel) {
            replacements.signalChannel = channel.id;
        }
        if (maxBans) {
            replacements.maxBans = maxBans;
        }
        if (maxMutes) {
            replacements.maxMutes = maxMutes;
        }
        if (maxWarns) {
            replacements.maxWarns = maxWarns;
        }
        if (maxPreds) {
            replacements.maxPreds = maxPreds;
        }

        await restrictionsModel.updateRestriction(interaction.guildId!, replacements);

        await interaction.reply({
            embeds: [adminBuilders.embeds.restrictionSystem(RESTRICTION_SYSTEM_EMBED_TYPE.EDIT_SUCCESS)],
            ephemeral: true
        });
    }

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
            await permissionsModel.addPermission(role.id, interaction.guildId!);

            await interaction.reply({
                embeds: [adminBuilders.embeds.permissionSystem(PERMISSION_SYSTEM_EMBED_TYPE.GRAND_SUCCESS, { role: role.id })],
                ephemeral: true
            });
        } else {
            await interaction.reply({
                embeds: [adminBuilders.embeds.permissionSystem(PERMISSION_SYSTEM_EMBED_TYPE.GRAND_ERROR_EXIST, { role: role.id })],
                ephemeral: true
            });
        }
    }

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
                embeds: [adminBuilders.embeds.permissionSystem(PERMISSION_SYSTEM_EMBED_TYPE.REMOVE_ERROR_EXIST, { role: role.id })],
                ephemeral: true
            });
        } else {
            await permissionsModel.removePermission(role.id, interaction.guildId!);

            await interaction.reply({
                embeds: [adminBuilders.embeds.permissionSystem(PERMISSION_SYSTEM_EMBED_TYPE.REMOVE_SUCCESS, { role: role.id })],
                ephemeral: true
            });
        }
    }

    @Slash({ description: "Изъять все существующие права на обход системы ограничений" })
    async clear(interaction: CommandInteraction) {
        await permissionsModel.clearPermission(interaction.guildId!);

        await interaction.reply({
            embeds: [adminBuilders.embeds.permissionSystem(PERMISSION_SYSTEM_EMBED_TYPE.CLEAR_SUCCESS, {})],
            ephemeral: true
        });
    }
}