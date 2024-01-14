const express = require('express');
const router = express.Router();
const Loan = require('../models/Loan');
const Book = require('../models/Book');

// Borrow a book
router.post('/borrow', async (req, res) => {
  const { bookId } = req.body;

  try {
    // Check if the book is available
    const book = await Book.findById(bookId);
    if (!book || !book.availability) {
      return res.status(400).json({ message: 'The book is not available for borrowing.' });
    }

    // Create a new loan record
    const newLoan = new Loan({
      book: bookId,
      borrower_name: req.body.borrower_name,
      borrower_email: req.body.borrower_email,
      loan_date: new Date(),
      return_date: new Date() + 7 * 24 * 60 * 60 * 1000, // Assuming a 7-day loan period
    });

    // Update book availability
    book.availability = false;
    await book.save();

    // Save the loan record
    const savedLoan = await newLoan.save();

    res.status(201).json(savedLoan);
  } catch (error) {
    console.error('Error borrowing book:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Reserve a book
router.post('/reserve', async (req, res) => {
  const { bookId } = req.body;

  try {
    // Check if the book is available
    const book = await Book.findById(bookId);
    if (!book || !book.availability) {
      return res.status(400).json({ message: 'The book is not available for reservation.' });
    }

    // Create a new loan record with isRenewed set to true
    const newLoan = new Loan({
      book: bookId,
      borrower_name: req.body.borrower_name,
      borrower_email: req.body.borrower_email,
      loan_date: new Date(),
      return_date: new Date() + 7 * 24 * 60 * 60 * 1000, // Assuming a 7-day loan period
      isRenewed: true,
    });

    // Update book availability
    book.availability = false;
    await book.save();

    // Save the loan record
    const savedLoan = await newLoan.save();

    res.status(201).json(savedLoan);
  } catch (error) {
    console.error('Error reserving book:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
