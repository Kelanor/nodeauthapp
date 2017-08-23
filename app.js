const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');
const morgan = require('morgan');

// Connect to MongoDB
mongoose.connect(config.database, { useMongoClient: true });
// On connected
mongoose.connection.on('connected', () => {
	console.log('Connected to database ' + config.database);
});
// On connected error
mongoose.connection.on('error', (err) => {
	console.log('Database err: ' + err);
});

const app = express();

const users = require('./routes/users');

// Port number
const port = process.env.PORT || config.serverPort || 8080;

// CORS Middleware
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());

// Morgan Logging Middleware
app.use(morgan('dev'));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

// Users Route
app.use('/users', users);

// Index Route
app.get('/', (req, res) => {
	res.send('Invalid endpoint');
});

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'public/index.html'))
});

// Start Server
app.listen(port, () => {
	console.log("Server started on port " + port);
});