import databaseController from "./main.js";

interface Permission {
    id: string
    guildId: string
}

class Permissions {
    async addPermission(id: string, guildId: string) {
        const addPermission = await databaseController.updateRequest("INSERT INTO `permissions` (id, guildId) VALUES (?, ?)", [id, guildId]);

        if (!addPermission.affectedRows) {
            return {
                status: false
            };
        } else {
            return {
                status: true
            };
        }
    }

    async getPermission(id: string, guildId: string) {
        const getPermission = await databaseController.getRequest("SELECT * FROM `permissions` WHERE id = ? AND guildId = ?", [id, guildId]) as Permission[];

        if (!getPermission.length) {
            return {
                status: false
            };
        } else {
            return {
                status: true,
                permission: getPermission[0]
            };
        }
    }

    async getPermissions(guildId: string) {
        const getPermission = await databaseController.getRequest("SELECT * FROM `permissions` WHERE guildId = ?", [guildId]) as Permission[];

        if (!getPermission.length) {
            return {
                status: false
            };
        } else {
            return {
                status: true,
                getPermission
            };
        }
    }

    async removePermission(id: string, guildId: string) {
        const removePermission = await databaseController.updateRequest("DELETE FROM `permissions` WHERE id = ? AND guildId = ?", [id, guildId]);

        if (!removePermission.affectedRows) {
            return {
                status: false
            };
        } else {
            return {
                status: true
            };
        }
    }

    async clearPermission(guildId: string) {
        const clearPermission = await databaseController.updateRequest("DELETE FROM `permissions` WHERE guildId = ?", [guildId]);

        if (!clearPermission.affectedRows) {
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

const permissionsModel = new Permissions();
export default permissionsModel;