const { Pool } = require('pg');

class servicioPG {
	constructor() {
		this.pool = new Pool({
			user: 'postgres',
			host: 'localhost',
			database: 'crud_cd',
			password: 'admin',
			port: 5432,
		});
	}

	async executeQuery(sql, data) {
		let res = this.pool.query(sql, data);
		return res;
	}
}

module.exports = servicioPG;