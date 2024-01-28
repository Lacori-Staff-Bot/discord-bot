import { ButtonInteraction } from "discord.js";
import { ButtonComponent, Discord } from "discordx";
import { BLOCK_SYSTEM_EMBED_TYPE, MUTES_EMBED_TYPE } from "../../builders/embeds/staff.js";
import { staffBuilders } from "../../builders/index.js";
import blocksModel from "../../mysqlModels/blocks.js";
import { bot } from "../../main.js";

@Discord()
export class StaffMutesButtons {
    @ButtonComponent({ id: /unmute_/ })
    async unmute(interaction: ButtonInteraction) {
        const id = interaction.customId.split("_")[1];
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
        const target = await bot.users.resolve(id);
        const targetMember = await guild!.members.resolve(id);
        targetMember!.timeout(null, "unmute");

        await target!.send({
            embeds: [staffBuilders.embeds.muteSystem(MUTES_EMBED_TYPE.UNMUTE_INFO, { guildName: guild!.name, author: interaction.user.id })]
        });

        await interaction.update({
            embeds: [staffBuilders.embeds.muteSystem(MUTES_EMBED_TYPE.UNMUTE_SUCCESS, { target: id })],
            components: []
        });
    }
}