const dotenv = require("dotenv");
const mysql = require("mysql");
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const { Client } = require("pg");

dotenv.config();

let db;

const dbClient = process.env.DATABASE_CLIENT || "sqlite3";

if (dbClient === "mysql") {
  db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  });

  db.connect((error) => {
    if (error) {
      console.error("Error connecting to MySQL: ", error.stack);
      return;
    }
    console.log("Connected to MySQL as ID: " + db.threadId);

    // Check if table exists, if not, create it
    db.query(
      `CREATE TABLE IF NOT EXISTS submissions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255),
            code_language VARCHAR(255),
            stdIn TEXT,
            stdOut TEXT,
            code TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
      (e, result) => {
        if (e) throw e;
        console.log("Table created or already exists");
      }
    );
  });
} else if (dbClient === "postgresql") {
  db = new Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
  });

  db.connect((error) => {
    if (error) {
      console.error("Error connecting to PostgreSQL: ", error.stack);
      return;
    }
    console.log("Connected to PostgreSQL");

    // Check if table exists, if not, create it
    db.query(
      `CREATE TABLE IF NOT EXISTS submissions (
                "id" SERIAL PRIMARY KEY,
                "username" VARCHAR(255),
                "code_language" VARCHAR(255),
                "stdIn" TEXT,
                "stdOut" TEXT,
                "code" TEXT,
                "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,
      (error) => {
        if (error) {
          console.error("Error creating PostgreSQL table:", error);
          return;
        }
        console.log("PostgreSQL table created or already exists");
      }
    );
  });
} else {
  // Check if dir exists or not
  const dbFilePath = "./data/db.sqlite";
  const dbDir = "./data";
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir);
  }

  // If database client is not defined then sqlite3 will be used as the database
  db = new sqlite3.Database(dbFilePath, (error) => {
    if (error) {
      console.error("Error connecting to SQLite database: ", error);
      return;
    }
    console.log("Connected to SQLite database");
  });

  // Create table if not exists
  db.run(
    `CREATE TABLE IF NOT EXISTS submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        code_language TEXT,
        stdIn TEXT,
        stdOut TEXT,
        code TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
    (err) => {
      if (err) {
        console.error("Error creating SQLite table:", err);
        return;
      }
      console.log("SQLite table created or already exists");
    }
  );
}

module.exports = db;
