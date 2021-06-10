const { Pool } = require('pg');

class servicioPG {
	constructor() {
		this.pool = new Pool({
			user: process.env.USER_NAME_DB,
			host:  process.env.HOST_DB,
			database: process.env.DATABASE_NAME_DB,
			password: process.env.USER_PASSWORD_DB,
			port: process.env.DATABASE_PORT,
		});
	}

	async executeQuery(sql, data) {
		let res = this.pool.query(sql, data);
		return res;
	}
}

module.exports = servicioPG;