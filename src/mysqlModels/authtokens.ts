import databaseController from "./main.js";

interface AuthToken {
    userId: string
    access_token: string
    refresh_token: string
    token_type: string
    data: number
}

interface UpdateAuthToke {
    access_token?: string
    refresh_token?: string
    token_type?: string
    data?: number
}

class AuthTokens {
    async addAuthToken(userId: string, access_token: string, refresh_token: string, token_type: string, data: number) {
        const addAuthToken = await databaseController.updateRequest("INSERT INTO `auth_tokens` (userId, access_token, refresh_token, token_type, data) VALUES (?, ?, ?, ?, ?)", [userId, access_token, refresh_token, token_type, data]);

        if (!addAuthToken.affectedRows) {
            return {
                status: false
            };
        } else {
            return {
                status: true
            };
        }
    }

    async getOldTokens(data: number) {
        const getOldTokens = await databaseController.getRequest("SELECT * FROM `auth_tokens` WHERE data - ? < 1000000", [data]) as AuthToken[];

        if (!getOldTokens.length) {
            return {
                status: false
            };
        } else {
            return {
                status: true,
                tokens: getOldTokens
            };
        }
    }

    async getTokenByUser(userId: string) {
        const getTokenByUser = await databaseController.getRequest("SELECT * FROM `auth_tokens` WHERE userId = ?", [userId]) as AuthToken[];

        if (!getTokenByUser.length) {
            return {
                status: false
            };
        } else {
            return {
                status: true,
                authToken: getTokenByUser[0]
            };
        }
    }

    async updateToken(userId: string, options: UpdateAuthToke) {
        const updateToken = await databaseController.updateRequest("UPDATE `auth_tokens` SET ? WHERE userId = ?", [options, userId]);

        if (!updateToken.affectedRows) {
            return {
                status: false
            };
        } else {
            return {
                status: true
            };
        }
    }

    async removeToken(userId: string) {
        const removeToken = await databaseController.updateRequest("DELETE FROM `auth_tokens` WHERE userId = ?", [userId]);

        if (!removeToken.affectedRows) {
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

const authTokensModel = new AuthTokens();
export default authTokensModel;