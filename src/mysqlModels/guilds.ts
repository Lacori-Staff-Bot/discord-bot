import databaseController from "./main.js";

interface Guild {
    id: string,
    valid: boolean,
    genderRole: boolean,
    maleRole: string | null,
    femaleRole: string | null,
    audit: string | null,
    preds: string | null
}

interface UpdateGuild {
    valid?: boolean,
    genderRole?: boolean,
    maleRole?: string | null,
    femaleRole?: string | null,
    audit?: string | null,
    preds?: string | null
}

class Guilds {
    private guilds: { [key: string]: Guild } = {};

    /**
     * Clear guilds cache
     */
    private checkGuilds(): void {
        if (Object.keys(this.guilds).length > 100) this.guilds = {};
    }

    /**
     * Create new guild record
     * @param id Guild id
     * @returns Status of creating record
     */
    public async addGuild(id: string) {
        const addGuild = await databaseController.updateRequest("INSERT INTO `guilds` (id) VALUES (?)", [id]);

        if (!addGuild.affectedRows) {
            return {
                status: false
            };
        } else {
            this.checkGuilds();
            this.guilds[id] = {
                id,
                valid: true,
                genderRole: false,
                maleRole: null,
                femaleRole: null,
                audit: null,
                preds: null
            };
            return {
                status: true
            };
        }
    }

    /**
     * Find guild record
     * @param id Guild id
     * @returns Status of exist record and record if status = true
     */
    public async getGuild(id: string) {
        if (this.guilds[id]) return {
            status: true,
            guild: this.guilds[id]
        };
        const getGuild = await databaseController.getRequest("SELECT * FROM `guilds` WHERE id = ?", [id]) as Guild[];

        if (!getGuild.length) {
            return {
                status: false
            };
        } else {
            this.checkGuilds();
            this.guilds[id] = {
                id,
                valid: getGuild[0].valid,
                genderRole: getGuild[0].genderRole,
                maleRole: getGuild[0].maleRole,
                femaleRole: getGuild[0].femaleRole,
                audit: getGuild[0].audit,
                preds: getGuild[0].preds
            };
            return {
                status: true,
                guild: getGuild[0]
            };
        }
    }

    /**
     * Update guild record by id
     * @param id Id of guild record
     * @param options Updated options
     * @returns Status of update record
     */
    public async updateGuild(id: string, options: UpdateGuild) {
        const updateGuild = await databaseController.updateRequest("UPDATE `guilds` SET ? WHERE id = ?", [options, id]);

        if (!updateGuild.affectedRows) {
            return {
                status: false
            };
        } else {
            if (this.guilds[id]) {
                if (options.valid) this.guilds[id].valid = options.valid;
                if (options.genderRole) this.guilds[id].genderRole = options.genderRole;
                if (options.maleRole) this.guilds[id].maleRole = options.maleRole;
                if (options.femaleRole) this.guilds[id].femaleRole = options.femaleRole;
                if (options.audit) this.guilds[id].audit = options.audit;
                if (options.preds) this.guilds[id].preds = options.preds;
            }
            return {
                status: true
            };
        }
    }

    /**
     * Disable guild record by id
     * @param id Id of guild record
     * @returns Status of disable record
     */
    public async removeGuild(id: string) {
        const update: UpdateGuild = {
            genderRole: false,
            maleRole: null,
            femaleRole: null,
            audit: null,
            preds: null
        };
        const removeGuild = await databaseController.updateRequest("UPDATE `guilds` SET ? WHERE id = ?", [update, id]);

        if (!removeGuild.affectedRows) {
            return {
                status: false
            };
        } else {
            if (this.guilds[id]) delete this.guilds[id];
            return {
                status: true
            };
        }
    }
}

const guildsModel = new Guilds();
export default guildsModel;