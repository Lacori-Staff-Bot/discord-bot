import { ButtonInteraction, User } from "discord.js";
import { ButtonComponent, Discord } from "discordx";
import { BLOCK_SYSTEM_EMBED_TYPE } from "../../builders/embeds/staff.js";
import { staffBuilders } from "../../builders/index.js";
import blocksModel from "../../mysqlModels/blocks.js";
import { bot } from "../../main.js";

@Discord()
export class Staff {
    @ButtonComponent({ id: /unblock_/ })
    async unblock(interaction: ButtonInteraction) {
        const id = parseInt(interaction.customId.split("_")[1]);
        const getBlockId = await blocksModel.getBlockId(id);

        if (!getBlockId.status) {
            await interaction.update({
                embeds: [staffBuilders.embeds.blockSystem(BLOCK_SYSTEM_EMBED_TYPE.ERROR_NOT_BLOCKED, {})],
                components: []
            });
        } else {
            const target = await bot.users.fetch(getBlockId.block!.target) as User;
            await blocksModel.removeBlock(id);

            await target.send({
                embeds: [staffBuilders.embeds.blockSystem(BLOCK_SYSTEM_EMBED_TYPE.UNBLOCKED_INFO, {})]
            });
            await interaction.update({
                embeds: [staffBuilders.embeds.blockSystem(BLOCK_SYSTEM_EMBED_TYPE.UNBLOCKED_SIGNAL, { target: target.id })],
                components: []
            });
        }
    }
}