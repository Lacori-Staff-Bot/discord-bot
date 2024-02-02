import { GuildTextBasedChannel, ModalSubmitInteraction } from "discord.js";
import { Discord, ModalComponent } from "discordx";
import reportsModel from "../../mysqlModels/reports.js";
import { adminBuilders } from "../../builders/index.js";
import { REPORT_SYSTEM_EMBED_TYPE } from "../../builders/embeds/admin.js";
import { bot } from "../../main.js";

@Discord()
export class AdminReportModals {
    @ModalComponent({ id: /sendReport_/ })
    async sendReport(interaction: ModalSubmitInteraction) {
        const to = interaction.customId.split("_")[1];
        const description = interaction.fields.getTextInputValue("description");

        const addReport = await reportsModel.addReport(interaction.user.id, description, interaction.channelId!);

        if (addReport.status) {
            const reportChannle = await interaction.guild!.channels.fetch(to) as GuildTextBasedChannel;
            await reportChannle.send({
                embeds: [adminBuilders.embeds.reportSystem(REPORT_SYSTEM_EMBED_TYPE.REPORT_FORM, {
                    id: addReport.id!,
                    author: interaction.user.id,
                    description: description,
                    from: interaction.channelId!
                })],
                components: [adminBuilders.buttons.claimReport(addReport.id!)]
            });

            await interaction.reply({
                embeds: [adminBuilders.embeds.reportSystem(REPORT_SYSTEM_EMBED_TYPE.SENDED_SUCCESS, {})],
                ephemeral: true
            });
        }
    }

    @ModalComponent({ id: /rate(One|Two|Three|Four|Five)_/ })
    async rate(interaction: ModalSubmitInteraction) {
        const id = parseInt(interaction.customId.split("_")[1]);
        const form = interaction.customId.split("_")[2];
        const rate = interaction.customId.match(/(One|Two|Three|Four|Five)/)![0];
        const comment = interaction.fields.getTextInputValue("comment");
        const getReport = await reportsModel.getReport(id);

        if (!getReport.status) {
            await interaction.message!.delete();
            await interaction.reply({
                embeds: [adminBuilders.embeds.reportSystem(REPORT_SYSTEM_EMBED_TYPE.REPORT_RAITED_ERROR_EXIST, {})]
            });
        } else {
            await reportsModel.updateReport(id, { rate: { "One": 1, "Two": 2, "Three": 3, "Four": 4, "Five": 5 }[rate], comment });
            const channel = await bot.channels.fetch(form.split(":")[0]) as GuildTextBasedChannel;
            (await channel.messages.fetch(form.split(":")[1])).edit({
                embeds: [adminBuilders.embeds.reportSystem(REPORT_SYSTEM_EMBED_TYPE.REPORT_FORM, {
                    id,
                    author: getReport.report!.author,
                    description: getReport.report!.description,
                    from: getReport.report!.channel,
                    admin: `<@${getReport.report!.admin}>`,
                    rate: { "One": 1, "Two": 2, "Three": 3, "Four": 4, "Five": 5 }[rate],
                    comment
                })]
            });

            await interaction.message!.delete();
            await interaction.reply({
                embeds: [adminBuilders.embeds.reportSystem(REPORT_SYSTEM_EMBED_TYPE.REPORT_RAITED_SUCCESS, {})]
            });
        }
    }
}