const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

/* GET home page. */
// ...

router.get('/', function(req, res, next) {
  // Pass user authentication information to the template
  res.render('layouts/main', { 
    title: 'Picsart Academy Library', 
    user: req.user, 
    userAuthenticated: req.isAuthenticated(), 
    username: req.user ? req.user.username : null 
  });
});

// ...



// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('layouts/dashboard',  {
    user: req.user, 
  }),
  
)




module.exports = router;

