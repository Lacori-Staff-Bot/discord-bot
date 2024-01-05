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

export function auditSystem(type: "SetSuccess" | "SetChange" | "SetError" | "ResetSuccess" | "ResetError", channel?: string) {
    switch (type) {
        case "SetSuccess":
            return new EmbedBuilder({
                title: "Успешно",
                description: `Канал <#${channel}> успешно установлен в качестве канала аудита`
            }).setColor("Green");
        case "SetChange":
            return new EmbedBuilder({
                title: "Успешно",
                description: `Канал аудита успешно был заменён на <#${channel}>`
            }).setColor("Green");
        case "SetError":
            return new EmbedBuilder({
                title: "Ошибка",
                description: "Не удалось установить канал аудита"
            }).setColor("Red");
        case "ResetSuccess":
            return new EmbedBuilder({
                title: "Успешно",
                description: "Канал аудита был успешно сброшен"
            }).setColor("Green");
        case "ResetError":
            return new EmbedBuilder({
                title: "Ошибка",
                description: "Не удалось сбросить канал аудита, возможно он не был установлен"
            }).setColor("Red");
    }
}

export function restrictSystem(type: "CreateSuccess" | "CreateError" | "UpdateSuccess" | "UpdateError" | "ResetSuccess" | "ResetError") {
    switch (type) {
        case "CreateSuccess":
            return new EmbedBuilder({
                title: "Успешно",
                description: "Настройки ограничений были созданы"
            }).setColor("Green");
        case "CreateError":
            return new EmbedBuilder({
                title: "Ошибка",
                description: "Не удалось создать настройки ограничений"
            }).setColor("Red");
        case "UpdateSuccess":
            return new EmbedBuilder({
                title: "Успешно",
                description: "Настройки ограничений были обновлены"
            }).setColor("Green");
        case "UpdateError":
            return new EmbedBuilder({
                title: "Ошибка",
                description: "Не удалось обновить настройки ограничений, возможно введёные параметры были выставлены ранее"
            }).setColor("Red");
        case "ResetSuccess":
            return new EmbedBuilder({
                title: "Успешно",
                description: "Настройки ограничений были сброшены"
            }).setColor("Green");
        case "ResetError":
            return new EmbedBuilder({
                title: "Ошибка",
                description: "Не удалось сбросить настройки ограничений, возможно они не были установлены"
            }).setColor("Red");
    }
}

export function grPermission(type: "GrandSuccess" | "GrandErrorExist" | "GrandErrorSystem" | "RemoveSuccess" | "RemoveErrorNotExist" | "RemoveErrorSystem" | "ClearSuccess" | "ClearError", role?: string) {
    switch (type) {
        case "GrandSuccess":
            return new EmbedBuilder({
                title: "Успешно",
                description: `Роли <@&${role}> успешно было выдано право на игнорирование ограничений`
            }).setColor("Green");
        case "GrandErrorExist":
            return new EmbedBuilder({
                title: "Ошибка",
                description: `Роль <@&${role}> уже имеет право на игнорирование ограничений`
            }).setColor("Red");
        case "GrandErrorSystem":
            return new EmbedBuilder({
                title: "Ошибка",
                description: `Не удалось выдать роли <@&${role}> право на игнорирование ограничений`
            }).setColor("Red");
        case "RemoveSuccess":
            return new EmbedBuilder({
                title: "Успешно",
                description: `Роль <@&${role}> больше не имеет прав на игнорирование ограничений`
            }).setColor("Green");
        case "RemoveErrorNotExist":
            return new EmbedBuilder({
                title: "Ошибка",
                description: `Роль <@&${role}> не имела прав на игнорирование ограничений`
            }).setColor("Red");
        case "RemoveErrorSystem":
            return new EmbedBuilder({
                title: "Ошибка",
                description: `Не удалось забрать у роли <@${role}> права на игнорирование ограничений`
            }).setColor("Red");
        case "ClearSuccess":
            return new EmbedBuilder({
                title: "Успешно",
                description: `Все права на игнорирование системы ограничений были изъяты`
            }).setColor("Green");
        case "ClearError":
            return new EmbedBuilder({
                title: "Ошибка",
                description: `Прав на игнорирование системы ограничений не было найдено`
            }).setColor("Red");
    }
}