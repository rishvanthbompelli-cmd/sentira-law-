import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001
const JWT_SECRET = process.env.JWT_SECRET || 'sentira-law-secret-key-2024'

// Middleware
app.use(cors())
app.use(express.json())

// MySQL Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sentira_law',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

// Initialize Database and Tables
async function initDatabase() {
  try {
    // First connect without database to create it
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    })
    
    await connection.query(`CREATE DATABASE IF NOT EXISTS sentira_law`)
    await connection.end()
    console.log('Database created/verified successfully')
    
    // Now create the users table
    const poolConnection = await pool.getConnection()
    await poolConnection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    
    // Create cases table
    await poolConnection.query(`
      CREATE TABLE IF NOT EXISTS cases (
        id INT AUTO_INCREMENT PRIMARY KEY,
        case_id VARCHAR(50) UNIQUE NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        email VARCHAR(150) NOT NULL,
        address TEXT,
        issue_type VARCHAR(50),
        description TEXT,
        id_proof VARCHAR(255),
        documents VARCHAR(255),
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    
    // Create contacts table
    await poolConnection.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL,
        phone VARCHAR(20),
        subject VARCHAR(200),
        message TEXT,
        status VARCHAR(20) DEFAULT 'unread',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    
    poolConnection.release()
    console.log('All tables created/verified successfully')
  } catch (error) {
    console.error('Database initialization error:', error.message)
  }
}

// Initialize database on startup
initDatabase()

// ============ AUTH ROUTES ============

// Login Route
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }
    
    const [users] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    )
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }
    
    const user = users[0]
    
    if (password !== user.password) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }
    
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )
    
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email 
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Login failed' })
  }
})

// Register Route
app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' })
    }
    
    const [existingUsers] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    )
    
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'Email already registered' })
    }
    
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, password]
    )
    
    const token = jwt.sign(
      { userId: result.insertId, email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )
    
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: { id: result.insertId, name, email }
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ error: 'Registration failed' })
  }
})

// ============ CASES ROUTES ============

// Submit Case
app.post('/api/cases', async (req, res) => {
  try {
    const { caseId, fullName, phone, email, address, issueType, description, idProof, documents } = req.body
    
    if (!caseId || !fullName || !email) {
      return res.status(400).json({ error: 'Case ID, name and email are required' })
    }
    
    const [result] = await pool.query(
      `INSERT INTO cases (case_id, full_name, phone, email, address, issue_type, description, id_proof, documents) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [caseId, fullName, phone, email, address, issueType, description, idProof, documents]
    )
    
    res.status(201).json({
      success: true,
      message: 'Case submitted successfully',
      caseId: caseId,
      id: result.insertId
    })
  } catch (error) {
    console.error('Submit case error:', error)
    res.status(500).json({ error: 'Failed to submit case' })
  }
})

// Get All Cases
app.get('/api/cases', async (req, res) => {
  try {
    const [cases] = await pool.query('SELECT * FROM cases ORDER BY created_at DESC')
    res.json({ success: true, cases })
  } catch (error) {
    console.error('Get cases error:', error)
    res.status(500).json({ error: 'Failed to fetch cases' })
  }
})

// ============ CONTACTS ROUTES ============

// Submit Contact
app.post('/api/contacts', async (req, res) => {
  try {
    const { fullName, email, phone, subject, message } = req.body
    
    if (!fullName || !email || !message) {
      return res.status(400).json({ error: 'Full name, email and message are required' })
    }
    
    const [result] = await pool.query(
      `INSERT INTO contacts (full_name, email, phone, subject, message) 
       VALUES (?, ?, ?, ?, ?)`,
      [fullName, email, phone, subject, message]
    )
    
    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      id: result.insertId
    })
  } catch (error) {
    console.error('Submit contact error:', error)
    res.status(500).json({ error: 'Failed to send message' })
  }
})

// Get All Contacts
app.get('/api/contacts', async (req, res) => {
  try {
    const [contacts] = await pool.query('SELECT * FROM contacts ORDER BY created_at DESC')
    res.json({ success: true, contacts })
  } catch (error) {
    console.error('Get contacts error:', error)
    res.status(500).json({ error: 'Failed to fetch contacts' })
  }
})

// Verify Token Route
app.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }
    
    const decoded = jwt.verify(token, JWT_SECRET)
    
    const [users] = await pool.query(
      'SELECT id, name, email FROM users WHERE id = ?',
      [decoded.userId]
    )
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'User not found' })
    }
    
    res.json({ user: users[0] })
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
