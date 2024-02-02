export interface Modals {
    admin: {
        sendReport: {
            title: string
            descriptionLabel: string
        }
        rateReport: {
            title: string
            commentLabel: string
        }
    }
}

export const modals: Modals = {
    admin: {
        sendReport: {
            title: "Отправка репорта",
            descriptionLabel: "Краткое описание ситуации"
        },
        rateReport: {
            title: "Оценка репорта",
            commentLabel: "Комментарий к оценке"
        }
    }
}