import { EmbedBuilder } from "discord.js";

export function genderSystem(type: "SetSuccess" | "SetErrorManaged" | "SetErrorSystem" | "ResetSuccess" | "ResetErrorSystem", male?: string, female?: string, error?: string) {
    switch (type) {
        case "SetSuccess":
            return new EmbedBuilder({
                title: "Успешно",
                description: `Система гендр ролей настроена!\nМужская роль: <@&${male}>\nЖенская роль: <@&${female}>`
            }).setColor("Green");
        case "SetErrorManaged":
            return new EmbedBuilder({
                title: "Ошибка доступа",
                description: `Бот не может управлять ролью <@&${error}> для использования её в системе гендр ролей`
            }).setColor("Red");
        case "SetErrorSystem":
            return new EmbedBuilder({
                title: "Ошибка",
                description: "Бот не смог обновить настройки системы гендр ролей, возможно указываемые настройки соответствуют существующим"
            }).setColor("Red");
        case "ResetSuccess":
            return new EmbedBuilder({
                title: "Успешно",
                description: "Система гендр ролей была успешно сброшена"
            }).setColor("Green");
        case "ResetErrorSystem":
            return new EmbedBuilder({
                title: "Ошибка",
                description: "Бот не смог сбросить настройки системы гендр ролей, возможно она не была настроена"
            }).setColor("Red");
    }
}