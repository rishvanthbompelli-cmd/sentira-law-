const mysql = require('mysql2/promise')

async function test() {
  try {
    const pool = mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'sentira_law'
    })
    const conn = await pool.getConnection()
    console.log('MySQL connected successfully')
    conn.release()
  } catch (err) {
    console.error('MySQL error:', err.message)
  }
  process.exit()
}
test()
