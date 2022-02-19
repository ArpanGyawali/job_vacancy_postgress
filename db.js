const { Pool } = require('pg');

const pool = new Pool({
	user: 'postgres',
	password: 'PBAAJ@4ever',
	host: 'localhost',
	port: 5432,
	database: 'job_vacancy',
});

module.exports = pool;
