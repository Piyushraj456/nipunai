// drizzle.config.js
require("dotenv").config();

/** @type {import('drizzle-kit').Config} */
module.exports = {
  schema: "./utils/schema.js",
  dialect: "postgresql",
  url: process.env.DATABASE_URL,
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  },
};
