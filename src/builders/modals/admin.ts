import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import locales from "../../locales/index.js";

export class AdminModalBuilders {
    public sendReport(to: string) {
        const description = new TextInputBuilder({
            label: locales.modals.admin.sendReport.descriptionLabel,
            style: TextInputStyle.Paragraph,
            maxLength: 300,
            required: true,
            customId: "description"
        });
        const row = new ActionRowBuilder<TextInputBuilder>({ components: [description] });
        return new ModalBuilder({
            title: locales.modals.admin.sendReport.title,
            components: [row],
            customId: `sendReport_${to}`
        });
    }

    public rateReport(rate: string, id: number, form: string) {
        const comment = new TextInputBuilder({
            label: locales.modals.admin.rateReport.commentLabel,
            style: TextInputStyle.Paragraph,
            maxLength: 120,
            required: true,
            customId: "comment"
        });
        const row = new ActionRowBuilder<TextInputBuilder>({ components: [comment] });
        return new ModalBuilder({
            title: locales.modals.admin.rateReport.title,
            components: [row],
            customId: `rate${rate}_${id}_${form}`
        });
    }
}