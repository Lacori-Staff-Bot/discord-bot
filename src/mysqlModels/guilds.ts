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
    async addGuild(id: string) {
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

    async getGuild(id: string) {
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

    async updateGuild(id: string, options: UpdateGuild) {
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
}

const guildsModel = new Guilds();
export default guildsModel;