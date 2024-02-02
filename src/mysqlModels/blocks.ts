import databaseController from "./main.js";

interface Block {
    id: number
    target: string
    guildId: string
    bans: number | null
    mutes: number | null
    warns: number | null
    preds: number | null
    status: number
    data: number
}

interface UpdateBlock {
    target?: string
    guildId?: string
    bans?: number | null
    mutes?: number | null
    warns?: number | null
    preds?: number | null
    status?: number
    data?: number
}

class Blocks {
    /**
     * Create new block record
     * @param target Target taked block
     * @param guildId Guild were gived block
     * @returns Status of creating record
     */
    public async addBlock(target: string, guildId: string) {
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

    /**
     * Find block record by id
     * @param id Id of block record
     * @returns Status of exist record and record if status = true
     */
    public async getBlockId(id: number) {
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

    /**
     * Find active block records by guildId
     * @param guildId Guild of block record
     * @returns Status of exist records and records if status = true
     */
    public async getActiveBlocksForGuild(guildId: string) {
        const getActiveBlocksForGuild = await databaseController.getRequest("SELECT * FROM `blocks` WHERE guildId = ? AND status = 1", [guildId]) as Block[];

        if (!getActiveBlocksForGuild.length) {
            return {
                status: false
            };
        } else {
            return {
                status: true,
                blocks: getActiveBlocksForGuild
            };
        }
    }

    /**
     * Find active block record by target info
     * @param target Target of block record
     * @param guildId Guild of block record
     * @returns Status of exist record and record if status = true
     */
    public async getTreckBlock(target: string, guildId: string) {
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

    /**
     * Find active blocks records
     * @returns Status of exist records and records if status = true
     */
    public async getTreckBlocks() {
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

    /**
     * Find worked block record by target info
     * @param target Target of block record
     * @param guildId Guild of block record
     * @returns Status of exist record and record if status = true
     */
    public async getBlockedTarget(target: string, guildId: string) {
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

    /**
     * Update block record by id
     * @param id Id of block record
     * @param options Updated options
     * @returns Status of update record
     */
    public async updateBlock(id: number, options: UpdateBlock) {
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

    /**
     * Disable block record by id
     * @param id Id of block record
     * @returns Status of disable record
     */
    public async removeBlock(id: number) {
        const update: UpdateBlock = {
            status: 2
        };
        const removeBlock = await databaseController.updateRequest("UPDATE `blocks` SET ? WHERE id = ?", [update, id]);

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