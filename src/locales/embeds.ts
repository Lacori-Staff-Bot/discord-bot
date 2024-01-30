import { ColorResolvable } from "discord.js"
import { BANS_EMBED_TYPE, BLOCK_SYSTEM_EMBED_TYPE, GENDER_ROLE_EMBED_TYPE, MUTES_EMBED_TYPE, PREDS_EMBED_TYPE, WARNS_EMBED_TYPE } from "../builders/embeds/staff.js";
import { ANTI_CRASH_SYSTEM_EMBED_TYPE, AUDIT_SYSTEM_EMBED_TYPE, GENDER_ROLE_SYSTEM_EMBED_TYPE, PERMISSION_SYSTEM_EMBED_TYPE, PREDS_SYSTEM_EMBED_TYPE, REPORT_SYSTEM_EMBED_TYPE, RESTRICTION_SYSTEM_EMBED_TYPE } from "../builders/embeds/admin.js";
import { title } from "process";

export interface Embeds {
    admin: {
        audit: {
            [key in AUDIT_SYSTEM_EMBED_TYPE]: {
                title: string
                description: string
                footer: string
                color: ColorResolvable
            }
        }
        genderRole: {
            [key in GENDER_ROLE_SYSTEM_EMBED_TYPE]: {
                title: string
                description: string
                footer: string
                color: ColorResolvable
            }
        }
        restrictions: {
            [key in RESTRICTION_SYSTEM_EMBED_TYPE]: {
                title: string
                description: string
                footer: string
                color: ColorResolvable
            }
        }
        permissions: {
            [key in PERMISSION_SYSTEM_EMBED_TYPE]: {
                title: string
                description: string
                color: ColorResolvable
            }
        }
        preds: {
            [key in PREDS_SYSTEM_EMBED_TYPE]: {
                title: string
                description: string
                footer: string
                color: ColorResolvable
            }
        }
        reports: {
            [key in REPORT_SYSTEM_EMBED_TYPE]: {
                title: string
                description: string
                color: ColorResolvable
            }
        }
        antiCrashSystem: {
            [key in ANTI_CRASH_SYSTEM_EMBED_TYPE]: {
                title: string
                description: string
                color: ColorResolvable
                footer?: string
            }
        }
    }
    staff: {
        blocks: {
            [key in BLOCK_SYSTEM_EMBED_TYPE]: {
                title: string
                description: string
                color: ColorResolvable
            }
        }
        genderRole: {
            [GENDER_ROLE_EMBED_TYPE.GRANT_SUCCESS]: {
                title: string
                description: string
                color: ColorResolvable
                male: string
                female: string
            },
            [GENDER_ROLE_EMBED_TYPE.ERROR_SYSTEM_DISABLED]: {
                title: string
                description: string
                color: ColorResolvable
            }
        }
        bans: {
            [key in BANS_EMBED_TYPE]: {
                title: string
                description: string
                footer?: string
                color: ColorResolvable
            }
        }
        mutes: {
            [key in MUTES_EMBED_TYPE]: {
                title: string
                description: string
                color: ColorResolvable
            }
        }
        warns: {
            [key in WARNS_EMBED_TYPE]: {
                title: string
                description: string
                footer?: string
                color: ColorResolvable
            }
        }
        preds: {
            [key in PREDS_EMBED_TYPE]: {
                title: string
                description: string
                color: ColorResolvable
            }
        }
    }
}

export const embeds: Embeds = {
    admin: {
        audit: {
            [AUDIT_SYSTEM_EMBED_TYPE.SET_SUCCESS]: {
                title: "Успешно",
                description: "Канал <#{channel}> установлен в качестве канала аудита.",
                footer: "Система включена",
                color: "Green"
            },
            [AUDIT_SYSTEM_EMBED_TYPE.RESET_SUCCESS]: {
                title: "Успешно",
                description: "Канал аудита был сброшен.",
                footer: "Система отключена",
                color: "Green"
            }
        },
        genderRole: {
            [GENDER_ROLE_SYSTEM_EMBED_TYPE.SET_SUCCESS]: {
                title: "Успешно",
                description: "Роли <@&{male}> и <@&{female}> установлены в качестве гендр ролей.",
                footer: "Система включена",
                color: "Green"
            },
            [GENDER_ROLE_SYSTEM_EMBED_TYPE.CHANGE_SUCCESS]: {
                title: "Успешно",
                description: "Гендр роли изменены на <@&{male}> и <@&{female}>.",
                footer: "Система включена",
                color: "Green"
            },
            [GENDER_ROLE_SYSTEM_EMBED_TYPE.SET_ERROR_MANAGED]: {
                title: "Ошибка",
                description: "Невозможно установить роль <@&{role}> в качестве гендр роли.\nРоль имеет больше прав чем бот.",
                footer: "Проверьте соответствие списка ролей с вашим запросом",
                color: "Red"
            },
            [GENDER_ROLE_SYSTEM_EMBED_TYPE.RESET_SUCCESS]: {
                title: "Успешно",
                description: "Настройки системы гендр ролей были сброшены, бот заберёт ранее установленные роли у пользователей если они остались.",
                footer: "Система отключена",
                color: "Green"
            }
        },
        restrictions: {
            [RESTRICTION_SYSTEM_EMBED_TYPE.EDIT_SUCCESS]: {
                title: "Успешно",
                description: "Параметры системы ограничений были изменены.",
                footer: "Система включена",
                color: "Green"
            },
            [RESTRICTION_SYSTEM_EMBED_TYPE.CLEAR_SUCCESS]: {
                title: "Успешно",
                description: "Параметры системы ограничений были сброшены.",
                footer: "Система отключена",
                color: "Green"
            },
            [RESTRICTION_SYSTEM_EMBED_TYPE.EDIT_ERROR_DISABLED]: {
                title: "Ошибка",
                description: "Для активации системы необходимо указать параметр канала.",
                footer: "Система отключена",
                color: "Red"
            }
        },
        permissions: {
            [PERMISSION_SYSTEM_EMBED_TYPE.GRAND_SUCCESS]: {
                title: "Успешно",
                description: "Для <@&{role}> было предоставлено право на обход системы ограничений.",
                color: "Green"
            },
            [PERMISSION_SYSTEM_EMBED_TYPE.GRAND_ERROR_EXIST]: {
                title: "Ошибка",
                description: "У <@&{role}> уже имеется право на обход системы ограничений.",
                color: "Red"
            },
            [PERMISSION_SYSTEM_EMBED_TYPE.REMOVE_SUCCESS]: {
                title: "Успешно",
                description: "У <@&{role}> было изъято право на обход системы ограничений.",
                color: "Green"
            },
            [PERMISSION_SYSTEM_EMBED_TYPE.REMOVE_ERROR_EXIST]: {
                title: "Ошибка",
                description: "У <@&{role}> не имелось права на обход системы ограничений.",
                color: "Red"
            },
            [PERMISSION_SYSTEM_EMBED_TYPE.CLEAR_SUCCESS]: {
                title: "Успешно",
                description: "Все права на обход системы ограничений были изъяты.",
                color: "Green"
            }
        },
        preds: {
            [PREDS_SYSTEM_EMBED_TYPE.SET_SUCCESS]: {
                title: "Успешно",
                description: "<#{channel}> установлен как канал для предупреждений.",
                footer: "Система предупреждений включена",
                color: "Green"
            },
            [PREDS_SYSTEM_EMBED_TYPE.RESET_SUCCESS]: {
                title: "Успешно",
                description: "Канал для предупреждений сброшен.",
                footer: "Система предупреждений отключена",
                color: "Green"
            }
        },
        reports: {
            [REPORT_SYSTEM_EMBED_TYPE.SETUP_CHANNEL_SUCCESS]: {
                title: "Успешно",
                description: "Канал <#{channel}> будет принимать репорты из <#{from}>.",
                color: "Green"
            },
            [REPORT_SYSTEM_EMBED_TYPE.SETUP_CHANNEL_MESSAGE]: {
                title: "Возникла проблема?",
                description: "В случае если у вас возникли проблемы связанные с нарушением правил сервера вы можете обратится к администрации сервера через данную форму.",
                color: "Navy"
            },
            [REPORT_SYSTEM_EMBED_TYPE.SETUP_CHANNEL_ERROR_NULL_CATEGORY]: {
                title: "Ошибка",
                description: "Не возможно привязать категорию <#{from}>, при указании категории необходимо чтобы в ней был хотя бы один голосовой канал.",
                color: "Red"
            },
            [REPORT_SYSTEM_EMBED_TYPE.REMOVE_CHANNEL_SUCCESS]: {
                title: "Успешно",
                description: "Канал <#{channel}> больше не будет принимать никакие репорты.",
                color: "Green"
            },
            [REPORT_SYSTEM_EMBED_TYPE.CLEAR_CHANNELS_SUCCESS]: {
                title: "Успешно",
                description: "Система репортов полностью сброшена на сервере",
                color: "Green"
            },
            [REPORT_SYSTEM_EMBED_TYPE.SENDED_SUCCESS]: {
                title: "Успешно",
                description: "Репорт отправлен, скоро на него ответит администрация сервера.",
                color: "Green"
            },
            [REPORT_SYSTEM_EMBED_TYPE.SENDED_ERROR]: {
                title: "Ошибка",
                description: "Использованная вами форма более не связана ни с одним каналом для репортов, обратиться через неё к администрации невозможно.",
                color: "Red"
            },
            [REPORT_SYSTEM_EMBED_TYPE.REPORT_FORM]: {
                title: "Репрорт - #{id}",
                description: "Автор: <@{author}>\nОписание: {description}\nКанал происшествия: <#{from}>\nОтветчик: {admin}\nОценка: {rate}\nКомментарий оценки: {comment}",
                color: "Blurple"
            },
            [REPORT_SYSTEM_EMBED_TYPE.REPORT_CLAIMED_SUCCESS]: {
                title: "Репорт принят - #{id}",
                description: "Администратор <@{admin}> начал разбирать ваш репорт.",
                color: "Blurple"
            },
            [REPORT_SYSTEM_EMBED_TYPE.REPORT_CLAIMED_ERROR_EXIST]: {
                title: "Ошибка",
                description: "Принимаемый репорт не существет.",
                color: "Red"
            },
            [REPORT_SYSTEM_EMBED_TYPE.REPORT_CLOSED_SUCCESS]: {
                title: "Репорт закрыт - #{id}",
                description: "Администратор <@{admin}> отметил ваш репорт как выполненый, оцените его работу.",
                color: "Blurple"
            },
            [REPORT_SYSTEM_EMBED_TYPE.REPORT_CLOSED_ERROR_ADMIN]: {
                title: "Ошибка",
                description: "Вы не отвечаете на данный репорт.",
                color: "Red"
            },
            [REPORT_SYSTEM_EMBED_TYPE.REPORT_CLOSED_ERROR_EXIST]: {
                title: "Ошибка",
                description: "Закрываемый репорт не существует.",
                color: "Red"
            },
            [REPORT_SYSTEM_EMBED_TYPE.REPORT_RAITED_SUCCESS]: {
                title: "Успешно",
                description: "Ваша оценка репорта была записана, благодарим за потраченое время.",
                color: "Green"
            },
            [REPORT_SYSTEM_EMBED_TYPE.REPORT_RAITED_ERROR_EXIST]: {
                title: "Ошибка",
                description: "Оцениваемый репорт не существует.",
                color: "Red"
            }
        },
        antiCrashSystem: {
            [ANTI_CRASH_SYSTEM_EMBED_TYPE.DELETED_TEXT_CHANNEL]: {
                title: "Анти-слив система",
                description: "Пользователь <@{member}> удалил текстовый канал {channelName}, бот попытался восстановить канал но рекомендуем всё перепроверить. Пользователь был лишён всех имеющихся прав.",
                footer: "Если данный канал использовался в одной из систем бота его необходимо переинициализировать в системе.",
                color: "Red"
            },
            [ANTI_CRASH_SYSTEM_EMBED_TYPE.DELETED_VOICE_CHANNEL]: {
                title: "Анти-слив система",
                description: "Пользователь <@{member}> удалил голосовой канал {channelName}, бот попытался восстановить канал но рекомендуем всё перепроверить. Пользователь был лишён всех имеющихся прав.",
                color: "Red"
            },
            [ANTI_CRASH_SYSTEM_EMBED_TYPE.DELETED_CATEGORY]: {
                title: "Анти-слив система",
                description: "Пользователь <@{member}> удалил категорию {channelName}, бот попытался восстановить категорию но восстановить позицию каналов категории иногда тяжело, реокмендуем всё перепроверить. Пользователь был лишён всех имеющихся прав.",
                color: "Red"
            },
            [ANTI_CRASH_SYSTEM_EMBED_TYPE.BOT_ADDED]: {
                title: "Анти-слив система",
                description: "Пользователь <@{member}> добавил на сервер бота <@{bot}>, бот был удалён с сервера. Пользователь был лишён всех имеющихся прав.",
                color: "Red"
            },
            [ANTI_CRASH_SYSTEM_EMBED_TYPE.ROLE_DELETED]: {
                title: "Анти-слив система",
                description: "Пользователь <@{member}> удалил роль {role}, бот создал новую роль но восстановить список тех кому она принадлежала не возможно. Пользователь был лишён всех имеющихся прав.",
                footer: "Если данная роль использовалась в одной из систем бота (включая права на обход ограничений) её необходимо переинициализировать в системе.",
                color: "Red"
            }
        }
    },
    staff: {
        blocks: {
            [BLOCK_SYSTEM_EMBED_TYPE.BLOCKED_INFO]: {
                title: "Заблокирован",
                description: "Вы привысили допустимое количество выдаваемых в короткий промежуток наказаний и были заблокированы.\nВы сможете использовать команды после решения высшей администрации.",
                color: "Blurple"
            },
            [BLOCK_SYSTEM_EMBED_TYPE.BLOCKED_SIGNAL]: {
                title: "Блокировка",
                description: "Пользователь <@{target}> был заблокирован за превышение ограничения использования команд.",
                color: "Navy"
            },
            [BLOCK_SYSTEM_EMBED_TYPE.ERROR_HAS_BLOCKED]: {
                title: "Ошибка",
                description: "Вы были заблокированы и сможете использовать команды наказаний после решения высшей администрации.",
                color: "Red"
            },
            [BLOCK_SYSTEM_EMBED_TYPE.UNBLOCKED_SIGNAL]: {
                title: "Снятие блокировки",
                description: "Пользователь <@{target}> был разблокирован и может вновь использовать команды.",
                color: "Navy"
            },
            [BLOCK_SYSTEM_EMBED_TYPE.UNBLOCKED_INFO]: {
                title: "Разблокирован",
                description: "Вы были разблокированы и можете использовать команды наказаний.",
                color: "Blurple"
            },
            [BLOCK_SYSTEM_EMBED_TYPE.ERROR_NOT_BLOCKED]: {
                title: "Ошибка",
                description: "Пользователь не имеет активных блокирововк.",
                color: "Red"
            }
        },
        genderRole: {
            [GENDER_ROLE_EMBED_TYPE.GRANT_SUCCESS]: {
                title: "Успешно",
                description: "Пользователю <@{target}> установлена {role} гендерная роль.",
                color: "Green",
                male: "мужская",
                female: "женская"
            },
            [GENDER_ROLE_EMBED_TYPE.ERROR_SYSTEM_DISABLED]: {
                title: "Ошибка",
                description: "Система гендерных ролей не активина.",
                color: "Red"
            }
        },
        bans: {
            [BANS_EMBED_TYPE.BAN_SUCCESS]: {
                title: "Успешно",
                description: "Пользователь <@{target}> был забанен на сервере.\nЕсли в течении 24 часов бан не будет снят, пользователь будет забанен системно.",
                color: "Green"
            },
            [BANS_EMBED_TYPE.BAN_ERROR_MOD]: {
                title: "Ошибка",
                description: "Пользователь имеет имунитет и не может быть забанен.",
                color: "Red"
            },
            [BANS_EMBED_TYPE.BAN_ERROR_ACTIVE]: {
                title: "Ошибка",
                description: "Пользователь уже имеет активный бан от <@{author}> по причине: {reasone}",
                color: "Red"
            },
            [BANS_EMBED_TYPE.BAN_INFO]: {
                title: "Забанен - {guildName}",
                description: "Пользователь <@{author}> выдал вам бан на сервере.\nПричина: {reasone}",
                footer: "В случае если в течении 24 часов бан не будет снят, вы будете забанены системно.",
                color: "Blurple"
            },
            [BANS_EMBED_TYPE.BAN_AUDIT]: {
                title: "Бан",
                description: "Пользователь <@{author}> выдал бан <@{target}>.\nПричина: {reasone}",
                color: "Orange"
            },
            [BANS_EMBED_TYPE.UNBAN_SUCCESS]: {
                title: "Успешно",
                description: "Пользователь <@{target}> был разбанен на сервере.",
                color: "Green"
            },
            [BANS_EMBED_TYPE.UNBAN_ERROR_ACTIVE]: {
                title: "Ошибка",
                description: "Пользователь не имеет активных банов.",
                color: "Red"
            },
            [BANS_EMBED_TYPE.UNBAN_INFO]: {
                title: "Разбанен - {guildName}",
                description: "Пользователь <@{author}> снял с вас бан на сервере.",
                color: "Blurple"
            },
            [BANS_EMBED_TYPE.UNBAN_AUDIT]: {
                title: "Разбан",
                description: "Пользователь <@{author}> снял бан с <@{target}>",
                color: "Orange"
            }
        },
        mutes: {
            [MUTES_EMBED_TYPE.MUTE_SUCCESS]: {
                title: "Успешно",
                description: "Пользователь <@{target}> был отстранён до <t:{time}>.",
                color: "Green"
            },
            [MUTES_EMBED_TYPE.MUTE_ERROR_MOD]: {
                title: "Ошибка",
                description: "Пользователь имеет имунитет и не может быть отстранён.",
                color: "Red"
            },
            [MUTES_EMBED_TYPE.MUTE_INFO]: {
                title: "Отстранён - {guildName}",
                description: "Пользователь <@{author}> отстранил вас до <t:{time}>.\nПричина: {reasone}",
                color: "Blurple"
            },
            [MUTES_EMBED_TYPE.MUTE_AUDIT]: {
                title: "Отстранение",
                description: "Пользователь <@{author}> отстранил <@{target}> до <t:{time}>.\nПричина: {reasone}",
                color: "Orange"
            },
            [MUTES_EMBED_TYPE.UNMUTE_SUCCESS]: {
                title: "Успешно",
                description: "Пользователь <@{target}> был восстановлен.",
                color: "Green"
            },
            [MUTES_EMBED_TYPE.UNMUTE_INFO]: {
                title: "Восстановлен - {guildName}",
                description: "Пользователь <@{author}> восстановил вас.",
                color: "Blurple"
            },
            [MUTES_EMBED_TYPE.UNMUTE_AUDIT]: {
                title: "Восстановление",
                description: "Пользователь <@{author}> восстановил <@{target}>.",
                color: "Orange"
            }
        },
        warns: {
            [WARNS_EMBED_TYPE.WARN_SUCCESS]: {
                title: "Успешно",
                description: "Пользователю <@{target}> был выдан выговор.",
                color: "Green"
            },
            [WARNS_EMBED_TYPE.WARN_ERROR_MOD]: {
                title: "Ошибка",
                description: "Пользователь имеет имунитет и не может получить выговор.",
                color: "Red"
            },
            [WARNS_EMBED_TYPE.WARN_INFO]: {
                title: "Выговор - {guildName}",
                description: "Пользователь <@{author}> выдал вам выговор.\nПричина: {reasone}",
                footer: "Выговор будет снят системой через неделю. В случае получения трёх выговоров вы получите бан.",
                color: "Blurple"
            },
            [WARNS_EMBED_TYPE.WARN_AUDIT]: {
                title: "Выговор",
                description: "Пользователь <@{author}> выдал <@{target}> выговор.\nПричина: {reasone}",
                color: "Orange"
            },
            [WARNS_EMBED_TYPE.WANR_BAN]: {
                title: "Забанен",
                description: "Система выдала вам бан.\nПричина: Получение 3+ выговоров за неделю.",
                footer: "В случае если в течении 24 часов бан не будет снят, вы будете забанены системно.",
                color: "Navy"
            },
            [WARNS_EMBED_TYPE.WARN_BAN_AUDIT]: {
                title: "Бан",
                description: "Система выдала <@{target}> бан.\nПричина: Получение 3+ выговоров за неделю.",
                color: "Navy"
            },
            [WARNS_EMBED_TYPE.UNWARN_SUCCESS]: {
                title: "Успешно",
                description: "С пользователя <@{target}> был снят выговор.",
                color: "Green"
            },
            [WARNS_EMBED_TYPE.UNWARN_ERROR_EXIST]: {
                title: "Ошибка",
                description: "Выговор уже был снят.",
                color: "Red"
            },
            [WARNS_EMBED_TYPE.UNWARN_INFO]: {
                title: "Амнестирован - {guildName}",
                description: "Пользователь <@{author}> снял с вас один из активных выговоров.",
                color: "Blurple"
            },
            [WARNS_EMBED_TYPE.UNWARN_AUDIT]: {
                title: "Амнистия",
                description: "Пользователь <@{author}> снял с <@{target}> один из активных выговоров.",
                color: "Orange"
            }
        },
        preds: {
            [PREDS_EMBED_TYPE.PRED_SUCCESS]: {
                title: "Успешно",
                description: "Пользователю <@{target}> было выдано предупреждение.",
                color: "Green"
            },
            [PREDS_EMBED_TYPE.PRED_INFO]: {
                title: "Предупреждение - {guildName}",
                description: "Пользователь <@{author}> выдал вам предупреждение.\nПричина: {reasone}",
                color: "Blurple"
            },
            [PREDS_EMBED_TYPE.PRED_SIGNAL]: {
                title: "Предупреждение",
                description: "Пользователь <@{author}> выдал <@{target}> предупреждение.\nПричина: {reasone}",
                color: "Orange"
            },
            [PREDS_EMBED_TYPE.ERROR_SYSTEM_DISABLED]: {
                title: "Ошибка",
                description: "Система предупреждений не активна.",
                color: "Red"
            }
        }
    }
}