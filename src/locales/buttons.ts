export interface Buttons {
    staff: {
        unban: {
            label: string
            emoji: string
        }
        unmute: {
            label: string
            emoji: string
        }
        unwarn: {
            label: string
            emoji: string
        }
        unblock: {
            label: string
            emoji: string
        }
    }
    admin: {
        report: {
            label: string
            emoji: string
        }
        claimReport: {
            label: string
            emoji: string
        }
        closeReport: {
            label: string
            emoji: string
        }
        rateReport: {
            one: {
                label: string
                emoji: string
            }
            two: {
                label: string
                emoji: string
            }
            three: {
                label: string
                emoji: string
            }
            four: {
                label: string
                emoji: string
            }
            five: {
                label: string
                emoji: string
            }
        }
    }
}

export const buttons: Buttons = {
    staff: {
        unban: {
            label: "Разбанить",
            emoji: ""
        },
        unmute: {
            label: "Размутить",
            emoji: ""
        },
        unwarn: {
            label: "Снять",
            emoji: ""
        },
        unblock: {
            label: "Разблокировать",
            emoji: ""
        }
    },
    admin: {
        report: {
            label: "Позвать на помощь",
            emoji: ""
        },
        claimReport: {
            label: "Принять",
            emoji: ""
        },
        closeReport: {
            label: "Закрыть",
            emoji: ""
        },
        rateReport: {
            one: {
                label: "1",
                emoji: ""
            },
            two: {
                label: "2",
                emoji: ""
            },
            three: {
                label: "3",
                emoji: ""
            },
            four: {
                label: "4",
                emoji: ""
            },
            five: {
                label: "5",
                emoji: ""
            }
        }
    }
}