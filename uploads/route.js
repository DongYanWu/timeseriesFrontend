import nextConnect from "next-connect";
import multer from "multer";
import { Pool } from "pg";
import fs from "fs";
import path from "path";

// Setup connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

// Setup multer for file uploads
const upload = multer({ dest: "uploads/" });

// Function to create a new table if it doesn't exist
const createTableIfNotExists = async (tableName) => {
  const client = await pool.connect();
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS ${tableName} (
        timestamp TIMESTAMPTZ,
        company VARCHAR(255),
        price NUMERIC
      )
    `;
    await client.query(query);
    console.log(`Table ${tableName} is ready`);
  } catch (err) {
    console.error("Error creating table:", err);
  } finally {
    client.release();
  }
};

// Function to import CSV data into the target table
const importCsvToDb = async (csvFilePath, tableName) => {
  const client = await pool.connect();
  try {
    await createTableIfNotExists(tableName);
    const query = `COPY ${tableName}(timestamp, company, price) FROM '${csvFilePath}' WITH CSV HEADER`;
    await client.query(query);
    console.log(`Imported ${csvFilePath} into the table ${tableName}`);
  } catch (err) {
    console.error("Error importing CSV:", err);
  } finally {
    client.release();
  }
};

const apiRoute = nextConnect({
  onError(error, req, res) {
    res
      .status(501)
      .json({ error: `Sorry something went wrong! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.single("csvFile"));

apiRoute.post(async (req, res) => {
  const csvFilePath = path.join(process.cwd(), "uploads", req.file.filename);
  const targetTable = "target_table"; // The name of the new table
  try {
    await importCsvToDb(csvFilePath, targetTable);
    res
      .status(200)
      .json({ message: "File uploaded and imported successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error uploading file" });
  } finally {
    // Delete the file after importing
    fs.unlinkSync(csvFilePath);
  }
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apiRoute;
