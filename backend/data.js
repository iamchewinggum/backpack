const pool = require('./db')


//functions that talk directly to PostgresSQL

async function unpackBackpack(userId) {
  const result = await pool.query(
    'SELECT * FROM tabs WHERE user_id = $1 ORDER BY created_at ASC',
    [userId]
  )
  return result.rows
}

async function addToBackpack(url, title, userId) {
  const result = await pool.query(
    'INSERT INTO tabs (url, title, user_id) VALUES ($1, $2, $3) RETURNING *',
    [url, title, userId]
  )
  return result.rows[0]
}

async function removeTab(tabId, userId) {
  await pool.query(
    'DELETE FROM tabs WHERE id = $1 AND user_id = $2',
    [tabId, userId]
  )
}

async function emptyBackpack(userId) {
  await pool.query(
    'DELETE FROM tabs WHERE user_id = $1',
    [userId]
  )
}


 

module.exports = {
  unpackBackpack,
  addToBackpack,
  removeTab,
  emptyBackpack
}