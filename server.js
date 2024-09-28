// Import necessary dependencies
const express = require('express'); // Express Framework for handling HTTP requests
const mysql = require('mysql2'); // MySQL client for Node.js
const cors = require('cors'); // To handle cross-origin requests
const dotenv = require('dotenv'); // To load environment variables from .env file
const path = require('path'); // To handle file paths

// Initialize Express app
const app = express();

// Middleware setup
app.use(express.json());
app.use(cors());
dotenv.config(); // Load environment variables from .env file

// Set EJS as the view engine and define the views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Set the views directory

// Configure database connection using .env credentials
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Test database connection
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Successfully connected to MySQL as ID:', db.threadId);
  }
});

////////////////////////////////////////
// 1. Retrieve All Patients
////////////////////////////////////////
app.get('/patients', (req, res) => {
  const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error retrieving patients:', err);
      res.status(500).send('Error retrieving patients');
    } else {
      res.render('patients', { patients: results }); // Render EJS template with patient data
    }
  });
});

////////////////////////////////////////
// 2. Retrieve All Providers
////////////////////////////////////////
app.get('/providers', (req, res) => {
  const query = 'SELECT first_name, last_name, provider_specialty FROM providers';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error retrieving providers:', err);
      res.status(500).send('Error retrieving providers');
    } else {
      res.render('providers', { providers: results }); // Render EJS template with provider data
    }
  });
});

////////////////////////////////////////
// 3. Filter Patients by First Name
////////////////////////////////////////
app.get('/patients/filter', (req, res) => {
  const { first_name } = req.query; // Get first_name from query parameters
  const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';
  db.query(query, [first_name], (err, results) => {
    if (err) {
      console.error('Error filtering patients by first name:', err);
      res.status(500).send('Error filtering patients');
    } else {
      res.render('patients', { patients: results }); // Render EJS template with filtered patient data
    }
  });
});

////////////////////////////////////////
// 4. Retrieve Providers by Specialty
////////////////////////////////////////
app.get('/providers/filter', (req, res) => {
  const { provider_specialty } = req.query; // Get provider_specialty from query parameters
  const query = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?';
  db.query(query, [provider_specialty], (err, results) => {
    if (err) {
      console.error('Error retrieving providers by specialty:', err);
      res.status(500).send('Error retrieving providers');
    } else {
      res.render('providers', { providers: results }); // Render EJS template with filtered provider data
    }
  });
});

// Start the server
const port = process.env.PORT || 3000; // Use port from .env or default to 3000
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
