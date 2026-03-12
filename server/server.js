import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import mysql from 'mysql2/promise'
import mongoose from 'mongoose'
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

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sentira_law'

// MongoDB Models
const caseSchema = new mongoose.Schema({
  caseId: { type: String, required: true, unique: true },
  caseTitle: String,
  caseType: { type: String, required: true },
  caseDescription: { type: String, required: true },
  uploadedDocuments: [String],
  resolutionType: { 
    type: String, 
    enum: ['Mediation', 'Settlement', 'Court', 'Pending'],
    default: 'Pending'
  },
  createdAt: { type: Date, default: Date.now }
})

const lawyerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  photo: String,
  specialization: { type: String, required: true },
  experience: { type: Number, required: true },
  location: { type: String, required: true },
  about: String,
  cases: { type: Number, default: 0 },
  description: String,
  email: String,
  phone: String,
  rating: { type: Number, default: 4.5 },
  consultationFee: String,
  availabilitySchedule: [{
    day: String,
    time: String
  }]
})

const Case = mongoose.model('Case', caseSchema)
const Lawyer = mongoose.model('Lawyer', lawyerSchema)

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
    console.log('All MySQL tables created/verified successfully')
  } catch (error) {
    console.error('Database initialization error:', error.message)
  }
}

// Initialize MongoDB and seed data
async function initMongoDB() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('MongoDB connected successfully')

    // Seed lawyers if collection is empty
    const lawyerCount = await Lawyer.countDocuments()
    if (lawyerCount === 0) {
      await Lawyer.insertMany([
        {
          name: "Harish Salve",
          photo: "/assets/harish salve.jpg",
          specialization: "Constitutional Law, Corporate Law",
          experience: 25,
          location: "New Delhi, India",
          about: "Senior advocate with extensive experience in constitutional matters and corporate litigation. Former Additional Solicitor General of India.",
          cases: 2500,
          description: "Senior advocate with extensive experience in constitutional matters and corporate litigation.",
          email: "harish.salve@sentiralaw.com",
          phone: "+91 98765 43210",
          rating: 4.9,
          consultationFee: "₹50,000",
          availabilitySchedule: [
            { day: "Monday", time: "10:00 AM - 1:00 PM" },
            { day: "Tuesday", time: "2:00 PM - 5:00 PM" },
            { day: "Wednesday", time: "11:00 AM - 3:00 PM" },
            { day: "Friday", time: "9:00 AM - 12:00 PM" }
          ]
        },
        {
          name: "Kapil Sibal",
          photo: "/assets/Kapil Sibal.jpg",
          specialization: "Constitutional Law, Civil Law",
          experience: 30,
          location: "New Delhi, India",
          about: "Former Minister and senior counsel known for his expertise in constitutional and civil law. One of India's most distinguished lawyers.",
          cases: 3200,
          description: "Former Minister and senior counsel known for his expertise in constitutional and civil law.",
          email: "kapil.sibal@sentiralaw.com",
          phone: "+91 98765 43211",
          rating: 4.8,
          consultationFee: "₹75,000",
          availabilitySchedule: [
            { day: "Monday", time: "2:00 PM - 5:00 PM" },
            { day: "Wednesday", time: "10:00 AM - 1:00 PM" },
            { day: "Thursday", time: "11:00 AM - 2:00 PM" },
            { day: "Friday", time: "3:00 PM - 6:00 PM" }
          ]
        },
        {
          name: "Abhishek Manu Singhvi",
          photo: "/assets/Abhishek Manu Singhvi.jpg",
          specialization: "Constitutional Law, Corporate Law",
          experience: 22,
          location: "New Delhi, India",
          about: "Eminent jurist specializing in constitutional law and corporate matters. Senior Advocate at Supreme Court.",
          cases: 1800,
          description: "Eminent jurist specializing in constitutional law and corporate matters.",
          email: "abhishek.singhvi@sentiralaw.com",
          phone: "+91 98765 43212",
          rating: 4.7,
          consultationFee: "₹45,000",
          availabilitySchedule: [
            { day: "Tuesday", time: "9:00 AM - 12:00 PM" },
            { day: "Wednesday", time: "2:00 PM - 5:00 PM" },
            { day: "Thursday", time: "10:00 AM - 1:00 PM" },
            { day: "Saturday", time: "11:00 AM - 2:00 PM" }
          ]
        },
        {
          name: "Mukul Rohatgi",
          photo: "/assets/Mukul Rohatgi.jpg",
          specialization: "Corporate Law, Constitutional Law",
          experience: 28,
          location: "New Delhi, India",
          about: "Former Attorney General of India with vast experience in corporate and constitutional law.",
          cases: 2100,
          description: "Former Attorney General with vast experience in corporate and constitutional law.",
          email: "mukul.rohatgi@sentiralaw.com",
          phone: "+91 98765 43213",
          rating: 4.9,
          consultationFee: "₹60,000",
          availabilitySchedule: [
            { day: "Monday", time: "11:00 AM - 2:00 PM" },
            { day: "Tuesday", time: "10:00 AM - 1:00 PM" },
            { day: "Thursday", time: "2:00 PM - 5:00 PM" },
            { day: "Friday", time: "10:00 AM - 1:00 PM" }
          ]
        },
        {
          name: "Gopal Subramanium",
          photo: "/assets/Gopal Subramanium.jpg",
          specialization: "Criminal Law, Constitutional Law",
          experience: 20,
          location: "New Delhi, India",
          about: "Senior advocate known for his expertise in criminal and constitutional matters. Former Solicitor General of India.",
          cases: 1500,
          description: "Senior advocate known for his expertise in criminal and constitutional matters.",
          email: "gopal.subramanium@sentiralaw.com",
          phone: "+91 98765 43214",
          rating: 4.8,
          consultationFee: "₹40,000",
          availabilitySchedule: [
            { day: "Monday", time: "2:00 PM - 5:00 PM" },
            { day: "Wednesday", time: "9:00 AM - 12:00 PM" },
            { day: "Friday", time: "11:00 AM - 2:00 PM" }
          ]
        },
        {
          name: "Pinky Anand",
          photo: "/assets/Pinky Anand.jpg",
          specialization: "Corporate Law, Civil Law",
          experience: 18,
          location: "New Delhi, India",
          about: "Senior advocate with expertise in corporate law and civil litigation. Known for her meticulous approach.",
          cases: 1200,
          description: "Senior advocate with expertise in corporate law and civil litigation.",
          email: "pinky.anand@sentiralaw.com",
          phone: "+91 98765 43215",
          rating: 4.7,
          consultationFee: "₹35,000",
          availabilitySchedule: [
            { day: "Tuesday", time: "10:00 AM - 1:00 PM" },
            { day: "Wednesday", time: "2:00 PM - 5:00 PM" },
            { day: "Thursday", time: "11:00 AM - 2:00 PM" },
            { day: "Saturday", time: "9:00 AM - 12:00 PM" }
          ]
        },
        {
          name: "Arvind Datar",
          photo: "/assets/Arvind Datar.jpg",
          specialization: "Tax Law, Constitutional Law",
          experience: 32,
          location: "Chennai, India",
          about: "Renowned tax counsel with extensive experience in tax and constitutional matters.",
          cases: 900,
          description: "Renowned tax counsel with extensive experience in tax and constitutional matters.",
          email: "arvind.datar@sentiralaw.com",
          phone: "+91 98765 43216",
          rating: 4.9,
          consultationFee: "₹55,000",
          availabilitySchedule: [
            { day: "Monday", time: "10:00 AM - 1:00 PM" },
            { day: "Wednesday", time: "11:00 AM - 2:00 PM" },
            { day: "Friday", time: "10:00 AM - 1:00 PM" }
          ]
        },
        {
          name: "Salman Khurshid",
          photo: "/assets/Salman Khurshid.jpg",
          specialization: "Constitutional Law, Civil Law",
          experience: 35,
          location: "New Delhi, India",
          about: "Former Law Minister with vast experience in constitutional and civil law.",
          cases: 2800,
          description: "Former Law Minister with vast experience in constitutional and civil law.",
          email: "salman.khurshid@sentiralaw.com",
          phone: "+91 98765 43217",
          rating: 4.6,
          consultationFee: "₹65,000",
          availabilitySchedule: [
            { day: "Tuesday", time: "2:00 PM - 5:00 PM" },
            { day: "Thursday", time: "10:00 AM - 1:00 PM" },
            { day: "Friday", time: "2:00 PM - 5:00 PM" }
          ]
        },
        {
          name: "K. Parasaran",
          photo: "/assets/K. Parasaran.jpg",
          specialization: "Constitutional Law, Religious Law",
          experience: 40,
          location: "Chennai, India",
          about: "Former Attorney General with expertise in constitutional and religious law.",
          cases: 3500,
          description: "Former Attorney General with expertise in constitutional and religious law.",
          email: "k.parasaran@sentiralaw.com",
          phone: "+91 98765 43218",
          rating: 4.9,
          consultationFee: "₹70,000",
          availabilitySchedule: [
            { day: "Monday", time: "11:00 AM - 2:00 PM" },
            { day: "Wednesday", time: "10:00 AM - 1:00 PM" },
            { day: "Saturday", time: "10:00 AM - 1:00 PM" }
          ]
        },
        {
          name: "Indira Jaising",
          photo: "/assets/Indira Jaising.jpg",
          specialization: "Human Rights Law, Constitutional Law",
          experience: 38,
          location: "Mumbai, India",
          about: "Leading human rights lawyer with expertise in constitutional law. First woman to become Senior Advocate in Supreme Court.",
          cases: 1600,
          description: "Leading human rights lawyer with expertise in constitutional law.",
          email: "indira.jaising@sentiralaw.com",
          phone: "+91 98765 43219",
          rating: 4.8,
          consultationFee: "₹55,000",
          availabilitySchedule: [
            { day: "Tuesday", time: "11:00 AM - 2:00 PM" },
            { day: "Wednesday", time: "2:00 PM - 5:00 PM" },
            { day: "Thursday", time: "10:00 AM - 1:00 PM" },
            { day: "Friday", time: "11:00 AM - 2:00 PM" }
          ]
        }
      ])
      console.log('Lawyers seeded successfully')
    }

    // Seed sample cases if collection is empty
    const caseCount = await Case.countDocuments()
    if (caseCount === 0) {
      await Case.insertMany([
        {
          caseId: "CASE-001",
          caseTitle: "Rental Property Dispute",
          caseType: "rental",
          caseDescription: "Tenant refusing to pay rent for commercial property. Landlord seeking eviction and unpaid rent recovery.",
          resolutionType: "Settlement",
          createdAt: new Date("2024-01-15")
        },
        {
          caseId: "CASE-002",
          caseTitle: "Contract Payment Issue",
          caseType: "contract",
          caseDescription: "Client failed to make payment for services rendered. Seeking legal action for recovery of outstanding amount.",
          resolutionType: "Mediation",
          createdAt: new Date("2024-02-20")
        },
        {
          caseId: "CASE-003",
          caseTitle: "Property Boundary Dispute",
          caseType: "property",
          caseDescription: "Neighbor encroaching on property boundary. Need survey and legal remedy to restore proper boundaries.",
          resolutionType: "Court",
          createdAt: new Date("2024-03-10")
        },
        {
          caseId: "CASE-004",
          caseTitle: "Family Inheritance Matter",
          caseType: "family",
          caseDescription: "Dispute over ancestral property inheritance among siblings. Seeking fair distribution as per law.",
          resolutionType: "Mediation",
          createdAt: new Date("2024-04-05")
        },
        {
          caseId: "CASE-005",
          caseTitle: "Employment Contract Breach",
          caseType: "employment",
          caseDescription: "Former employee violating non-compete clause. Seeking injunction and damages.",
          resolutionType: "Settlement",
          createdAt: new Date("2024-05-12")
        },
        {
          caseId: "CASE-006",
          caseTitle: "Consumer Complaint - Defective Product",
          caseType: "consumer",
          caseDescription: "Purchased defective electronic device. Company refusing replacement or refund.",
          resolutionType: "Court",
          createdAt: new Date("2024-06-18")
        },
        {
          caseId: "CASE-007",
          caseTitle: "Rental Deposit Recovery",
          caseType: "rental",
          caseDescription: "Landlord refusing to return security deposit after lease termination without valid reason.",
          resolutionType: "Mediation",
          createdAt: new Date("2024-07-22")
        },
        {
          caseId: "CASE-008",
          caseTitle: "Business Partnership Dissolution",
          caseType: "contract",
          caseDescription: "Business partners disagreeing on dissolution terms. Need fair division of assets and liabilities.",
          resolutionType: "Court",
          createdAt: new Date("2024-08-30")
        }
      ])
      console.log('Cases seeded successfully')
    }
  } catch (error) {
    console.error('MongoDB initialization error:', error.message)
  }
}

// Initialize databases
initDatabase()
initMongoDB()

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

// ============ CASES ROUTES (MySQL) ============

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

    // Also save to MongoDB for similarity matching
    try {
      await Case.create({
        caseId: caseId,
        caseTitle: `${issueType} Case`,
        caseType: issueType,
        caseDescription: description,
        uploadedDocuments: documents ? [documents] : [],
        resolutionType: 'Pending'
      })
    } catch (mongoError) {
      console.log('MongoDB case save warning:', mongoError.message)
    }
    
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

// Get All Cases (MySQL)
app.get('/api/cases', async (req, res) => {
  try {
    const [cases] = await pool.query('SELECT * FROM cases ORDER BY created_at DESC')
    res.json({ success: true, cases })
  } catch (error) {
    console.error('Get cases error:', error)
    res.status(500).json({ error: 'Failed to fetch cases' })
  }
})

// ============ CASES ROUTES (MongoDB) - SIMILARITY FINDER ============

// Get similar cases based on description
app.get('/api/cases/similar/:caseId', async (req, res) => {
  try {
    const { caseId } = req.params
    
    // First find the current case
    const currentCase = await Case.findOne({ caseId })
    
    if (!currentCase) {
      return res.status(404).json({ error: 'Case not found' })
    }

    // Get all other cases
    const allCases = await Case.find({ caseId: { $ne: caseId } })
    
    // Calculate similarity using keyword matching
    const currentKeywords = currentCase.caseDescription.toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 3)
    
    const similarCases = allCases.map(caseItem => {
      const caseDescription = caseItem.caseDescription.toLowerCase()
      let matchCount = 0
      
      currentKeywords.forEach(keyword => {
        if (caseDescription.includes(keyword)) {
          matchCount++
        }
      })
      
      // Also consider same case type
      const typeBonus = caseItem.caseType === currentCase.caseType ? 20 : 0
      
      const similarity = Math.min(95, Math.round(
        ((matchCount / Math.max(currentKeywords.length, 1)) * 70) + typeBonus
      ))
      
      return {
        _id: caseItem._id,
        caseId: caseItem.caseId,
        caseTitle: caseItem.caseTitle,
        caseType: caseItem.caseType,
        caseDescription: caseItem.caseDescription,
        resolutionType: caseItem.resolutionType,
        similarity
      }
    })
    
    // Sort by similarity and take top 5
    const topSimilar = similarCases
      .filter(c => c.similarity > 20)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5)
    
    res.json({ 
      success: true, 
      currentCase,
      similarCases: topSimilar 
    })
  } catch (error) {
    console.error('Get similar cases error:', error)
    res.status(500).json({ error: 'Failed to find similar cases' })
  }
})

// Get all MongoDB cases
app.get('/api/mongo/cases', async (req, res) => {
  try {
    const cases = await Case.find().sort({ createdAt: -1 })
    res.json({ success: true, cases })
  } catch (error) {
    console.error('Get MongoDB cases error:', error)
    res.status(500).json({ error: 'Failed to fetch cases' })
  }
})

// ============ LAWYERS ROUTES (MongoDB) ============

// Get all lawyers
app.get('/api/lawyers', async (req, res) => {
  try {
    const lawyers = await Lawyer.find()
    res.json({ success: true, lawyers })
  } catch (error) {
    console.error('Get lawyers error:', error)
    res.status(500).json({ error: 'Failed to fetch lawyers' })
  }
})

// Get single lawyer by ID
app.get('/api/lawyers/:id', async (req, res) => {
  try {
    const lawyer = await Lawyer.findById(req.params.id)
    if (!lawyer) {
      return res.status(404).json({ error: 'Lawyer not found' })
    }
    res.json({ success: true, lawyer })
  } catch (error) {
    console.error('Get lawyer error:', error)
    res.status(500).json({ error: 'Failed to fetch lawyer' })
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
