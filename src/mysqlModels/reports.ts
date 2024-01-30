import databaseController from "./main.js";

interface Report {
    id: number
    author: string
    description: string
    channel: string
    admin: string | null
    rate: number | null
    comment: string | null
}

interface UpdateReport {
    admin?: string
    rate?: number
    comment?: string
}

class Reports {
    private reports: { [key: string]: Report } = {};

    /**
     * Clear reports cache
     */
    private checkReports(): void {
        if (Object.keys(this.reports).length > 50) this.reports = {};
    }

    public async addReport(author: string, description: string, channel: string) {
        const addReport = await databaseController.updateRequest("INSERT INTO `reports` (author, description, channel) VALUES (?, ?, ?)", [author, description, channel]);

        if (!addReport.affectedRows) {
            return {
                status: false
            };
        } else {
            this.checkReports();
            this.reports[addReport.insertId] = {
                id: addReport.insertId,
                author,
                description,
                channel,
                admin: null,
                rate: null,
                comment: null
            };
            return {
                status: true,
                id: addReport.insertId
            };
        }
    }

    public async getReport(id: number) {
        const getReport = await databaseController.getRequest("SELECT * FROM `reports` WHERE id = ?", [id]) as Report[];

        if (!getReport.length) {
            return {
                status: false
            };
        } else {
            this.checkReports();
            this.reports[id] = {
                id,
                author: getReport[0].author,
                description: getReport[0].description,
                channel: getReport[0].channel,
                admin: getReport[0].admin,
                rate: getReport[0].rate,
                comment: getReport[0].comment
            };
            return {
                status: true,
                report: getReport[0]
            };
        }
    }

    public async updateReport(id: number, options: UpdateReport) {
        const updateReport = await databaseController.updateRequest("UPDATE `reports` SET ? WHERE id = ?", [options, id]);

        if (!updateReport.affectedRows) {
            return {
                status: false
            };
        } else {
            if (this.reports[id]) {
                if (options.admin) this.reports[id].admin = options.admin;
                if (options.rate) this.reports[id].rate = options.rate;
                if (options.comment) this.reports[id].comment = options.comment;
            }
            return {
                status: true
            };
        }
    }
}

const reportsModel = new Reports();
export default reportsModel;