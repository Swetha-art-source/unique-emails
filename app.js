const express = require("express");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");

const app = express();
const dbPath = path.join(__dirname, "database.db");

app.use(express.json());

let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({ filename: dbPath, driver: sqlite3.Database });
    await database.exec(`
      CREATE TABLE IF NOT EXISTS customers (
        customerId INTEGER PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE
      )`);

    const customers = [
      {
        email: "anurag11@yopmail.com",
        name: "anurag",
      },
      {
        email: "sameer11@yopmail.com",
        name: "sameer",
      },
      {
        email: "ravi11@yopmail.com",
        name: "ravi",
      },
      {
        email: "akash11@yopmail.com",
        name: "akash",
      },
      {
        email: "anjali11@yopmail.com",
        name: "anjai",
      },
      {
        email: "santosh11@yopmail.com",
        name: "santosh",
      },
    ];

    for (const customer of customers) {
      await database.run(
        "INSERT OR IGNORE INTO customers (name, email) VALUES (?, ?)",
        [customer.name, customer.email]
      );

      await database.run("UPDATE customers SET name = ? WHERE email = ?", [
        customer.name,
        customer.email,
      ]);
    }

    app.get("/customers", async (req, res) => {
      try {
        const query = "SELECT * FROM customers";
        const customers = await database.all(query);
        res.json(customers);
      } catch (error) {
        console.log("Database error:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    app.listen(3000, () => {
      console.log("Server is running on http://localhost:3000/");
    });
  } catch (error) {
    console.log(`Database error: ${error}`);
    process.exit(1);
  }
};

initializeDbAndServer();
