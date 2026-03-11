-- Sentira-Law Database Schema
-- Run this SQL to create the database and users table

-- Create database
CREATE DATABASE IF NOT EXISTS sentira_law;

USE sentira_law;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample test user (password: test123)
-- INSERT INTO users (name, email, password) VALUES ('Test User', 'test@example.com', '$2a$10$XQxBtJ3fFqNjEkjYkT0mKO/8KDGkXJYxYJ1QJJ5zKjH6Y5Kz5Kz5K');
