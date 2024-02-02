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
    /**
     * Create new report record
     * @param author Author's userId of report
     * @param description report description
     * @param channel channel from sended report
     * @returns Status of creating record
     */
    public async addReport(author: string, description: string, channel: string) {
        const addReport = await databaseController.updateRequest("INSERT INTO `reports` (author, description, channel) VALUES (?, ?, ?)", [author, description, channel]);

        if (!addReport.affectedRows) {
            return {
                status: false
            };
        } else {
            return {
                status: true,
                id: addReport.insertId
            };
        }
    }

    /**
     * Find report record by id
     * @param id Id of report record
     * @returns Status of exist record and record if status = true
     */
    public async getReport(id: number) {
        const getReport = await databaseController.getRequest("SELECT * FROM `reports` WHERE id = ?", [id]) as Report[];

        if (!getReport.length) {
            return {
                status: false
            };
        } else {
            return {
                status: true,
                report: getReport[0]
            };
        }
    }

    /**
     * Change report options in record by id
     * @param id Id of report record
     * @param options Updated options
     * @returns Status of change options
     */
    public async updateReport(id: number, options: UpdateReport) {
        const updateReport = await databaseController.updateRequest("UPDATE `reports` SET ? WHERE id = ?", [options, id]);

        if (!updateReport.affectedRows) {
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

const reportsModel = new Reports();
export default reportsModel;