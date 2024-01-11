import { ApplicationCommandOptionType, CommandInteraction, GuildMember, GuildTextBasedChannel } from "discord.js";
import { Discord, Slash, SlashChoice, SlashGroup, SlashOption } from "discordx";
import { MuteUnmute, activeBlock, banUnban, genderRole } from "../../builders/embeds/staff.js";
import { restrictions } from "../../subsystems/restrictions.js";
import { audit } from "../../subsystems/audit.js";
import bansModel from "../../mysqlModels/bans.js";
import guildsModel from "../../mysqlModels/guilds.js";
import blocksModel from "../../mysqlModels/blocks.js";

@Discord()
@SlashGroup({
    name: "staff",
    description: "Команды стафа",
    dmPermission: false
})
@SlashGroup("staff")
export class Staff {
    @Slash({ description: "Выдать гендер роль" })
    async genderrole(
        @SlashOption({
            name: "member",
            description: "Пользователь",
            required: true,
            type: ApplicationCommandOptionType.User,
        })
        member: GuildMember,
        @SlashChoice({ name: "Мужская", value: 0 })
        @SlashChoice({ name: "Женская", value: 1 })
        @SlashOption({
            name: "role",
            description: "Гендер роль",
            required: true,
            type: ApplicationCommandOptionType.Number
        })
        role: number,
        interaction: CommandInteraction
    ) {
        await interaction.deferReply({ ephemeral: true });

        const getGuild = await guildsModel.getGuild(interaction.guildId!);

        if (!getGuild.status || !getGuild.guild!.genderRole) {
            await interaction.editReply({
                embeds: [genderRole("Error")]
            });
        } else {
            switch (role) {
                case 0:
                    if (member.roles.cache.has(getGuild.guild!.femaleRole!)) await member.roles.remove(getGuild.guild!.femaleRole!);
                    await member.roles.add(getGuild.guild!.maleRole!);
                    await interaction.editReply({
                        embeds: [genderRole("Success", member.id, 0)]
                    });
                    break;
                case 1:
                    if (member.roles.cache.has(getGuild.guild!.maleRole!)) await member.roles.remove(getGuild.guild!.maleRole!);
                    await member.roles.add(getGuild.guild!.femaleRole!);
                    await interaction.editReply({
                        embeds: [genderRole("Success", member.id, 1)]
                    });
                    break;
            }
        }
    }

    @Slash({ description: "Выдать бан" })
    async ban(
        @SlashOption({
            name: "member",
            description: "Пользователь",
            required: true,
            type: ApplicationCommandOptionType.User
        })
        member: GuildMember,
        @SlashOption({
            name: "reason",
            description: "Причина бана",
            required: true,
            type: ApplicationCommandOptionType.String
        })
        reason: string,
        interaction: CommandInteraction
    ) {
        const getActiveBan = await bansModel.getActiveBan(member.id, interaction.guildId!);

        if (!member.moderatable) {
            await interaction.reply({
                embeds: [banUnban("BanErrorMod", member.id)],
                ephemeral: true
            });
        } else if (!getActiveBan.status) {
            const getBlockedTarget = await blocksModel.getBlockedTarget(interaction.user.id, interaction.guildId!);

            if (!getBlockedTarget.status || getBlockedTarget.block!.status == 0) {
                const addBan = await bansModel.addBan(interaction.user.id, member.id, interaction.guildId!, reason);
                await member.timeout(25 * 60 * 60 * 1000, reason);


                if (!addBan.status) {
                    await interaction.reply({
                        embeds: [banUnban("BanErrorSystem")],
                        ephemeral: true
                    });
                } else {
                    await interaction.reply({
                        embeds: [banUnban("BanSuccess", member.id, reason)],
                        ephemeral: true
                    });
                    await audit("ban", interaction, member.id, reason, undefined, addBan.id!);
                    await restrictions("ban", interaction, interaction.guildId!, interaction.member as GuildMember);
                    await member.send({
                        embeds: [banUnban("BanInfo", undefined, reason, interaction.user.id, interaction.guild!.name)]
                    });
                }
            } else {
                await interaction.reply({
                    embeds: [activeBlock("Error")],
                    ephemeral: true
                });
            }
        } else {
            await interaction.reply({
                embeds: [banUnban("BanErrorActive", member.id)],
                ephemeral: true
            });
        }
    }

    @Slash({ description: "Снять бан" })
    async unban(
        @SlashOption({
            name: "member",
            description: "Пользователь",
            required: true,
            type: ApplicationCommandOptionType.User
        })
        member: GuildMember,
        interaction: CommandInteraction
    ) {
        const getActiveBan = await bansModel.getActiveBan(member.id, interaction.guildId!);

        if (!getActiveBan.status) {
            await interaction.reply({
                embeds: [banUnban("UnbanErrorActive", member.id)],
                ephemeral: true
            });
        } else {
            const getBlockedTarget = await blocksModel.getBlockedTarget(interaction.user.id, interaction.guildId!);

            if (!getBlockedTarget.status || getBlockedTarget.block!.status == 0) {
                const removeBan = await bansModel.removeBan(getActiveBan.ban!.id);
                await member.timeout(null, "unban");

                if (!removeBan.status) {
                    await interaction.reply({
                        embeds: [banUnban("UnbanErrorSystem")],
                        ephemeral: true
                    });
                } else {
                    await interaction.reply({
                        embeds: [banUnban("UnbanSuccess", member.id)],
                        ephemeral: true
                    });
                    await audit("unban", interaction, member.id);
                    await member.send({
                        embeds: [banUnban("UnbanInfo", undefined, undefined, interaction.user.id, interaction.guild!.name)]
                    });
                }
            } else {
                await interaction.reply({
                    embeds: [activeBlock("Error")],
                    ephemeral: true
                });
            }
        }
    }

    @Slash({ description: "Выдать мут" })
    async mute(
        @SlashOption({
            name: "member",
            description: "Пользователь",
            required: true,
            type: ApplicationCommandOptionType.User
        })
        member: GuildMember,
        @SlashOption({
            name: "time",
            description: "Время мута",
            required: true,
            type: ApplicationCommandOptionType.Number,
            async autocomplete(interaction, command) {
                const time = interaction.options.getFocused();
                let groups = time.match(/\d+[dhms]/g);
                let result = { name: "", value: 0 };

                if (groups) {
                    let checks = { d: false, h: false, m: false, s: false };
                    groups.forEach(subgroup => {
                        let num = parseInt(subgroup);
                        let code = subgroup.slice(-1);
                        if (code == "d" && !checks.d) {
                            result.name += subgroup;
                            result.value += num * 24 * 60 * 60 * 1000;
                            checks.d = true;
                        }
                        if (code == "h" && !checks.h) {
                            result.name += subgroup;
                            result.value += num * 60 * 60 * 1000;
                            checks.h = true;
                        }
                        if (code == "m" && !checks.m) {
                            result.name += subgroup;
                            result.value += num * 60 * 1000;
                            checks.m = true;
                        }
                        if (code == "s" && !checks.s) {
                            result.name += subgroup;
                            result.value += num * 1000;
                            checks.s = true;
                        }
                    })
                    if (result.name != "")
                        await interaction.respond([{ name: result.name, value: result.value }]);
                    else
                        await interaction.respond([
                            { name: "4d (4 дня)", value: "4d" },
                            { name: "7h (7 часов)", value: "7h" },
                            { name: "45m (45 минут)", value: "45m" },
                            { name: "30s (30 секунд)", value: "30s" }
                        ]);
                } else {
                    await interaction.respond([
                        { name: "4d (4 дня)", value: 4 * 24 * 60 * 60 * 1000 },
                        { name: "7h (7 часов)", value: 7 * 60 * 60 * 1000 },
                        { name: "45m (45 минут)", value: 45 * 60 * 1000 },
                        { name: "30s (30 секунд)", value: 30 * 1000 }
                    ]);
                }
            },
        })
        time: number,
        @SlashOption({
            name: "reasone",
            description: "Причина мута",
            required: true,
            type: ApplicationCommandOptionType.String
        })
        reason: string,
        interaction: CommandInteraction
    ) {
        if (member.moderatable) {
            const getBlockedTarget = await blocksModel.getBlockedTarget(interaction.user.id, interaction.guildId!);

            if (!getBlockedTarget.status || getBlockedTarget.block!.status == 0) {
                await member.timeout(time, reason);
                const date = Math.trunc((Date.now()+time)/1000);
                await interaction.reply({
                    embeds: [MuteUnmute("MuteSuccess", member.id, reason, date)],
                    ephemeral: true
                });
                await audit("mute", interaction, member.id, reason, date);
                await restrictions("mute", interaction, interaction.guildId!, interaction.member as GuildMember);
                member.send({
                    embeds: [MuteUnmute("MuteInfo", undefined, reason, date, interaction.user.id, interaction.guild!.name)]
                });
            } else {
                await interaction.reply({
                    embeds: [activeBlock("Error")],
                    ephemeral: true
                });
            }
        } else {
            await interaction.reply({
                embeds: [MuteUnmute("MuteErrorMod", member.id)],
                ephemeral: true
            });
        }
    }

    @Slash({ description: "Снять мут" })
    async unmute(
        @SlashOption({
            name: "member",
            description: "Пользователь",
            required: true,
            type: ApplicationCommandOptionType.User
        })
        member: GuildMember,
        interaction: CommandInteraction
    ) {
        if (member.moderatable) {
            const getBlockedTarget = await blocksModel.getBlockedTarget(interaction.user.id, interaction.guildId!);

            if (!getBlockedTarget.status || getBlockedTarget.block!.status == 0) {
                await member.timeout(null, "Unmute");

                await interaction.reply({
                    embeds: [MuteUnmute("UnmuteSuccess", member.id)],
                    ephemeral: true
                });
                await audit("unmute", interaction, member.id);
                await member.send({
                    embeds: [MuteUnmute("UnmuteInfo", undefined, undefined, undefined, interaction.user.id, interaction.guild!.name)]
                });
            } else {
                await interaction.reply({
                    embeds: [activeBlock("Error")],
                    ephemeral: true
                });
            }
        } else {
            await interaction.reply({
                embeds: [MuteUnmute("UnmuteErrorMod", member.id)],
                ephemeral: true
            });
        }
    }
}