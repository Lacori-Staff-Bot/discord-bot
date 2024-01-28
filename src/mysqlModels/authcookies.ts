import databaseController from "./main.js"

interface AuthCookie {
    cookie: string,
    cookie_key: string,
    userId: string,
    data: number
}

interface UpdateCookie {
    data: number
}

class AuthCookies {
    async addCookie(cookie: string, cookie_key: string, userId: string, data: number) {
        const addCookie = await databaseController.updateRequest("INSERT INTO `auth_cookies` (cookie, cookie_key, userId, data) VALUES (?, ?, ?, ?)", [cookie, cookie_key, userId, data]);

        if (!addCookie.affectedRows) {
            return {
                status: false
            };
        } else {
            return {
                status: true
            };
        }
    }

    async getCookies() {
        const getCookies = await databaseController.getRequest("SELECT * FROM `auth_cookies`", []) as AuthCookie[];

        if (!getCookies.length) {
            return {
                status: false
            };
        } else {
            return {
                status: true,
                cookies: getCookies
            };
        }
    }

    async getCookieByUser(userId: string) {
        const getCookieByUser = await databaseController.getRequest("SELECT * FROM `auth_cookies` WHERE userId = ?", [userId]) as AuthCookie[];

        if (!getCookieByUser.length) {
            return {
                status: false
            };
        } else {
            return {
                status: true,
                cookie: getCookieByUser[0]
            };
        }
    }

    async verifyCookie(cookie: string, key: string) {
        const verifyCookie = await databaseController.getRequest("SELECT * FROM `auth_cookies` WHERE cookie = ? AND cookie_key = ?", [cookie, key]) as AuthCookie[];

        if (!verifyCookie.length) {
            return {
                status: false
            };
        } else {
            return {
                status: true,
                cookie: verifyCookie[0]
            };
        }
    }

    async updateCookie(cookie: string, options: UpdateCookie) {
        const updateCookie = await databaseController.updateRequest("UPDATE `auth_cookies` SET ? WHERE cookie = ?", [options, cookie]);

        if (!updateCookie.affectedRows) {
            return {
                status: false
            };
        } else {
            return {
                status: true
            };
        }
    }

    async removeCookie(cookie: string) {
        const removeCookie = await databaseController.updateRequest("DELETE FROM `auth_cookies` WHERE cookie = ?", [cookie]);

        if (!removeCookie.affectedRows) {
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

const authCookiesModel = new AuthCookies();
export default authCookiesModel;