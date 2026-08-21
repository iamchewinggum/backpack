// builds the app — no server started here

const express = require('express');
const cors = require('cors');
const tabsRoutes = require('./routes/tabs');
const authRoutes = require('./routes/auth');

const app = express();

app.use(cors());
app.use(express.json());
app.set('json spaces', 2);

// Health check
app.get('/', (req, res) => {
  res.send('Backend is alive and well');
});

app.use('/', tabsRoutes);
app.use('/', authRoutes);

module.exports = app;