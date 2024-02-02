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
    /**
     * Create new warn record
     * @param guildId Guild were gived warn
     * @param target Target taked warn
     * @param author Author gived warn
     * @param reasone Warn reasone
     * @returns Status of creating record
     */
    public async addWarn(guildId: string, targetId: string, author: string, reasone: string) {
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

    /**
     * Find all active warn records
     * @returns Status of exist records and records if status = true
     */
    public async getActiveWarns() {
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

    /**
     * Find active warn records by guildId
     * @param guildId guildId of warn records
     * @returns Status of exist records and records if status = true
     */
    public async getActiveWarnsForGuild(guildId: string) {
        const getActiveWarnsForId = await databaseController.getRequest("SELECT * FROM `warns` WHERE guildId = ? AND status = 0", [guildId]) as Warn[];

        if (!getActiveWarnsForId.length) {
            return {
                status: false
            };
        } else {
            return {
                status: true,
                warns: getActiveWarnsForId
            };
        }
    }

    /**
     * Find active warn record by id
     * @param id Id of warn record
     * @returns Status of exist record and record if status = true
     */
    public async getWarnById(id: number) {
        const getWarnById = await databaseController.getRequest("SELECT * FROM `warns` WHERE id = ? AND status = 0", [id]) as Warn[];

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

    /**
     * Find active warn record by target info
     * @param target Target of warn record
     * @param guildId Guild of warn record
     * @returns Status of exist record and record if status = true
     */
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

    /**
     * Change warn options in record by id
     * @param id Id of warn record
     * @param options Updated options
     * @returns Status of change options
     */
    public async updateWarns(id: number, options: UpdateWarn) {
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

    /**
     * Disable warn record by id
     * @param id Id of warn record
     * @returns Status of disable
     */
    public async removeWarn(id: number) {
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