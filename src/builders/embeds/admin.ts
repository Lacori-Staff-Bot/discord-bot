import { EmbedBuilder } from "discord.js";
import locales from "../../locales/index.js";

export const enum AUDIT_SYSTEM_EMBED_TYPE {
    SET_SUCCESS,
    RESET_SUCCESS
}

export const enum GENDER_ROLE_SYSTEM_EMBED_TYPE {
    SET_SUCCESS,
    CHANGE_SUCCESS,
    SET_ERROR_MANAGED,
    RESET_SUCCESS
}

export const enum RESTRICTION_SYSTEM_EMBED_TYPE {
    EDIT_SUCCESS,
    CLEAR_SUCCESS,
    EDIT_ERROR_DISABLED

}
export const enum PERMISSION_SYSTEM_EMBED_TYPE {
    GRAND_SUCCESS,
    GRAND_ERROR_EXIST,
    REMOVE_SUCCESS,
    REMOVE_ERROR_EXIST,
    CLEAR_SUCCESS
}

export const enum PREDS_SYSTEM_EMBED_TYPE {
    SET_SUCCESS,
    RESET_SUCCESS
}

export class AdminEmbedBuilders {
    /**
     * Build audit system embed
     * @param type Type of embed message
     * @param replacements Replacements values
     * @returns Embed
     */
    public auditSystem(type: AUDIT_SYSTEM_EMBED_TYPE, replacements: { channel?: string }) {
        const { channel = "undefined" } = replacements;
        return new EmbedBuilder({
            title: locales.embeds.admin.audit[type].title,
            description: locales.embeds.admin.audit[type].description.replace("{channel}", channel),
            footer: { text: locales.embeds.admin.audit[type].footer }
        }).setColor(locales.embeds.admin.audit[type].color);
    }

    /**
     * Build gender role system embed
     * @param type Type of embed message
     * @param replacements Replacements values
     * @returns Embed
     */
    public genderRoleSystem(type: GENDER_ROLE_SYSTEM_EMBED_TYPE, replacements: { male?: string, female?: string, role?: string }) {
        const { male = "undefined", female = "underfined", role = "undefined" } = replacements;
        return new EmbedBuilder({
            title: locales.embeds.admin.genderRole[type].title,
            description: locales.embeds.admin.genderRole[type].description.replace("{male}", male).replace("{female}", female).replace("{role}", role)
        }).setColor(locales.embeds.admin.genderRole[type].color);
    }

    /**
     * Build resriction system embed
     * @param type Type of embed message
     * @param replacements Replacements values
     * @returns Embed
     */
    public restrictionSystem(type: RESTRICTION_SYSTEM_EMBED_TYPE) {
        return new EmbedBuilder({
            title: locales.embeds.admin.restrictions[type].title,
            description: locales.embeds.admin.restrictions[type].description,
            footer: { text: locales.embeds.admin.restrictions[type].footer }
        }).setColor(locales.embeds.admin.restrictions[type].color);
    }

    /**
     * Build permission system embed
     * @param type Type of embed message
     * @param replacements Replacements values
     * @returns Embed
     */
    public permissionSystem(type: PERMISSION_SYSTEM_EMBED_TYPE, replacements: { role?: string }) {
        const { role = "undefined" } = replacements;
        return new EmbedBuilder({
            title: locales.embeds.admin.permissions[type].title,
            description: locales.embeds.admin.permissions[type].description.replace("{role}", role)
        }).setColor(locales.embeds.admin.permissions[type].color);
    }

    /**
     * Build preds system embed
     * @param type Type of embed message
     * @param replacements Replacements values
     * @returns Embed
     */
    public predsSystem(type: PREDS_SYSTEM_EMBED_TYPE, replacements: { channel?: string }) {
        const { channel = "undefined" } = replacements;
        return new EmbedBuilder({
            title: locales.embeds.admin.preds[type].title,
            description: locales.embeds.admin.preds[type].description.replace("{channel}", channel),
            footer: { text: locales.embeds.admin.preds[type].footer }
        }).setColor(locales.embeds.admin.preds[type].color);
    }
}