import databaseController from "./main.js";

interface Ban {
    id: number
    author: string
    target: string
    guildId: string
    data: number
    reasone: string
    status: 0 | 1 | 2
}

interface UpdateBan {
    status?: 0 | 1 | 2
}

class Bans {
    /**
     * Create new ban record
     * @param author Author gived ban
     * @param target Target taked ban
     * @param guildId Guild were gived ban
     * @param reasone Ban reasone
     * @returns Status of creating record
     */
    public async addBan(author: string, target: string, guildId: string, reasone: string) {
        const data = Date.now() + 24 * 60 * 60 * 1000;
        const addBan = await databaseController.updateRequest("INSERT INTO `bans` (author, target, guildId, data, reasone) VALUES (?, ?, ?, ?, ?)", [author, target, guildId, data, reasone]);

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

    /**
     * Find active ban records by guildId
     * @param guildId Id of guild
     * @returns Status of exist records and records if status = true
     */
    public async getActiveBansForGuild(guildId: string) {
        const getActiveBansForGuild = await databaseController.getRequest("SELECT * FROM `bans` WHERE guildId = ? AND status != 2", [guildId]) as Ban[];

        if (!getActiveBansForGuild.length) {
            return {
                status: false
            };
        } else {
            return {
                status: true,
                bans: getActiveBansForGuild
            };
        }
    }

    /**
     * Find active ban record by id
     * @param id Id of ban record
     * @returns Status of exist record and record if status = true
     */
    public async getActiveBanForId(id: number) {
        const getActiveBanForId = await databaseController.getRequest("SELECT * FROM `bans` WHERE id = ? AND status != 2", [id]) as Ban[];

        if (!getActiveBanForId.length) {
            return {
                status: false
            };
        } else {
            return {
                status: true,
                ban: getActiveBanForId[0]
            };
        }
    }

    /**
     * Find active ban record by target info
     * @param target Target of ban record
     * @param guildId Guild of ban record
     * @returns Status of exist record and record if status = true
     */
    public async getActiveBanForTarget(target: string, guildId: string) {
        const getActiveBanForTarget = await databaseController.getRequest("SELECT * FROM `bans` WHERE target = ? AND guildId = ? AND status = 0", [target, guildId]) as Ban[];

        if (!getActiveBanForTarget.length) {
            return {
                status: false
            };
        } else {
            return {
                status: true,
                ban: getActiveBanForTarget[0]
            };
        }
    }

    /**
     * Find all active ban records
     * @returns Status of exist records and records if status = true
     */
    public async getActiveBans() {
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

    /**
     * Change ban status on banned in record by id
     * @param id Id of ban record
     * @returns Status of change status
     */
    public async makeBaned(id: number) {
        const update: UpdateBan = {
            status: 1
        };
        const makeBaned = await databaseController.updateRequest("UPDATE `bans` SET ? WHERE id = ?", [update, id]);

        if (!makeBaned.affectedRows) {
            return {
                status: false
            };
        } else {
            return {
                status: true
            };
        }
    }

    /**
     * Disable ban record by id
     * @param id Id of ban record
     * @returns Status of disable
     */
    public async removeBan(id: number) {
        const update: UpdateBan = {
            status: 2
        };
        const removeBan = await databaseController.updateRequest("UPDATE `bans` SET ? WHERE id = ?", [update, id]);

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