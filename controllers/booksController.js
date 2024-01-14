const Book = require('../models/Book');

const booksPerPage = 9;

const showCatalog = async (req, res) => {
    try {
        // Extract the page parameter from the query string or set it to 1 by default
        const page = parseInt(req.query.page) || 1;

        // Calculate the skip value based on the page and limit
        const skip = (page - 1) * booksPerPage;

        // Fetch books for the current page
        const books = await Book.find({}).skip(skip).limit(booksPerPage).exec();

        // Count total number of books for pagination
        const totalBooks = await Book.countDocuments({});

        // Calculate total number of pages
        const totalPages = Math.ceil(totalBooks / booksPerPage);

        // Render the catalog page with the list of books and pagination information
        res.render('books/catalog', {
            user: req.user,
            userAuthenticated: req.isAuthenticated(),
            username: req.user ? req.user.username : null,
            books: books,
            currentPage: page,
            totalPages: totalPages,
            // ... other variables needed for catalog.ejs
        });
    } catch (error) {
        console.error("Error in showCatalog:", error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = {
    showCatalog,
    // ... other controller functions
};
