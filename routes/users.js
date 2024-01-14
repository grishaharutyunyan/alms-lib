const express = require('express');
const router = express.Router();
const bcrypt  = require('bcryptjs')
const passport = require('passport');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
//User model
const User = require('../models/User')

//profile page 

router.get('/profile', ensureAuthenticated, (req, res) => {
  // Assuming user data is available in req.user
  res.render('users/profile', { user: req.user, userAuthenticated: true });
});



// Login page
router.get('/login', function(req, res, next) {
  res.render('users/login' ,);
  
});

router.get('/register', function(req, res, next) {
  res.render('users/register' ,);
  
});




//Register handle


router.post('/register', async (req, res) => {
  if ('signup' === req.body.formType) {
     //register 
      const {fullname,email,password,confirmPassword } = req.body;
      let errors = [];

      // requires fields
      if(!fullname || !email || !password || !confirmPassword) {
        errors.push({msg: 'Please fill in all fields'})
      }
      
      //chack passwords match 
      if(password !== confirmPassword){
        errors.push({msg:'Passwords do not match'})
      }

      //chack passlength
       if(password.length < 6 ){
         errors.push({msg:'Password should be at least 6 characters'})
       }

       if(errors.length> 0){
          res.render('users/register',{
            errors,
            fullname,
            email,
            password,
            confirmPassword,
          })
       }else {
        User.findOne({email:email})
        .then(user => {
          if(user){
            errors.push({msg:'Email is already registered'})
            res.render('users/register',{
              errors,
              fullname,
              email,
              password,
              confirmPassword,

            });
          } else{
            const newUser = new User({
              fullname,
              email,
              password
            });
            //hash password
            bcrypt.genSalt(10,(err,salt)=>
             bcrypt.hash(newUser.password,salt,(err,hash)=>{
                if(err) throw err;
                 //set password to hashed
                newUser.password = hash;
                //saveuser
                newUser.save()
                .then(user => {
                  req.flash('success_msg','You are now registered and can log in')
                  res.redirect('/users/login')
                })
                .catch(err =>console.log(err))
            }))
          }
        });
       }

  } 
  
})

//Login handle 

router.post('/login',(req,res,next)=> {
  passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash:true 
  })(req,res,next)
});

// Logout
router.get('/logout', (req, res) => {
  // Log the user out using Passport.js
  req.logout((err) => {
    if (err) {
      console.error(err);
      return res.redirect('/'); // Redirect to a suitable page in case of an error
    }

    // Set a flash message to indicate successful logout
    req.flash('success_msg', 'You are logged out');

    // Redirect the user to the login page
    res.redirect('/users/login');
  });
});

module.exports = router;
