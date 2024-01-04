import { EmbedBuilder } from "discord.js";

export function genderRole(type: "Success" | "Error", member?: string, role?: 0 | 1) {
    switch (type) {
        case "Success":
            return new EmbedBuilder({
                title: "Успешно",
                description: `<@${member}> была выдана ${role == 0 ? "мужская" : "женская"} роль`
            }).setColor("Green");
        case "Error":
            return new EmbedBuilder({
                title: "Ошибка",
                description: "Система гендр ролей не настроена"
            }).setColor("Red");
    }
}