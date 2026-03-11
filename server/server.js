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

// Initialize Database and Table
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
    poolConnection.release()
    console.log('Users table created/verified successfully')
  } catch (error) {
    console.error('Database initialization error:', error.message)
  }
}

// Initialize database on startup
initDatabase()

// Register Route
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' })
    }
    
    // Check if email already exists
    const [existingUsers] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    )
    
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'Email already registered' })
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)
    
    // Insert user
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    )
    
    // Generate token
    const token = jwt.sign(
      { userId: result.insertId, email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )
    
    res.status(201).json({
      message: 'Registration successful',
      token,
      user: { id: result.insertId, name, email }
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ error: 'Registration failed' })
  }
})

// Login Route
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }
    
    // Find user
    const [users] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    )
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }
    
    const user = users[0]
    
    // Compare password
    const isMatch = await bcrypt.compare(password, user.password)
    
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }
    
    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )
    
    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Login failed' })
  }
})

// Verify Token Route
app.get('/api/verify', async (req, res) => {
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
