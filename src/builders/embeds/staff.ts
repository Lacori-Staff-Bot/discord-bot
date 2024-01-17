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

export function activeBlock(type: "Blocked" | "Error" | "Signal" | "Unblocked" | "Info" | "ErrorNotFound", target?: string) {
    switch (type) {
        case "Blocked":
            return new EmbedBuilder({
                title: "Система ограничений",
                description: "Вы превысили установленное ограничение команд и не можете их более использовать до решения высшей администрации"
            }).setColor("Blurple");
        case "Error":
            return new EmbedBuilder({
                title: "Ошибка",
                description: "Вы заблокированы и не можете использовать команды наказания до решения высшей администрации"
            }).setColor("Red");
        case "Signal":
            return new EmbedBuilder({
                title: "Система ограничений",
                description: `Пользователь <@${target}> превысил установленные ограничения команд наказаний, доступ к командам был изъят`
            }).setColor("Blurple");
        case "Unblocked":
            return new EmbedBuilder({
                title: "Система ограничений",
                description: `Пользователь <@${target}> был разблокирован и вновь может использовать команды наказания`
            }).setColor("Blurple");
        case "Info":
            return new EmbedBuilder({
                title: "Система ограничений",
                description: "Вы были разблокированы и вновь можете использовать команды наказания"
            }).setColor("Blurple");
        case "ErrorNotFound":
            return new EmbedBuilder({
                title: "Ошибка",
                description: "Блокировка не найдена"
            }).setColor("Red");
    }
}

export function banUnban(type: "BanSuccess" | "BanErrorMod" | "BanErrorActive" | "BanErrorSystem" | "BanAudit" | "UnbanSuccess" | "UnBanErrorActiveButton" | "UnbanErrorActive" | "UnbanErrorSystem" | "UnbanAudit" | "BanInfo" | "UnbanInfo", target?: string, reason?: string, author?: string, guildName?: string) {
    switch (type) {
        case "BanSuccess":
            return new EmbedBuilder({
                title: "Успешно",
                description: `Пользователь <@${target}> был забанен на сервере по причине: ${reason}`
            }).setColor("Green");
        case "BanErrorMod":
            return new EmbedBuilder({
                title: "Ошибка",
                description: `Пользователя <@${target}> нельзя забанить на сервере`
            }).setColor("Red");
        case "BanErrorActive":
            return new EmbedBuilder({
                title: "Ошибка",
                description: `Пользователь <@${target}> уже имеет активный бан`
            }).setColor("Red");
        case "BanErrorSystem":
            return new EmbedBuilder({
                title: "Ошибка",
                description: `Не удалось забанить пользователя, попробуйте позже`
            }).setColor("Red");
        case "BanAudit":
            return new EmbedBuilder({
                title: "Бан",
                description: `Пользователь <@${target}> был забанен.\nВыдал: <@${author}>\nПричина: ${reason}`
            }).setColor("Orange");
        case "UnbanSuccess":
            return new EmbedBuilder({
                title: "Успешно",
                description: `Пользователь <@${target}> был разбанен на сервере`
            }).setColor("Green");
        case "UnBanErrorActiveButton":
            return new EmbedBuilder({
                title: "Ошибка",
                description: `Пользователь не имеет активных банов`
            }).setColor("Red");
        case "UnbanErrorActive":
            return new EmbedBuilder({
                title: "Ошибка",
                description: `Пользователь <@${target}> не имеет активных банов`
            }).setColor("Red");
        case "UnbanErrorSystem":
            return new EmbedBuilder({
                title: "Ошибка",
                description: `Не удалось разбанить пользователя, попробуйте позже`
            }).setColor("Red");
        case "UnbanAudit":
            return new EmbedBuilder({
                title: "Разбан",
                description: `Пользователь <@${target}> был разбанен.\nСнял: <@${author}>`
            }).setColor("Orange");
        case "BanInfo":
            return new EmbedBuilder({
                title: "Забанен",
                description: `Пользователь <@${author}> выдал вам бан на сервере: ${guildName}.\nПричина: ${reason}\nЕсли в течении 24 часов с вас не снимут бан, то вы будете забанены системно`
            }).setColor("Blurple");
        case "UnbanInfo":
            return new EmbedBuilder({
                title: "Разбанен",
                description: `Пользователь  <@${author}> снял с вас бан на сервере: ${guildName}`
            }).setColor("Blurple");
    }
}

export function MuteUnmute(type: "MuteSuccess" | "MuteErrorMod" | "MuteAudit" | "MuteInfo" | "UnmuteSuccess" | "UnmuteErrorMod" | "UnmuteAudit" | "UnmuteInfo", target?: string, reasone?: string, time?: number, author?: string, guildName?: string) {
    switch (type) {
        case "MuteSuccess":
            return new EmbedBuilder({
                title: "Успешно",
                description: `Пользователь <@${target}> был отстранён до <t:${time}>.\nПричина: ${reasone}.`
            }).setColor("Green");
        case "MuteErrorMod":
            return new EmbedBuilder({
                title: "Ошибка",
                description: `Невозможно отстранить <@${target}>, пользователь имеет имунитет.`
            }).setColor("Red");
        case "MuteAudit":
            return new EmbedBuilder({
                title: "Мут",
                description: `Пользователь <@${target}> был отстранён до <t:${time}>.\nПричина: ${reasone}\nВыдал: <@${author}>`
            }).setColor("Orange");
        case "MuteInfo":
            return new EmbedBuilder({
                title: `Отстранён - ${guildName}`,
                description: `Вы были отстранены до <t:${time}> по причине: ${reasone}.\nАвтор: <@${author}>`
            }).setColor("Blurple");
        case "UnmuteSuccess":
            return new EmbedBuilder({
                title: "Успешно",
                description: `Отстранение было снято с <@${target}>`
            }).setColor("Green");
        case "UnmuteErrorMod":
            return new EmbedBuilder({
                title: "Ошибка",
                description: `Пользователь <@${target}> не может быть отстранён и не нуждается в снятии наказания`
            }).setColor("Red");
        case "UnmuteAudit":
            return new EmbedBuilder({
                title: "Размут",
                description: `Пользователь <@${target}> был восстановлен в праве общения <@${author}>`
            }).setColor("Orange");
        case "UnmuteInfo":
            return new EmbedBuilder({
                title: `Восстановлен - ${guildName}`,
                description: `Пользователь <@${author}> снял с вас ограничение на общение`
            }).setColor("Blurple");
    }
}

export function warnUnwarn(type: "WarnSuccess" | "WarnErrorMod" | "WarnInfo" | "WarnAudit" | "UnwarnSuccess" | "UnwarnErrorExist" | "UnwarnInfo" | "WarnBan" | "WarnBanAudit", target?: string, reason?: string, author?: string, guildName?: string) {
    switch (type) {
        case "WarnSuccess":
            return new EmbedBuilder({
                title: `Успешно`,
                description: `Пользователю <@${target}> был выдан варн`
            }).setColor("Green");
        case "WarnErrorMod":
            return new EmbedBuilder({
                title: `Ошибка`,
                description: `Невозможно выдать варн пользователю <@${target}>, пользователь имеет имунитет`
            }).setColor("Red");
        case "WarnInfo":
            return new EmbedBuilder({
                title: `Варн - ${guildName}`,
                description: `Вам был видан варн <@${author}>\nПричина: ${reason}`
            }).setColor("Blurple");
        case "WarnAudit":
            return new EmbedBuilder({
                title: `Варн`,
                description: `Пользователь <@${author}> выдал варн <@${target}> по причине: ${reason}`
            }).setColor("Orange");
        case "UnwarnSuccess":
            return new EmbedBuilder({
                title: `Успешно`,
                description: `Варн был снят`
            }).setColor("Green");
        case "UnwarnErrorExist":
            return new EmbedBuilder({
                title: `Ошибка`,
                description: `Данный варн не активен`
            }).setColor("Red");
        case "UnwarnInfo":
            return new EmbedBuilder({
                title: `Снятие варна - ${guildName}`,
                description: `Пользователь <@${author}> снял у вас активный варн`
            }).setColor("Blurple");
        case "WarnBan":
            return new EmbedBuilder({
                title: `Забанен - ${guildName}`,
                description: "Вы были забанены системой за получение 3 варнов в течении недели"
            }).setColor("Blurple");
        case "WarnBanAudit":
            return new EmbedBuilder({
                title: `Бан`,
                description: `Пользователь <@${target}> был забанен системой за получение 3 варнов в течении недели`
            })
    }
}

export function givePred(type: "Success" | "Pred" | "Info" | "Error", target?: string, author?: string, reasone?: string, guildName?: string) {
    switch (type) {
        case "Success":
            return new EmbedBuilder({
                title: `Успешно`,
                description: `Пользователю <@${target}> было выдано предупреждение`
            }).setColor("Green");
        case "Pred":
            return new EmbedBuilder({
                title: `Предупреждение`,
                description: `Пользователь <@${author}> выдал <@${target}> предупреждение по причине: ${reasone}`
            }).setColor("Blurple");
        case "Info":
            return new EmbedBuilder({
                title: `Предупреждение - ${guildName}`,
                description: `Пользователь <@${author}> выдал вам предупреждение по причине: ${reasone}`
            }).setColor("Blurple");
        case "Error":
            return new EmbedBuilder({
                title: `Ошибка`,
                description: `Система предупреждений не настроена`
            }).setColor("Red");
    }
}