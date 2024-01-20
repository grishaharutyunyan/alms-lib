const express = require('express');
const router = express.Router();
const Loan = require('../models/Loan');
const Book = require('../models/Book');

router.post('/borrow', async (req, res) => {
  const { bookId } = req.body;

  try {
    const book = await Book.findById(bookId);
    if (!book || !book.availability) {
      return res.status(400).json({ message: 'The book is not available for borrowing.' });
    }

    const newLoan = new Loan({
      book: bookId,
      borrower_name: req.body.borrower_name,
      borrower_email: req.body.borrower_email,
      loan_date: new Date(),
      return_date: new Date() + 7 * 24 * 60 * 60 * 1000,
    });

    book.availability = false;
    await book.save();
    const savedLoan = await newLoan.save();

    res.status(201).json(savedLoan);
  } catch (error) {
    console.error('Error borrowing book:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/reserve', async (req, res) => {
  const { bookId } = req.body;

  try {
    const book = await Book.findById(bookId);
    if (!book || !book.availability) {
      return res.status(400).json({ message: 'The book is not available for reservation.' });
    }

    const newLoan = new Loan({
      book: bookId,
      borrower_name: req.body.borrower_name,
      borrower_email: req.body.borrower_email,
      loan_date: new Date(),
      return_date: new Date() + 7 * 24 * 60 * 60 * 1000,
      isRenewed: true,
    });

    book.availability = false;
    await book.save();

    const savedLoan = await newLoan.save();

    res.status(201).json(savedLoan);
  } catch (error) {
    console.error('Error reserving book:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
