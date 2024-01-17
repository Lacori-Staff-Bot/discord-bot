import databaseController from "./main.js";

interface Warn {
    id: number
    guildId: string
    targetId: string
    author: string
    reasone: string
    data: number
    status: number
}

interface UpdateWarn {
    guildId?: string
    targetId?: string
    author?: string
    reasone?: string
    data?: number
    status?: number
}

class Warns {
    async addWarn(guildId: string, targetId: string, author: string, reasone: string) {
        const data = Date.now() + 7 * 24 * 60 * 60 * 1000;
        const addWarn = await databaseController.updateRequest("INSERT INTO `warns` (guildId, targetId, author, reasone, data) VALUES (?, ?, ?, ?, ?)", [guildId, targetId, author, reasone, data]);

        if (!addWarn.affectedRows) {
            return {
                status: false
            };
        } else {
            return {
                status: true,
                id: addWarn.insertId
            };
        }
    }

    async getActiveWarns() {
        const getActiveWarns = await databaseController.getRequest("SELECT * FROM `warns` WHERE status = 0", []) as Warn[];

        if (!getActiveWarns.length) {
            return {
                status: false
            };
        } else {
            return {
                status: true,
                warns: getActiveWarns
            };
        }
    }

    async getWarnById(id: number) {
        const getWarnById = await databaseController.getRequest("SELECT * FROM `warns` WHERE id = ?", [id]) as Warn[];

        if (!getWarnById.length) {
            return {
                status: false
            };
        } else {
            return {
                status: true,
                warn: getWarnById[0]
            };
        }
    }

    async getTargetWarns(guildId: string, targetId: string) {
        const getTargetWarns = await databaseController.getRequest("SELECT * FROM `warns` WHERE guildId = ? AND targetId = ? AND status = 0", [guildId, targetId]) as Warn[];

        if (!getTargetWarns.length) {
            return {
                status: false
            };
        } else {
            return {
                status: true,
                warns: getTargetWarns
            };
        }
    }

    async updateWarns(id: number, options: UpdateWarn) {
        const updateWarns = await databaseController.updateRequest("UPDATE `warns` SET ? WHERE id = ?", [options, id]);

        if (!updateWarns.affectedRows) {
            return {
                status: false
            };
        } else {
            return {
                status: true
            };
        }
    }

    async removeWarn(id: number) {
        const removeWarn = await databaseController.updateRequest("UPDATE `warns` SET status = 1 WHERE id = ?", [id]);

        if (!removeWarn.affectedRows) {
            return {
                status: false
            };
        } else {
            return {
                status: true
            };
        }
    }
}

const warnsModel = new Warns();
export default warnsModel;