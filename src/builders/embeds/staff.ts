import { EmbedBuilder } from "discord.js";
import locales from "../../locales/index.js";

export const enum BLOCK_SYSTEM_EMBED_TYPE {
    BLOCKED_INFO,
    BLOCKED_SIGNAL,
    ERROR_HAS_BLOCKED,
    UNBLOCKED_SIGNAL,
    UNBLOCKED_INFO,
    ERROR_NOT_BLOCKED
}

export const enum GENDER_ROLE_EMBED_TYPE {
    GRANT_SUCCESS,
    ERROR_SYSTEM_DISABLED
}

export const enum BANS_EMBED_TYPE {
    BAN_SUCCESS,
    BAN_ERROR_MOD,
    BAN_ERROR_ACTIVE,
    BAN_INFO,
    BAN_AUDIT,
    UNBAN_SUCCESS,
    UNBAN_ERROR_ACTIVE,
    UNBAN_INFO,
    UNBAN_AUDIT
}

export const enum MUTES_EMBED_TYPE {
    MUTE_SUCCESS,
    MUTE_ERROR_MOD,
    MUTE_INFO,
    MUTE_AUDIT,
    UNMUTE_SUCCESS,
    UNMUTE_INFO,
    UNMUTE_AUDIT
}

export const enum WARNS_EMBED_TYPE {
    WARN_SUCCESS,
    WARN_ERROR_MOD,
    WARN_INFO,
    WARN_AUDIT,
    WANR_BAN,
    WARN_BAN_AUDIT,
    UNWARN_SUCCESS,
    UNWARN_ERROR_EXIST,
    UNWARN_INFO,
    UNWARN_AUDIT
}

export const enum PREDS_EMBED_TYPE {
    PRED_SUCCESS,
    PRED_INFO,
    PRED_SIGNAL,
    ERROR_SYSTEM_DISABLED
}

export class StaffEmbedBuilders {
    /**
     * Build block system embed
     * @param type Type of embed message
     * @param replacements Replacements values
     * @returns Embed
     */
    public blockSystem(type: BLOCK_SYSTEM_EMBED_TYPE, replacements: { target?: string }) {
        const { target = "undefined" } = replacements;
        return new EmbedBuilder({
            title: locales.embeds.staff.blocks[type].title,
            description: locales.embeds.staff.blocks[type].description.replace("{target}", target)
        }).setColor(locales.embeds.staff.blocks[type].color);
    }

    /**
     * Build gender role system embed
     * @param type Type of embed message
     * @param replacements Replacements values
     * @returns Embed
     */
    public genderRoleSystem(type: GENDER_ROLE_EMBED_TYPE, replacements: { target?: string, role?: 0 | 1 }) {
        const { target = "undefined", role = 0 } = replacements;
        return new EmbedBuilder({
            title: locales.embeds.staff.genderRole[type].title,
            description: locales.embeds.staff.genderRole[type].description.replace("{target}", target).replace("{role}", role == 0 ? locales.embeds.staff.genderRole[0].male : locales.embeds.staff.genderRole[0].female)
        }).setColor(locales.embeds.staff.genderRole[type].color);
    }

    /**
     * Build ban system embed
     * @param type Type of embed message
     * @param replacements Replacements values
     * @returns Embed
     */
    public banSystem(type: BANS_EMBED_TYPE, replacements: { target?: string, reasone?: string, author?: string, guildName?: string }) {
        const { target = "undefined", reasone = "undefined", author = "undefined", guildName = "undefined" } = replacements;
        return new EmbedBuilder({
            title: locales.embeds.staff.bans[type].title.replace("{guildName}", guildName),
            description: locales.embeds.staff.bans[type].description.replace("{target}", target).replace("{author}", author).replace("{reasone}", reasone),
            footer: type == BANS_EMBED_TYPE.BAN_INFO ? { text: locales.embeds.staff.bans[type].footer! } : undefined
        }).setColor(locales.embeds.staff.bans[type].color);
    }

    /**
     * Build mute system embed
     * @param type Type of embed message
     * @param replacements Replacements values
     * @returns Embed
     */
    public muteSystem(type: MUTES_EMBED_TYPE, replacements: { target?: string, reasone?: string, time?: number, author?: string, guildName?: string }) {
        const { target = "undefined", reasone = "undefined", time = 0, author = "undefined", guildName = "undefined" } = replacements;
        return new EmbedBuilder({
            title: locales.embeds.staff.mutes[type].title.replace("{guildName}", guildName),
            description: locales.embeds.staff.mutes[type].description.replace("{target}", target).replace("{author}", author).replace("{time}", `${time}`).replace("{reasone}", reasone)
        }).setColor(locales.embeds.staff.mutes[type].color);
    }

    /**
     * Build warn system embed
     * @param type Type of embed message
     * @param replacements Replacements values
     * @returns Embed
     */
    public warnSystem(type: WARNS_EMBED_TYPE, replacements: { target?: string, reasone?: string, author?: string, guildName?: string }) {
        const { target = "undefined", reasone = "undefined", author = "undefined", guildName = "undefined" } = replacements;
        return new EmbedBuilder({
            title: locales.embeds.staff.warns[type].title.replace("{guildName}", guildName),
            description: locales.embeds.staff.warns[type].description.replace("{target}", target).replace("{author}", author).replace("{reasone}", reasone),
            footer: type == WARNS_EMBED_TYPE.WARN_INFO || type == WARNS_EMBED_TYPE.WANR_BAN ? { text: locales.embeds.staff.warns[type].footer! } : undefined
        }).setColor(locales.embeds.staff.warns[type].color);
    }

    /**
     * Build pred system embed
     * @param type Type of embed message
     * @param replacements Replacements values
     * @returns Embed
     */
    public predSystem(type: PREDS_EMBED_TYPE, replacements: { target?: string, author?: string, reasone?: string, guildName?: string }) {
        const { target = "undefined", author = "undefined", reasone = "undefined", guildName = "undefined" } = replacements;
        return new EmbedBuilder({
            title: locales.embeds.staff.preds[type].title.replace("{guildName}", guildName),
            description: locales.embeds.staff.preds[type].description.replace("{target}", target).replace("{author}", author).replace("{reasone}", reasone)
        }).setColor(locales.embeds.staff.preds[type].color);
    }
}