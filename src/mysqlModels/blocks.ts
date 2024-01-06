import databaseController from "./main.js";

interface Block {
    id: number,
    target: string,
    guildId: string,
    bans: number | null,
    mutes: number | null,
    warns: number | null,
    preds: number | null,
    status: number,
    data: number
}

interface UpdateBlock {
    target?: string,
    guildId?: string,
    bans?: number | null,
    mutes?: number | null,
    warns?: number | null,
    preds?: number | null,
    status?: number
    data?: number
}

class Blocks {
    async addBlock(target: string, guildId: string) {
        const data = Date.now() + 5 * 60 * 1000;
        const addBlock = await databaseController.updateRequest("INSERT INTO `blocks` (target, guildId, data) VALUES (?, ?, ?)", [target, guildId, data]);

        if (!addBlock.affectedRows) {
            return {
                status: false
            };
        } else {
            return {
                status: true,
                id: addBlock.insertId
            };
        }
    }

    async getBlockId(id: number) {
        const getBlockId = await databaseController.getRequest("SELECT * FROM `blocks` WHERE id = ?", [id]) as Block[];

        if (!getBlockId.length) {
            return {
                status: false
            };
        } else {
            return {
                status: true,
                block: getBlockId[0]
            };
        }
    }

    async getTreckBlock(target: string, guildId: string) {
        const getTreckBlock = await databaseController.getRequest("SELECT * FROM `blocks` WHERE target = ? AND guildId = ? AND status = 0", [target, guildId]) as Block[];

        if (!getTreckBlock.length) {
            return {
                status: false
            };
        } else {
            return {
                status: true,
                block: getTreckBlock[0]
            };
        }
    }

    async getTreckBlocks() {
        const getTreckBlocks = await databaseController.getRequest("SELECT * FROM `blocks` WHERE status = 0", []) as Block[];

        if (!getTreckBlocks.length) {
            return {
                status: false
            };
        } else {
            return {
                status: true,
                blocks: getTreckBlocks
            };
        }
    }

    async getBlockedTarget(target: string, guildId: string) {
        const getBlockedTarget = await databaseController.getRequest("SELECT * FROM `blocks` WHERE target = ? AND guildId = ? AND status = 1", [target, guildId]) as Block[];

        if (!getBlockedTarget.length) {
            return {
                status: false
            };
        } else {
            return {
                status: true,
                block: getBlockedTarget[0]
            };
        }
    }

    async updateBlock(id: number, options: UpdateBlock) {
        const updateBlock = await databaseController.updateRequest("UPDATE `blocks` SET ? WHERE id = ?", [options, id]);

        if (!updateBlock.affectedRows) {
            return {
                status: false
            };
        } else {
            return {
                status: true
            };
        }
    }

    async removeBlock(id: number) {
        const removeBlock = await databaseController.updateRequest("UPDATE `blocks` SET status = 2 WHERE id = ?", [id]);

        if (!removeBlock.affectedRows) {
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

const blocksModel = new Blocks();
export default blocksModel;