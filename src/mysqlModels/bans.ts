import databaseController from "./main.js";

interface Ban {
    id: number,
    author: string,
    target: string,
    guildId: string,
    data: number,
    reason: string,
    status: 0 | 1 | 2
}

interface UpdateBan {
    reason?: string,
    status?: 0 | 1 | 2
}

class Bans {
    async addBan(author: string, target: string, guildId: string, reason: string) {
        const data = Date.now() + 24 * 60 * 60 * 1000;
        const addBan = await databaseController.updateRequest("INSERT INTO `bans` (author, target, guildId, data, reason) VALUES (?, ?, ?, ?, ?)", [author, target, guildId, data, reason]);

        if (!addBan.affectedRows) {
            return {
                status: false
            };
        } else {
            return {
                status: true,
                id: addBan.insertId
            };
        }
    }

    async getActiveBanId(id: number) {
        const getBanId = await databaseController.getRequest("SELECT * FROM `bans` WHERE id = ? AND status != 2", [id]) as Ban[];

        if (!getBanId.length) {
            return {
                status: false
            };
        } else {
            return {
                status: true,
                ban: getBanId[0]
            };
        }
    }

    async getActiveBan(target: string, guildId: string) {
        const getActiveBan = await databaseController.getRequest("SELECT * FROM `bans` WHERE target = ? AND guildId = ? AND status = 0", [target, guildId]) as Ban[];

        if (!getActiveBan.length) {
            return {
                status: false
            };
        } else {
            return {
                status: true,
                ban: getActiveBan[0]
            };
        }
    }

    async getActiveBans() {
        const getActiveBans = await databaseController.getRequest("SELECT * FROM `bans` WHERE status = 0", []) as Ban[];

        if (!getActiveBans.length) {
            return {
                status: false
            };
        } else {
            return {
                status: true,
                getActiveBans
            };
        }
    }

    async updateBan(id: number, options: UpdateBan) {
        const updateBan = await databaseController.updateRequest("UPDATE `bans` SET ? WHERE id = ?", [options, id]);

        if (!updateBan.affectedRows) {
            return {
                status: false
            };
        } else {
            return {
                status: true
            };
        }
    }

    async removeBan(id: number) {
        const removeBan = await databaseController.updateRequest("UPDATE `bans` SET status = 2 WHERE id = ?", [id]);

        if (!removeBan.affectedRows) {
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

const bansModel = new Bans();
export default bansModel;