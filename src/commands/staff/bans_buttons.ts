import { ButtonInteraction } from "discord.js";
import { ButtonComponent, Discord } from "discordx";
import { BANS_EMBED_TYPE, BLOCK_SYSTEM_EMBED_TYPE } from "../../builders/embeds/staff.js";
import { staffBuilders } from "../../builders/index.js";
import blocksModel from "../../mysqlModels/blocks.js";
import bansModel from "../../mysqlModels/bans.js";
import { bot } from "../../main.js";

@Discord()
export class StaffBansButtons {
    @ButtonComponent({ id: /unban_/ })
    async unban(interaction: ButtonInteraction) {
        const id = parseInt(interaction.customId.split("_")[1]);
        const getActiveBanId = await bansModel.getActiveBanForId(id);

        if (!getActiveBanId.status) {
            await interaction.update({
                embeds: [staffBuilders.embeds.banSystem(BANS_EMBED_TYPE.UNBAN_ERROR_ACTIVE, {})],
                components: []
            });
        } else {
            const guild = await (async (status: boolean = interaction.inGuild()) => {
                if (status) {
                    return interaction.guild!;
                } else {
                    const guildId = interaction.customId.split("_")[2];
                    return await bot.guilds.resolve(guildId);
                }
            })();
            if (interaction.inGuild()) {
                const getBlockedTarget = await blocksModel.getBlockedTarget(interaction.user.id, interaction.guildId!);
                if (getBlockedTarget.status) {
                    await interaction.reply({
                        embeds: [staffBuilders.embeds.blockSystem(BLOCK_SYSTEM_EMBED_TYPE.ERROR_HAS_BLOCKED, {})],
                        ephemeral: true
                    });
                    return;
                }
            }
            await bansModel.removeBan(id);
            const target = await bot.users.resolve(getActiveBanId.ban!.target);
            if (getActiveBanId.ban!.status == 1) {
                await guild!.members.unban(getActiveBanId.ban!.target, "unban");
            } else if (getActiveBanId.ban!.status == 0) {
                const targetMember = await guild!.members.resolve(getActiveBanId.ban!.target);
                targetMember!.timeout(null, "unban");
            }

            await target!.send({
                embeds: [staffBuilders.embeds.banSystem(BANS_EMBED_TYPE.UNBAN_INFO, { guildName: guild!.name, author: interaction.user.id })]
            }).catch(err => console.log(err));
            await interaction.update({
                embeds: [staffBuilders.embeds.banSystem(BANS_EMBED_TYPE.UNBAN_SUCCESS, { target: target!.id })],
                components: []
            });
        }
    }
}