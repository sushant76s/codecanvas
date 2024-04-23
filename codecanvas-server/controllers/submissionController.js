const db = require("../config/database");
const dotenv = require('dotenv');
dotenv.config();

const dbClient = process.env.DATABASE_CLIENT || "sqlite3";

exports.getData = async (req, res) => {
    if (dbClient === "mysql" || dbClient === "postgresql") {
        db.query("SELECT * FROM submissions", (error, result) => {
            if (error) {
                console.error(error);
                return res
                    .status(500)
                    .json({ error: "An error occurred while fetching data" });
            }
            if (dbClient === 'postgresql') {
                res.json(result.rows);
            } else {
                res.json(result);
            }
        });
    } else {
        db.all("SELECT * FROM submissions", (error, rows) => {
            if (error) {
                console.error(error);
                return res
                    .status(500)
                    .json({ error: "An error occurred while fetching data" });
            }
            res.json(rows);
        });
    }
};

exports.postData = async (req, res) => {
    const formData = req.body;
    if (dbClient === "mysql") {
        db.query("INSERT INTO submissions SET ?", formData, (error) => {
            if (error) {
                console.error(error);
                return res
                    .status(500)
                    .json({ error: "An error occurred while adding data" });
            }
            res.send("Data added successfully!");
        });
    } else if (dbClient === "postgresql") {
        db.query(
            'INSERT INTO submissions ("username", "code_language", "stdIn", "stdOut", "code") VALUES ($1, $2, $3, $4, $5)',
            [
                formData.username,
                formData.code_language,
                formData.stdIn,
                formData.stdOut,
                formData.code,
            ],
            (err) => {
                if (err) {
                    console.error("Error inserting data into PostgreSQL:", err);
                    return res
                        .status(500)
                        .json({ error: "An error occurred while adding data" });
                }
                res.send("Data added successfully!");
            }
        );
    } else {
        db.run(
            "INSERT INTO submissions (username, code_language, stdIn, stdOut, code) VALUES (?, ?, ?, ?, ?)",
            [
                formData.username,
                formData.code_language,
                formData.stdIn,
                formData.stdOut,
                formData.code,
            ],
            (error) => {
                if (error) {
                    console.error(error);
                    return res
                        .status(500)
                        .json({ error: "An error occurred while adding data" });
                }
                res.send("Data added successfully!");
            }
        );
    }
};