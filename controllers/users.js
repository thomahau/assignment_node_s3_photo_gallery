const express = require('express');
const mongoose = require('mongoose');
const models = require('./../models');
const h = require('./../helpers');

const User = mongoose.model('User');
const router = express.Router();

module.exports = middlewares => {
  const { loggedInOnly, loggedOutOnly } = middlewares;

  // Index
  router.get('/', loggedInOnly, (req, res, next) => {
    User.find()
      .then(users => {
        res.render('users/index', { user: req.user, users });
      })
      .catch(e => {
        if (e.errors) {
          Object.keys(e.errors).forEach(key => {
            req.flash('error', `${e.errors[key].message}`);
            res.redirect(req.session.backUrl);
          });
        } else {
          next(e);
        }
      });
  });

  // Show
  router.get('/:id', (req, res, next) => {
    User.findById(req.params.id)
      .then(profile => {
        res.render('users/show', { user: req.user, profile });
      })
      .catch(e => {
        if (e.errors) {
          Object.keys(e.errors).forEach(key => {
            req.flash('error', `${e.errors[key].message}`);
            res.redirect(req.session.backUrl);
          });
        } else {
          next(e);
        }
      });
  });

  // New
  router.get('/user/new', loggedOutOnly, (req, res) => {
    res.render('users/new');
  });

  // Create
  router.post('/users', loggedOutOnly, (req, res, next) => {
    const userParams = {
      fname: req.body.user.fname,
      lname: req.body.user.lname,
      email: req.body.user.email,
      password: req.body.user.password
    };

    User.create(userParams)
      .then(user => {
        req.flash('success', 'Registration successful! Please log in.');
        res.redirect(h.loginPath());
      })
      .catch(e => {
        if (e.errors) {
          Object.keys(e.errors).forEach(key => {
            req.flash('error', `${e.errors[key].message}`);
            res.redirect(req.session.backUrl);
          });
        } else {
          next(e);
        }
      });
  });

  return router;
};