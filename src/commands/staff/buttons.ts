import { ButtonInteraction, Guild, GuildMember, User } from "discord.js";
import { ButtonComponent, Discord } from "discordx";
import { bot } from "../../main.js";
import { MuteUnmute, activeBlock, banUnban } from "../../builders/embeds/staff.js";
import bansModel from "../../mysqlModels/bans.js";
import blocksModel from "../../mysqlModels/blocks.js";

@Discord()
export class Staff {
    @ButtonComponent({ id: /unblock_/ })
    async unblock(interaction: ButtonInteraction) {
        const id = parseInt(interaction.customId.split("_")[1]);
        const getBlockId = await blocksModel.getBlockId(id);

        if (!getBlockId.status) {
            await interaction.update({
                embeds: [activeBlock("ErrorNotFound")],
                components: []
            });
        } else {
            const target = await bot.users.fetch(getBlockId.block!.target) as User;
            await blocksModel.removeBlock(id);

            await target.send({
                embeds: [activeBlock("Info")]
            });
            await interaction.update({
                embeds: [activeBlock("Unblocked", target.id)],
                components: []
            });
        }
    }

    @ButtonComponent({ id: /unban_/ })
    async unban(interaction: ButtonInteraction) {
        const id = parseInt(interaction.customId.split("_")[1]);
        const getActiveBanId = await bansModel.getActiveBanId(id);

        if (!getActiveBanId.status) {
            await interaction.update({
                embeds: [banUnban("UnBanErrorActiveButton")],
                components: []
            });
        } else {
            if (interaction.inGuild()) {
                const getBlockedTarget = await blocksModel.getBlockedTarget(interaction.user.id, interaction.guildId!);

                if (!getBlockedTarget.status || getBlockedTarget.block!.status == 0) {
                    await bansModel.removeBan(id);
                    const guild = await bot.guilds.resolve(getActiveBanId.ban!.guildId) as Guild;
                    const target = await bot.users.fetch(getActiveBanId.ban!.target) as User;
                    if (getActiveBanId.ban!.status == 1) {
                        await guild.members.unban(getActiveBanId.ban!.target, "unban");
                    } else if (getActiveBanId.ban!.status == 0) {
                        const member = await guild.members.resolve(getActiveBanId.ban!.target) as GuildMember | null;
                        if (member != null) member.timeout(null, "unban");
                    }

                    await target.send({
                        embeds: [banUnban("UnbanInfo", undefined, undefined, interaction.user.id, guild.name)]
                    });

                    await interaction.update({
                        embeds: [banUnban("UnbanSuccess", getActiveBanId.ban!.target)],
                        components: []
                    });
                } else {
                    await interaction.reply({
                        embeds: [activeBlock("Error")],
                        ephemeral: true
                    });
                }
            } else {
                await bansModel.removeBan(id);
                const guild = await bot.guilds.resolve(getActiveBanId.ban!.guildId) as Guild;
                const target = await bot.users.fetch(getActiveBanId.ban!.target) as User;
                if (getActiveBanId.ban!.status == 1) {
                    await guild.members.unban(getActiveBanId.ban!.target, "unban");
                } else if (getActiveBanId.ban!.status == 0) {
                    const member = await guild.members.resolve(getActiveBanId.ban!.target) as GuildMember | null;
                    if (member != null) member.timeout(null, "unban");
                }

                await target.send({
                    embeds: [banUnban("UnbanInfo", undefined, undefined, interaction.user.id, guild.name)]
                });

                await interaction.update({
                    embeds: [banUnban("UnbanSuccess", getActiveBanId.ban!.target)],
                    components: []
                });
            }
        }
    }

    @ButtonComponent({ id: /unmute_/ })
    async unmute(interaction: ButtonInteraction) {
        const id = interaction.customId.split("_")[1];
        const guildId = interaction.customId.split("_")[2];
        if (interaction.inGuild()) {
            const getBlockedTarget = await blocksModel.getBlockedTarget(interaction.user.id, interaction.guildId!);

            if (!getBlockedTarget.status || getBlockedTarget.block!.status == 0) {
                const guild = await bot.guilds.resolve(guildId) as Guild;
                const member = await guild.members.resolve(id) as GuildMember | null;
                const target = await bot.users.fetch(id) as User;
                if (member != null) member.timeout(null, "unmute");

                await target.send({
                    embeds: [MuteUnmute("UnmuteInfo", undefined, undefined, undefined, interaction.user.id, guild.id)]
                });

                await interaction.update({
                    embeds: [MuteUnmute("UnmuteSuccess", id)],
                    components: []
                });
            } else {
                await interaction.reply({
                    embeds: [activeBlock("Error")],
                    ephemeral: true
                });
            }
        } else {
            const guild = await bot.guilds.resolve(guildId) as Guild;
            const member = await guild.members.resolve(id) as GuildMember | null;
            const target = await bot.users.fetch(id) as User;
            if (member != null) member.timeout(null, "unmute");

            await target.send({
                embeds: [MuteUnmute("UnmuteInfo", undefined, undefined, undefined, interaction.user.id, guild.name)]
            });

            await interaction.update({
                embeds: [MuteUnmute("UnmuteSuccess", id)],
                components: []
            });
        }
    }
}