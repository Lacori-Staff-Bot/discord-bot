import { ButtonInteraction } from "discord.js";
import { ButtonComponent, Discord } from "discordx";
import { BLOCK_SYSTEM_EMBED_TYPE, WARNS_EMBED_TYPE } from "../../builders/embeds/staff.js";
import { staffBuilders } from "../../builders/index.js";
import warnsModel from "../../mysqlModels/warns.js";
import blocksModel from "../../mysqlModels/blocks.js";
import { bot } from "../../main.js";

@Discord()
export class StaffWarnsButtons {
    @ButtonComponent({ id: /unwarn_/ })
    async unwarn(interaction: ButtonInteraction) {
        const id = interaction.customId.split("_")[1];
        const getWarnById = await warnsModel.getWarnById(parseInt(id));
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
        if (getWarnById.status) {
            const target = await bot.users.resolve(getWarnById.warn!.targetId);
            await warnsModel.removeWarn(parseInt(id));

            await interaction.update({
                embeds: [staffBuilders.embeds.warnSystem(WARNS_EMBED_TYPE.UNWARN_SUCCESS, { target: target!.id })],
                components: []
            });
            await target!.send({
                embeds: [staffBuilders.embeds.warnSystem(WARNS_EMBED_TYPE.UNWARN_INFO, { guildName: guild!.name, author: interaction.user.id })]
            }).catch(err => console.log(err));
        } else {
            await interaction.update({
                embeds: [staffBuilders.embeds.warnSystem(WARNS_EMBED_TYPE.UNWARN_ERROR_EXIST, {})],
                components: []
            });
        }
    }
}