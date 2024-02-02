import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import locales from "../../locales/index.js";

export class AdminButtonBuilders {
    public report(to: string) {
        const button = new ButtonBuilder({
            label: locales.buttons.admin.report.label,
            emoji: locales.buttons.admin.report.emoji != "" ? locales.buttons.admin.report.emoji : undefined,
            customId: `report_${to}`,
            style: ButtonStyle.Secondary
        });
        return new ActionRowBuilder<ButtonBuilder>({ components: [button] });
    }

    public claimReport(id: number) {
        const button = new ButtonBuilder({
            label: locales.buttons.admin.claimReport.label,
            emoji: locales.buttons.admin.claimReport.emoji != "" ? locales.buttons.admin.claimReport.emoji : undefined,
            customId: `claimReport_${id}`,
            style: ButtonStyle.Primary
        });
        return new ActionRowBuilder<ButtonBuilder>({ components: [button] });
    }

    public closeReport(id: number) {
        const button = new ButtonBuilder({
            label: locales.buttons.admin.closeReport.label,
            emoji: locales.buttons.admin.closeReport.emoji != "" ? locales.buttons.admin.closeReport.emoji : undefined,
            customId: `closeReport_${id}`,
            style: ButtonStyle.Danger
        });
        return new ActionRowBuilder<ButtonBuilder>({ components: [button] });
    }

    public rateReport(id: number, form: string) {
        const one = new ButtonBuilder({
            label: locales.buttons.admin.rateReport.one.label,
            emoji: locales.buttons.admin.rateReport.one.emoji != "" ? locales.buttons.admin.rateReport.one.emoji : undefined,
            customId: `rateOne_${id}_${form}`,
            style: ButtonStyle.Danger
        });
        const two = new ButtonBuilder({
            label: locales.buttons.admin.rateReport.two.label,
            emoji: locales.buttons.admin.rateReport.two.emoji != "" ? locales.buttons.admin.rateReport.two.emoji : undefined,
            customId: `rateTwo_${id}_${form}`,
            style: ButtonStyle.Danger
        });
        const three = new ButtonBuilder({
            label: locales.buttons.admin.rateReport.three.label,
            emoji: locales.buttons.admin.rateReport.three.emoji != "" ? locales.buttons.admin.rateReport.three.emoji : undefined,
            customId: `rateThree_${id}_${form}`,
            style: ButtonStyle.Primary
        });
        const four = new ButtonBuilder({
            label: locales.buttons.admin.rateReport.four.label,
            emoji: locales.buttons.admin.rateReport.four.emoji != "" ? locales.buttons.admin.rateReport.four.emoji : undefined,
            customId: `rateFour_${id}_${form}`,
            style: ButtonStyle.Success
        });
        const five = new ButtonBuilder({
            label: locales.buttons.admin.rateReport.five.label,
            emoji: locales.buttons.admin.rateReport.five.emoji != "" ? locales.buttons.admin.rateReport.five.emoji : undefined,
            customId: `rateFive_${id}_${form}`,
            style: ButtonStyle.Success
        });
        return new ActionRowBuilder<ButtonBuilder>({ components: [one, two, three, four, five] });
    }
}