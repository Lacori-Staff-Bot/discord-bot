import databaseController from "./main.js";

interface Guild {
    id: string
    valid: boolean
    genderRole: boolean
    maleRole: string | null
    femaleRole: string | null
    audit: string | null
    preds: string | null
}

interface UpdateGuild {
    valid?: boolean
    genderRole?: boolean
    maleRole?: string | null
    femaleRole?: string | null
    audit?: string | null
    preds?: string | null
}

class Guilds {

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
        const getGuild = await databaseController.getRequest("SELECT * FROM `guilds` WHERE id = ?", [id]) as Guild[];

        if (!getGuild.length) {
            return {
                status: false
            };
        } else {
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
            return {
                status: true
            };
        }
    }
}

const guildsModel = new Guilds();
export default guildsModel;