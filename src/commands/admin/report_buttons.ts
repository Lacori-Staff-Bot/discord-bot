import { ButtonInteraction, PermissionsBitField, User } from "discord.js";
import { ButtonComponent, Discord } from "discordx";
import reportChannelsModel from "../../mysqlModels/reportchannels.js";
import { adminBuilders } from "../../builders/index.js";
import { REPORT_SYSTEM_EMBED_TYPE } from "../../builders/embeds/admin.js";
import reportsModel from "../../mysqlModels/reports.js";
import { bot } from "../../main.js";

@Discord()
export class AdminReportButtons {
    @ButtonComponent({ id: /report_/ })
    async report(interaction: ButtonInteraction) {
        const to = interaction.customId.split("_")[1];
        const getChannel = await reportChannelsModel.getChannel(to);

        if (!getChannel.status) {
            await interaction.message.delete();
            await interaction.reply({
                embeds: [adminBuilders.embeds.reportSystem(REPORT_SYSTEM_EMBED_TYPE.SENDED_ERROR, {})],
                ephemeral: true
            });
            return;
        }

        await interaction.showModal(adminBuilders.modals.sendReport(to));
    }

    @ButtonComponent({ id: /claimReport_/ })
    async claimReport(interaction: ButtonInteraction) {
        const id = parseInt(interaction.customId.split("_")[1]);
        const getReport = await reportsModel.getReport(id);

        if (!getReport.status) {
            await interaction.update({
                embeds: [adminBuilders.embeds.reportSystem(REPORT_SYSTEM_EMBED_TYPE.REPORT_CLAIMED_ERROR_EXIST, {})],
                components: []
            });
        } else {
            await reportsModel.updateReport(id, { admin: interaction.user.id });
            const author = await bot.users.fetch(getReport.report!.author) as User;
            await author.send({
                embeds: [adminBuilders.embeds.reportSystem(REPORT_SYSTEM_EMBED_TYPE.REPORT_CLAIMED_SUCCESS, { id, admin: interaction.user.id })]
            });

            await interaction.update({
                embeds: [adminBuilders.embeds.reportSystem(REPORT_SYSTEM_EMBED_TYPE.REPORT_FORM, {
                    id,
                    author: getReport.report!.author,
                    description: getReport.report!.description,
                    from: getReport.report!.channel,
                    admin: `<@${interaction.user.id}>`
                })],
                components: [adminBuilders.buttons.closeReport(id)]
            });
        }
    }

    @ButtonComponent({ id: /closeReport_/ })
    async closeReport(interaction: ButtonInteraction) {
        const id = parseInt(interaction.customId.split("_")[1]);
        const getReport = await reportsModel.getReport(id);

        if (!getReport.status) {
            await interaction.update({
                embeds: [adminBuilders.embeds.reportSystem(REPORT_SYSTEM_EMBED_TYPE.REPORT_CLOSED_ERROR_EXIST, {})],
                components: []
            });
        } else {
            if ((await interaction.guild!.fetchOwner()).id != interaction.user.id) {
                if (!(await interaction.guild!.members.fetch(interaction.user.id)).permissions.has(PermissionsBitField.Flags.Administrator, true)) {
                    await interaction.reply({
                        embeds: [adminBuilders.embeds.reportSystem(REPORT_SYSTEM_EMBED_TYPE.REPORT_CLOSED_ERROR_ADMIN, {})],
                        ephemeral: true
                    });
                    return;
                }
            }
            const author = await bot.users.fetch(getReport.report!.author) as User;
            await author.send({
                embeds: [adminBuilders.embeds.reportSystem(REPORT_SYSTEM_EMBED_TYPE.REPORT_CLOSED_SUCCESS, { id, admin: interaction.user.id })],
                components: [adminBuilders.buttons.rateReport(id, `${interaction.channelId}:${interaction.message.id}`)]
            });

            await interaction.update({
                embeds: [adminBuilders.embeds.reportSystem(REPORT_SYSTEM_EMBED_TYPE.REPORT_FORM, {
                    id,
                    author: getReport.report!.author,
                    description: getReport.report!.description,
                    from: getReport.report!.channel,
                    admin: `<@${interaction.user.id}>`
                })],
                components: []
            });
        }
    }

    @ButtonComponent({ id: /rate(One|Two|Three|Four|Five)_/ })
    async rate(interaction: ButtonInteraction) {
        const id = parseInt(interaction.customId.split("_")[1]);
        const form = interaction.customId.split("_")[2];
        const rate = interaction.customId.match(/(One|Two|Three|Four|Five)/)![0];
        const getReport = await reportsModel.getReport(id);

        if (!getReport.status) {
            await interaction.update({
                embeds: [adminBuilders.embeds.reportSystem(REPORT_SYSTEM_EMBED_TYPE.REPORT_RAITED_ERROR_EXIST, {})],
                components: []
            });
        } else {
            await interaction.showModal(adminBuilders.modals.rateReport(rate, id, form));
        }
    }
}