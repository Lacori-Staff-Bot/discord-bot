import databaseController from "./main.js";

interface Restriction {
    guildId: string,
    signalChannel: string | null,
    maxBans: number | null,
    maxMutes: number | null,
    maxWarns: number | null,
    maxPreds: number | null
}

interface UpdateRestriction {
    signalChannel?: string | null,
    maxBans?: number | null,
    maxMutes?: number | null,
    maxWarns?: number | null,
    maxPreds?: number | null
}

class Restrictions {
    private restrictions: { [key: string]: Restriction } = {};

    /**
     * Clear restrictions cache
     */
    private checkRestrictions(): void {
        if (Object.keys(this.restrictions).length > 100) this.restrictions = {};
    }

    /**
     * Create new restriction record
     * @param guildId Guild of restriction
     * @returns Status of creating record
     */
    public async addRestriction(guildId: string) {
        const addRestriction = await databaseController.updateRequest("INSERT INTO `restrictions` (guildId) VALUES (?)", [guildId]);

        if (!addRestriction.affectedRows) {
            return {
                status: false
            };
        } else {
            this.checkRestrictions();
            this.restrictions[guildId] = {
                guildId,
                signalChannel: null,
                maxBans: null,
                maxMutes: null,
                maxWarns: null,
                maxPreds: null
            };
            return {
                status: true
            };
        }
    }

    /**
     * Find restriction record by id
     * @param id Id of restriction record
     * @returns Status of exist record and record if status = true
     */
    public async getRestriction(guildId: string) {
        const getRestriction = await databaseController.getRequest("SELECT * FROM `restrictions` WHERE guildId = ?", [guildId]) as Restriction[];

        if (!getRestriction.length) {
            return {
                status: false
            };
        } else {
            this.checkRestrictions();
            this.restrictions[guildId] = {
                guildId,
                signalChannel: getRestriction[0].signalChannel,
                maxBans: getRestriction[0].maxBans,
                maxMutes: getRestriction[0].maxMutes,
                maxWarns: getRestriction[0].maxWarns,
                maxPreds: getRestriction[0].maxPreds
            };
            return {
                status: true,
                restriction: getRestriction[0]
            };
        }
    }

    /**
     * Change restriction options in record by id
     * @param id Id of restriction record
     * @param options Updated options
     * @returns Status of change options
     */
    public async updateRestriction(guildId: string, options: UpdateRestriction) {
        const updateRestriction = await databaseController.updateRequest("UPDATE `restrictions` SET ? WHERE guildId = ?", [options, guildId]);

        if (!updateRestriction.affectedRows) {
            return {
                status: false
            };
        } else {
            if (this.restrictions[guildId]) {
                if (options.signalChannel) this.restrictions[guildId].signalChannel = options.signalChannel;
                if (options.maxBans) this.restrictions[guildId].maxBans = options.maxBans;
                if (options.maxMutes) this.restrictions[guildId].maxMutes = options.maxMutes;
                if (options.maxWarns) this.restrictions[guildId].maxWarns = options.maxWarns;
                if (options.maxPreds) this.restrictions[guildId].maxPreds = options.maxPreds;
            }
            return {
                status: true
            };
        }
    }

    /**
     * Disable restriction record by id
     * @param id Id of restriction record
     * @returns Status of disable
     */
    public async removeRestriction(guildId: string) {
        const update: UpdateRestriction = {
            signalChannel: null,
            maxBans: null,
            maxMutes: null,
            maxWarns: null,
            maxPreds: null
        };
        const removeRestriction = await databaseController.updateRequest("UPDATE `restrictions` SET ? WHERE guildId = ?", [update, guildId]);

        if (!removeRestriction.affectedRows) {
            return {
                status: false
            };
        } else {
            if (this.restrictions[guildId]) delete this.restrictions[guildId];
            return {
                status: true
            };
        }
    }
}

const restrictionsModel = new Restrictions();
export default restrictionsModel;