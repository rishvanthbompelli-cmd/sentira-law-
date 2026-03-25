import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

async function queryDB() {
  const resultData = {};
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'sura123',
      database: process.env.DB_NAME || 'sentira_law'
    });
    
    try {
      const [users] = await connection.query('SELECT id, name, email FROM users LIMIT 10');
      resultData.users = users;
    } catch(e) { resultData.users = "Error or empty"; }
    
    try {
      const [cases] = await connection.query('SELECT id, case_id, full_name, email, issue_type, status FROM cases LIMIT 10');
      resultData.cases = cases;
    } catch(e) { resultData.cases = "Error or empty"; }
    
    try {
      const [contacts] = await connection.query('SELECT id, full_name, email, subject, status FROM contacts LIMIT 10');
      resultData.contacts = contacts;
    } catch(e) { resultData.contacts = "Error or empty"; }
    
    await connection.end();
    
    fs.writeFileSync(path.join(__dirname, 'db_output.json'), JSON.stringify(resultData, null, 2));
    console.log("Wrote fully to db_output.json");
  } catch (err) {
    console.error("Failed", err.message);
  }
}

queryDB();
