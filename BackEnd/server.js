const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const app = express();

dotenv.config();

app.use(cors());
app.use(express.json()); 

const port = 5000;

app.get('/', (req, res) => {
    res.send('Welcome to the Express.js server!');
});

app.get('/api/status', (req, res) => {
    res.json({ status: 'Server is running smoothly', uptime: process.uptime() });
});

app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
});
