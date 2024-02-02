import { Pool, createPool, ResultSetHeader, RowDataPacket } from "mysql2/promise";

class Mysql {
    private pool: Pool;

    constructor(options: { host: string, port: number, user: string, password: string, database: string }) {
        this.pool = createPool(options);
        this.checks();
    }

    public async getRequest(sql: string, data: (string | number | boolean)[]) {
        try {
            const result = await this.pool.query(sql, data) as RowDataPacket[];
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    public async updateRequest(sql: string, data: (string | number | boolean | object)[]) {
        try {
            const result = await this.pool.query(sql, data) as ResultSetHeader[];
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    private async checks() {
        const checkAuthCookies = await this.getRequest("SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'discord-bot' AND TABLE_NAME = 'auth_cookies'", []);
        const checkAuthTokens = await this.getRequest("SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'discord-bot' AND TABLE_NAME = 'auth_tokens'", []);
        const checkBans = await this.getRequest("SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'discord-bot' AND TABLE_NAME = 'bans'", []);
        const checkBlocks = await this.getRequest("SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'discord-bot' AND TABLE_NAME = 'blocks'", []);
        const checkGuilds = await this.getRequest("SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'discord-bot' AND TABLE_NAME = 'guilds'", []);
        const checkPermissions = await this.getRequest("SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'discord-bot' AND TABLE_NAME = 'permissions'", []);
        const checkReports = await this.getRequest("SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'discord-bot' AND TABLE_NAME = 'reports'", []);
        const checkReportChannels = await this.getRequest("SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'discord-bot' AND TABLE_NAME = 'report_channels'", []);
        const checkRestrictions = await this.getRequest("SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'discord-bot' AND TABLE_NAME = 'restrictions'", []);
        const checkWarns = await this.getRequest("SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'discord-bot' AND TABLE_NAME = 'warns'", []);

        if (!checkGuilds.length) {
            await this.updateRequest("CREATE TABLE `guilds` (`id` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_unicode_ci',`valid` INT(11) NOT NULL DEFAULT '0',`genderRole` INT(11) NOT NULL DEFAULT '0',`maleRole` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_unicode_ci',`femaleRole` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_unicode_ci',`audit` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_unicode_ci',`preds` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_unicode_ci',PRIMARY KEY (`id`) USING BTREE)", []);
        }
        if (!checkRestrictions.length) {
            await this.updateRequest("CREATE TABLE `restrictions` (`guildId` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_unicode_ci',`signalChannel` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_unicode_ci',`maxBans` INT(11) NULL DEFAULT NULL,`maxMutes` INT(11) NULL DEFAULT NULL,`maxWarns` INT(11) NULL DEFAULT NULL,`maxPreds` INT(11) NULL DEFAULT NULL,INDEX `FK_restrictions_guilds` (`guildId`) USING BTREE,CONSTRAINT `FK_restrictions_guilds` FOREIGN KEY (`guildId`) REFERENCES `guilds` (`id`) ON UPDATE CASCADE ON DELETE CASCADE)", []);
        }
        if (!checkPermissions.length) {
            await this.updateRequest("CREATE TABLE `permissions` (`id` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_unicode_ci',`guildId` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_unicode_ci',PRIMARY KEY (`id`) USING BTREE,INDEX `FK__guilds` (`guildId`) USING BTREE,CONSTRAINT `FK__guilds` FOREIGN KEY (`guildId`) REFERENCES `guilds` (`id`) ON UPDATE CASCADE ON DELETE CASCADE)", []);
        }
        if (!checkBlocks.length) {
            await this.updateRequest("CREATE TABLE `blocks` (`id` INT(11) NOT NULL AUTO_INCREMENT,`target` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_unicode_ci',`guildId` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_unicode_ci',`bans` INT(11) NULL DEFAULT NULL,`mutes` INT(11) NULL DEFAULT NULL,`warns` INT(11) NULL DEFAULT NULL,`preds` INT(11) NULL DEFAULT NULL,`status` INT(11) NOT NULL DEFAULT '0',`data` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_unicode_ci',PRIMARY KEY (`id`) USING BTREE)", []);
        }
        if (!checkBans.length) {
            await this.updateRequest("CREATE TABLE `bans` (`id` INT(11) NOT NULL AUTO_INCREMENT,`author` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_unicode_ci',`target` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_unicode_ci',`guildId` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_unicode_ci',`data` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_unicode_ci',`reasone` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_unicode_ci',`status` INT(11) NOT NULL DEFAULT '0',PRIMARY KEY (`id`) USING BTREE,INDEX `FK_bans_guilds` (`guildId`) USING BTREE,CONSTRAINT `FK_bans_guilds` FOREIGN KEY (`guildId`) REFERENCES `guilds` (`id`) ON UPDATE CASCADE ON DELETE CASCADE)", []);
        }
        if (!checkWarns.length) {
            await this.updateRequest("CREATE TABLE `warns` (`id` INT(11) NOT NULL AUTO_INCREMENT,`guildId` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_unicode_ci',`targetId` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_unicode_ci',`author` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_unicode_ci',`reasone` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_unicode_ci',`data` VARCHAR(50) NOT NULL DEFAULT '' COLLATE 'utf8mb4_unicode_ci',`status` INT(11) NOT NULL DEFAULT '0',PRIMARY KEY (`id`) USING BTREE,INDEX `FK_warns_guilds` (`guildId`) USING BTREE,CONSTRAINT `FK_warns_guilds` FOREIGN KEY (`guildId`) REFERENCES `guilds` (`id`) ON UPDATE CASCADE ON DELETE CASCADE)", []);
        }
        if (!checkReportChannels.length) {
            await this.updateRequest("CREATE TABLE `report_channels` (`id` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_unicode_ci',`guildId` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_unicode_ci',PRIMARY KEY (`id`) USING BTREE,INDEX `FK_report_channels_guilds` (`guildId`) USING BTREE,CONSTRAINT `FK_report_channels_guilds` FOREIGN KEY (`guildId`) REFERENCES `guilds` (`id`) ON UPDATE CASCADE ON DELETE CASCADE)", []);
        }
        if (!checkReports.length) {
            await this.updateRequest("CREATE TABLE `reports` (`id` INT(11) NOT NULL AUTO_INCREMENT,`author` VARCHAR(50) NOT NULL DEFAULT '0' COLLATE 'utf8mb4_unicode_ci',`description` VARCHAR(300) NOT NULL DEFAULT '0' COLLATE 'utf8mb4_unicode_ci',`channel` VARCHAR(50) NOT NULL DEFAULT '0' COLLATE 'utf8mb4_unicode_ci',`admin` VARCHAR(50) NULL DEFAULT '0' COLLATE 'utf8mb4_unicode_ci',`rate` INT(11) NULL DEFAULT NULL,`comment` VARCHAR(120) NULL DEFAULT '0' COLLATE 'utf8mb4_unicode_ci',PRIMARY KEY (`id`) USING BTREE)", []);
        }
        if (!checkAuthTokens.length) {
            await this.updateRequest("CREATE TABLE `auth_tokens` (`userId` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_unicode_ci',`access_token` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_unicode_ci',`refresh_token` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_unicode_ci',`token_type` VARCHAR(10) NOT NULL COLLATE 'utf8mb4_unicode_ci',`data` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_unicode_ci',PRIMARY KEY (`userId`) USING BTREE)", []);
        }
        if (!checkAuthCookies.length) {
            await this.updateRequest("CREATE TABLE `auth_cookies` (`cookie` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_unicode_ci',`cookie_key` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_unicode_ci',`userId` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_unicode_ci',`data` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_unicode_ci',PRIMARY KEY (`cookie`) USING BTREE,INDEX `FK_auth_cookie_auth_tokens` (`userId`) USING BTREE,CONSTRAINT `FK_auth_cookie_auth_tokens` FOREIGN KEY (`userId`) REFERENCES `auth_tokens` (`userId`) ON UPDATE CASCADE ON DELETE CASCADE)", []);
        }
    }
}

if (!process.env.MYSQL_HOST) {
    throw Error("Could not find MYSQL_HOST in your environment");
}
if (!process.env.MYSQL_PORT) {
    throw Error("Could not find MYSQL_PORT in your environment");
}
if (!process.env.MYSQL_USER) {
    throw Error("Could not find MYSQL_USER in your environment");
}
if (!process.env.MYSQL_PASSWORD) {
    throw Error("Could not find MYSQL_PASSWORD in your environment");
}
if (!process.env.MYSQL_DATABASE) {
    throw Error("Could not find MYSQL_DATABASE in your environment");
}
const databaseController = new Mysql({
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});
export default databaseController;