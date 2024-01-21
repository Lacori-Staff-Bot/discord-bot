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
    private warns: { [key: number]: Warn } = {};

    /**
     * Clear warns cahce
     */
    private checkWarns(): void {
        if (Object.keys(this.warns).length > 100) this.warns = {};
    }

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
            this.checkWarns();
            this.warns[addWarn.insertId] = {
                id: addWarn.insertId,
                guildId,
                targetId,
                author,
                data,
                reasone,
                status: 0
            };
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
     * Find active warn record by id
     * @param id Id of warn record
     * @returns Status of exist record and record if status = true
     */
    public async getWarnById(id: number) {
        if (this.warns[id]) return {
            status: true,
            warn: this.warns[id]
        };
        const getWarnById = await databaseController.getRequest("SELECT * FROM `warns` WHERE id = ?", [id]) as Warn[];

        if (!getWarnById.length) {
            return {
                status: false
            };
        } else {
            this.checkWarns();
            this.warns[id] = {
                id,
                guildId: getWarnById[0].guildId,
                targetId: getWarnById[0].targetId,
                author: getWarnById[0].author,
                data: getWarnById[0].data,
                reasone: getWarnById[0].reasone,
                status: getWarnById[0].status
            };
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
            this.checkWarns();
            this.warns[getTargetWarns[0].id] = {
                id: getTargetWarns[0].id,
                guildId: getTargetWarns[0].guildId,
                targetId: getTargetWarns[0].targetId,
                author: getTargetWarns[0].author,
                data: getTargetWarns[0].data,
                reasone: getTargetWarns[0].reasone,
                status: getTargetWarns[0].status
            };
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
            if (this.warns[id]) {
                if (options.guildId) this.warns[id].guildId = options.guildId;
                if (options.targetId) this.warns[id].targetId = options.targetId;
                if (options.author) this.warns[id].author = options.author;
                if (options.reasone) this.warns[id].reasone = options.reasone;
                if (options.data) this.warns[id].data = options.data;
                if (options.status) this.warns[id].status = options.status;
            }
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
            if (this.warns[id]) delete this.warns[id];
            return {
                status: true
            };
        }
    }
}

const warnsModel = new Warns();
export default warnsModel;