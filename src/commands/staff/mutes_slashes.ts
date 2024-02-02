import { ApplicationCommandOptionType, GuildMember, CommandInteraction } from "discord.js";
import { Discord, Slash, SlashGroup, SlashOption } from "discordx";
import { BLOCK_SYSTEM_EMBED_TYPE, MUTES_EMBED_TYPE } from "../../builders/embeds/staff.js";
import { staffBuilders } from "../../builders/index.js";
import { RESTRICTION_TYPE, restrictions } from "../../subsystems/restrictions.js";
import { AUDIT_TYPE, audit } from "../../subsystems/audit.js";
import blocksModel from "../../mysqlModels/blocks.js";

@Discord()
@SlashGroup("staff")
export class StaffMutesSlahes {
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
        reasone: string,
        interaction: CommandInteraction
    ) {
        if (member.moderatable) {
            const getBlockedTarget = await blocksModel.getBlockedTarget(interaction.user.id, interaction.guildId!);

            if (!getBlockedTarget.status || getBlockedTarget.block!.status == 0) {
                await member.timeout(time, reasone);
                const date = Math.trunc((Date.now() + time) / 1000);
                await interaction.reply({
                    embeds: [staffBuilders.embeds.muteSystem(MUTES_EMBED_TYPE.MUTE_SUCCESS, { target: member.id, time: date })],
                    ephemeral: true
                });
                await audit(AUDIT_TYPE.MUTE, interaction, { target: member.id, time: date, reasone });
                await restrictions.restrictions(RESTRICTION_TYPE.MUTE, interaction, interaction.guildId!, interaction.member as GuildMember);
                member.send({
                    embeds: [staffBuilders.embeds.muteSystem(MUTES_EMBED_TYPE.MUTE_INFO, { guildName: interaction.guild!.name, author: interaction.user.id, time: date, reasone })]
                }).catch(err => console.log(err));
            } else {
                await interaction.reply({
                    embeds: [staffBuilders.embeds.blockSystem(BLOCK_SYSTEM_EMBED_TYPE.ERROR_HAS_BLOCKED, {})],
                    ephemeral: true
                });
            }
        } else {
            await interaction.reply({
                embeds: [staffBuilders.embeds.muteSystem(MUTES_EMBED_TYPE.MUTE_ERROR_MOD, {})],
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
                    embeds: [staffBuilders.embeds.muteSystem(MUTES_EMBED_TYPE.UNMUTE_SUCCESS, { target: member.id })],
                    ephemeral: true
                });
                await audit(AUDIT_TYPE.UNMUTE, interaction, { target: member.id });
                await member.send({
                    embeds: [staffBuilders.embeds.muteSystem(MUTES_EMBED_TYPE.UNMUTE_INFO, { guildName: interaction.guild!.name, author: interaction.user.id })]
                }).catch(err => console.log(err));
            } else {
                await interaction.reply({
                    embeds: [staffBuilders.embeds.blockSystem(BLOCK_SYSTEM_EMBED_TYPE.ERROR_HAS_BLOCKED, {})],
                    ephemeral: true
                });
            }
        } else {
            await interaction.reply({
                embeds: [staffBuilders.embeds.muteSystem(MUTES_EMBED_TYPE.MUTE_ERROR_MOD, {})],
                ephemeral: true
            });
        }
    }
}