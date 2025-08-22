const BaseRepository = require("../shared/repositories/BaseRepository");
const { Connection, ConnectionReport } = require("../shared/db/models/index");

class ConnectionRepository {
    constructor() {
    
    }

    async findByUsername(username, type = null) {
        const whereClause = { username, is_active: true };
        if (type) {
            whereClause.type = type;
        }

        return await Connection.findAll({
            where: whereClause,
            attributes: { exclude: ['access_token', 'refresh_token'] }
        });
    }

    async findByType(type) {
        return await Connection.findAll({
            where: { type, is_active: true },
            attributes: { exclude: ['access_token', 'refresh_token'] }
        });
    }

    async findActiveConnections() {
        return await Connection.findAll({
            where: { is_active: true },
            attributes: { exclude: ['access_token', 'refresh_token'] }
        });
    }

    async updateTokens(connectionId, accessToken, refreshToken, tokenExpiresAt) {
        return await Connection.update(
            {
                access_token: accessToken,
                refresh_token: refreshToken,
                token_expires_at: tokenExpiresAt,
                last_login: new Date()
            },
            {
                where: { id: connectionId }
            }
        );
    }

    async deactivateConnection(connectionId) {
        return await Connection.update(
            { is_active: false },
            { where: { id: connectionId } }
        );
    }

    async createSalesforceReport(connectionId, reportData) {
        console.log("reportData", reportData);
          return  await ConnectionReport.create({
                connection_id: connectionId,
                report_id: reportData.report_id,
                report_name: reportData.report_name
            });
        
       
    }
}

module.exports = ConnectionRepository;
