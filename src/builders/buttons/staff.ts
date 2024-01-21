import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import locales from "../../locales/index.js";

export class StaffButtonBuilders {
    /**
     * Build unban button
     * @param id Id of ban
     * @returns Button
     */
    public unban(id: number) {
        const button = new ButtonBuilder({
            label: locales.buttons.staff.unban.label,
            emoji: locales.buttons.staff.unban.emoji != "" ? locales.buttons.staff.unban.emoji : undefined,
            customId: `unban_${id}`,
            style: ButtonStyle.Primary
        });
        return new ActionRowBuilder<ButtonBuilder>({ components: [button] });
    }

    /**
     * Build unmute button
     * @param id Id of mute
     * @param guildId Id of guild
     * @returns Button
     */
    public unmute(id: string, guildId: string) {
        const button = new ButtonBuilder({
            label: locales.buttons.staff.unmute.label,
            emoji: locales.buttons.staff.unmute.emoji != "" ? locales.buttons.staff.unmute.emoji : undefined,
            customId: `unmute_${id}_${guildId}`,
            style: ButtonStyle.Primary
        });
        return new ActionRowBuilder<ButtonBuilder>({ components: [button] });
    }

    /**
     * Build unwarn button
     * @param id Id of warn
     * @param guildId If of guild
     * @returns Button
     */
    public unwarn(id: number, guildId: string) {
        const button = new ButtonBuilder({
            label: locales.buttons.staff.unwarn.label,
            emoji: locales.buttons.staff.unwarn.emoji != "" ? locales.buttons.staff.unwarn.emoji : undefined,
            customId: `unwarn_${id}_${guildId}`,
            style: ButtonStyle.Primary
        });
        return new ActionRowBuilder<ButtonBuilder>({ components: [button] });
    }

    /**
     * Build unblock button
     * @param id Id of block
     * @returns Button
     */
    public unblock(id: number) {
        const button = new ButtonBuilder({
            label: locales.buttons.staff.unblock.label,
            emoji: locales.buttons.staff.unblock.emoji != "" ? locales.buttons.staff.unblock.emoji : undefined,
            customId: `unblock_${id}`,
            style: ButtonStyle.Primary
        });
        return new ActionRowBuilder<ButtonBuilder>({ components: [button] });
    }
}