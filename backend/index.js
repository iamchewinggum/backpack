//just starts the server

const express = require('express');
const cors = require('cors');
const tabsRoutes = require('./routes/tabs')
const authRoutes = require('./routes/auth')
const app = express();
const PORT = 3000;


app.use(cors())
app.use(express.json())
app.set('json spaces', 2)

// Health check
app.get('/', (req, res) => {
  res.send('Backend is alive and well');
});

app.use('/', tabsRoutes)
app.use('/', authRoutes)
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});