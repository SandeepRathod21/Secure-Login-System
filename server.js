const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors({
origin: true,
credentials: true
}));

app.use(express.json());

app.use(session({
secret: process.env.SESSION_SECRET,
resave: false,
saveUninitialized: false,
cookie: { secure: false, maxAge: 3600000 }
}));

app.use('/api/auth', require('./routes/auth'));

app.get('/', (req, res) => {
res.json({ message: 'Secure Login API Running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});