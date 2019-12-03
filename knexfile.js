const common = {
	client: 'postgresql',
	user: 'postgres',
	password: '9K!m!mar0S', 
	migrations: {
		directory: './src/main/migrations'
	},
	pool: {
		min: 2,
		max: 10
	}
}

module.exports = {
  development: Object.assign({
    connection: {
      database: 'abet_system_dev',
      user: 'postgres',
      password: '9K!m!mar0S',
    },
    seeds: {
      directory: './src/dev/seeds'
    }
	}, common),

  test: Object.assign({
    connection: {
      database: 'abet_system_test',
      user: 'postgres',
      password: '9K!m!mar0S',
    },
    seeds: {
      directory: './src/test/seeds'
    }
  }, common),

  production: Object.assign({
    connection: {
      database: 'abet_system'
    }
  }, common)
};
