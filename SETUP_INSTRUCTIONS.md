# Sentira-Law Setup Instructions

## Problem Fixed

The application was showing "Backend server is offline. Please start the Python server." error when clicking login or submit case buttons. This was caused by:

1. **Port Mismatch**: The frontend was configured to connect to port 8000, but the backend server runs on port 3001
2. **Misleading Error Message**: The error message mentioned "Python server" when the backend is actually a Node.js server

## Changes Made

### 1. Fixed Port Configuration
**File**: [`sentira-law-/src/apiClient.js`](sentira-law-/src/apiClient.js:1)
- Changed default API URL from `http://127.0.0.1:8000` to `http://127.0.0.1:3001`
- This matches the backend server's actual port configuration

### 2. Updated Error Messages
Updated error messages in three components to be more accurate:
- [`sentira-law-/src/components/Login.jsx`](sentira-law-/src/components/Login.jsx:72)
- [`sentira-law-/src/components/SubmitCase.jsx`](sentira-law-/src/components/SubmitCase.jsx:99)
- [`sentira-law-/src/components/Contact.jsx`](sentira-law-/src/components/Contact.jsx:59)

Changed from: "Backend server is offline. Please start the Python server."
To: "Backend server is offline. Please start the Node.js server."

## How to Start the Backend Server

### Prerequisites
- Node.js installed (v14 or higher)
- MySQL database running
- Database credentials configured in [`sentira-law-/server/.env`](sentira-law-/server/.env:1)

### Steps to Start

1. **Navigate to the server directory**:
   ```bash
   cd sentira-law-/server
   ```

2. **Install dependencies** (if not already installed):
   ```bash
   npm install
   ```

3. **Configure environment variables** (if needed):
   Edit [`sentira-law-/server/.env`](sentira-law-/server/.env:1) with your MySQL credentials:
   ```
   PORT=3001
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=sentira_law
   JWT_SECRET=your-secret-key
   ```

4. **Start the server**:
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

5. **Verify the server is running**:
   You should see output like:
   ```
   Database created/verified successfully
   All MySQL tables created/verified successfully
   Server running on port 3001
   ```

## How to Start the Frontend

1. **Navigate to the frontend directory**:
   ```bash
   cd sentira-law-
   ```

2. **Install dependencies** (if not already installed):
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   Open your browser and go to `http://localhost:5173`

## Troubleshooting

### "Backend server is offline" error persists
- Ensure the backend server is running on port 3001
- Check that MySQL is running and accessible
- Verify the `.env` file has correct database credentials
- Check the server console for any error messages

### Database connection errors
- Ensure MySQL service is running
- Verify database credentials in `.env` file
- The server will automatically create the database and tables on first run

### Port already in use
- If port 3001 is already in use, change the `PORT` value in `.env` file
- Update the `API_BASE_URL` in [`sentira-law-/src/apiClient.js`](sentira-law-/src/apiClient.js:1) to match

## Architecture Overview

- **Frontend**: React + Vite (runs on port 5173)
- **Backend**: Express.js + Node.js (runs on port 3001)
- **Database**: MySQL (stores users, cases, contacts)
- **Authentication**: JWT tokens

The frontend communicates with the backend via REST API calls to endpoints like `/api/login`, `/api/register`, `/api/cases`, etc.
