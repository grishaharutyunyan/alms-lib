const Book = require('../models/Book');

const booksPerPage = 9;

const showCatalog = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * booksPerPage;

        const books = await Book.find({}).skip(skip).limit(booksPerPage).exec();

        const totalBooks = await Book.countDocuments({});

        const totalPages = Math.ceil(totalBooks / booksPerPage);

        res.render('books/catalog', {
            user: req.user,
            userAuthenticated: req.isAuthenticated(),
            username: req.user ? req.user.username : null,
            books: books,
            currentPage: page,
            totalPages: totalPages,
        });
    } catch (error) {
        console.error("Error in showCatalog:", error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = {
    showCatalog,
};
