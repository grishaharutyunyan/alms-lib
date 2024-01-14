// routes/books.js
const express = require('express');
const router = express.Router();
const booksController = require('../controllers/booksController');
const { ensureAuthenticated } = require('../config/auth');

// Catalog page route
router.get('/catalog', ensureAuthenticated, booksController.showCatalog);

module.exports = router;

