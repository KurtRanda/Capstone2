const path = require("path");

module.exports = {
  development: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: path.join(__dirname, "migrations"),  // Absolute path
    },
    seeds: {
      directory: path.join(__dirname, "seeds"),
    },
  },
  test: {
    client: "pg",
    connection: {
      connectionString: process.env.TEST_DATABASE_URL || "postgresql://kurt:als21311@localhost/mealmatch_test",
      ssl: process.env.TEST_DATABASE_URL ? { rejectUnauthorized: false } : false,
    },
    migrations: {
      // Corrected to use the correct path for test migrations
      directory: path.resolve(__dirname, "migrations"),  // Absolute path
    },
    seeds: {
      // Corrected to use the correct path for test seeds
      directory: path.resolve(__dirname, "seeds"),
    },
  },
  production: {
    client: "pg",
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }, 
    },
    migrations: {
      directory: path.join(__dirname, "migrations"),  // Absolute path
    },
    seeds: {
      directory: path.join(__dirname, "seeds"),
    },
  },
};
