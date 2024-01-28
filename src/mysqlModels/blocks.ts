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
    private blocks: { [key: number]: Block } = {};

    /**
     * Clear blocks cache
     */
    private checkBlocks(): void {
        if (Object.keys(this.blocks).length > 100) this.blocks = {};
    }

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
            this.checkBlocks();
            this.blocks[addBlock.insertId] = {
                id: addBlock.insertId,
                target,
                guildId,
                bans: 0,
                mutes: 0,
                warns: 0,
                preds: 0,
                status: 0,
                data
            };
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
        if (this.blocks[id]) return {
            status: true,
            block: this.blocks[id]
        };
        const getBlockId = await databaseController.getRequest("SELECT * FROM `blocks` WHERE id = ?", [id]) as Block[];

        if (!getBlockId.length) {
            return {
                status: false
            };
        } else {
            this.checkBlocks();
            this.blocks[id] = {
                id,
                guildId: getBlockId[0].guildId,
                target: getBlockId[0].target,
                bans: getBlockId[0].bans,
                mutes: getBlockId[0].mutes,
                warns: getBlockId[0].warns,
                preds: getBlockId[0].preds,
                status: getBlockId[0].status,
                data: getBlockId[0].data
            };
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
            this.checkBlocks();
            this.blocks[getTreckBlock[0].id] = {
                id: getTreckBlock[0].id,
                guildId: getTreckBlock[0].guildId,
                target: getTreckBlock[0].target,
                bans: getTreckBlock[0].bans,
                mutes: getTreckBlock[0].mutes,
                warns: getTreckBlock[0].warns,
                preds: getTreckBlock[0].preds,
                status: getTreckBlock[0].status,
                data: getTreckBlock[0].data
            };
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
            this.checkBlocks();
            this.blocks[getBlockedTarget[0].id] = {
                id: getBlockedTarget[0].id,
                guildId: getBlockedTarget[0].guildId,
                target: getBlockedTarget[0].target,
                bans: getBlockedTarget[0].bans,
                mutes: getBlockedTarget[0].mutes,
                warns: getBlockedTarget[0].warns,
                preds: getBlockedTarget[0].preds,
                status: getBlockedTarget[0].status,
                data: getBlockedTarget[0].data
            };
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
            if (this.blocks[id]) {
                if (options.bans) this.blocks[id].bans = options.bans;
                if (options.mutes) this.blocks[id].mutes = options.mutes;
                if (options.warns) this.blocks[id].warns = options.warns;
                if (options.preds) this.blocks[id].preds = options.preds;
            }
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
            if (this.blocks[id]) delete this.blocks[id];
            return {
                status: true
            };
        }
    }
}

const blocksModel = new Blocks();
export default blocksModel;