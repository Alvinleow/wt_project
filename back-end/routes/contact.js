// routes/contact.js

const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// Route to handle contact form submission
router.post('/', contactController.saveContact);

module.exports = router;
