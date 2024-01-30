import databaseController from "./main.js";

interface Channel {
    id: string
    guildId: string
}

class ReportChannels {
    async addChannel(id: string, guildId: string) {
        const addChannel = await databaseController.updateRequest("INSERT INTO `report_channels` (id, guildId) VALUES (?, ?)", [id, guildId]);

        if (!addChannel.affectedRows) {
            return {
                status: false
            };
        } else {
            return {
                status: true
            };
        }
    }

    async getChannel(id: string) {
        const getChannel = await databaseController.getRequest("SELECT * FROM `report_channels` WHERE id = ?", [id]) as Channel[];

        if (!getChannel.length) {
            return {
                status: false
            };
        } else {
            return {
                status: true,
                channel: getChannel[0]
            };
        }
    }

    async removeChannel(id: string) {
        const removeChannel = await databaseController.updateRequest("DELETE FROM `report_channels` WHERE id = ?", [id]);

        if (!removeChannel.affectedRows) {
            return {
                status: false
            };
        } else {
            return {
                status: true
            };
        }
    }

    async clearChannels(guildId: string) {
        const clearChannels = await databaseController.updateRequest("DELETE * FROM `report_channels` WHERE guildId = ?", [guildId]);

        if (!clearChannels.affectedRows) {
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

const reportChannelsModel = new ReportChannels();
export default reportChannelsModel;