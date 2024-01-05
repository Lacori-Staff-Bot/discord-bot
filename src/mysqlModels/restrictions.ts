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
    async addRestriction(guildId: string) {
        const addRestriction = await databaseController.updateRequest("INSERT INTO `restrictions` (guildId) VALUES (?)", [guildId]);

        if (!addRestriction.affectedRows) {
            return {
                status: false
            };
        } else {
            return {
                status: true
            };
        }
    }

    async getRestriction(guildId: string) {
        const getRestriction = await databaseController.getRequest("SELECT * FROM `restrictions` WHERE guildId = ?", [guildId]) as Restriction[];

        if (!getRestriction.length) {
            return {
                status: false
            };
        } else {
            return {
                status: true,
                restriction: getRestriction[0]
            };
        }
    }

    async updateRestriction(guildId: string, options: UpdateRestriction) {
        const updateRestriction = await databaseController.updateRequest("UPDATE `restrictions` SET ? WHERE guildId = ?", [options, guildId]);

        if (!updateRestriction.affectedRows) {
            return {
                status: false
            };
        } else {
            return {
                status: true
            };
        }
    }

    async removeRestriction(guildId: string) {
        const removeRestriction = await databaseController.updateRequest("DELETE FROM `restrictions` WHERE guildId = ?", [guildId]);

        if (!removeRestriction.affectedRows) {
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

const restrictionsModel = new Restrictions();
export default restrictionsModel;