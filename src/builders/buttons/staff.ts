import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

export function unban(id: number) {
    const button = new ButtonBuilder({
        label: "Разбанить",
        customId: `unban_${id}`,
        style: ButtonStyle.Primary
    });
    return new ActionRowBuilder<ButtonBuilder>({ components: [button] });
}

export function unblock(id: number) {
    const button = new ButtonBuilder({
        label: "Разблокировать",
        customId: `unblock_${id}`,
        style: ButtonStyle.Primary
    });
    return new ActionRowBuilder<ButtonBuilder>({ components: [button] });
}