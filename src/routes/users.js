const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');


router.get('/signin', (req, res) => {
    res.render('users/signin');
});

router.post('/singin' , passport.authenticate('local' , {
    successRedirect: '/notes' ,
    failureRedirect: '/users/signin',
    failureFlash: true
}));

router.get('/signup', (req, res) => {
    res.render('users/signup');
});

router.post('/signup', async (req, res) => {
    const { name, email, password, confirm_password } = req.body;
    const errors = [];
    if (!name || !email || !password || !confirm_password) {
        errors.push({ text: 'Please insert information' });
    }
    if (password != confirm_password) {
        errors.push({ text: 'Password do not match' });
    }
    if (password.length < 4) {
        errors.push({ text: 'Password must be at least 4 characters' });
    }
    if (errors.length > 0) {
        res.render('users/signup', { errors, name, email, password, confirm_password });
    } else {
        const emailUser =  await User.findOne( {email : email} );
        if (emailUser) {
            req.flash('error_msg' , 'The Email is already in use');
            res.redirect('/users/signup');
        } else {
            const  newUser = new User({ name , email , password});                
            newUser.password = await newUser.encrypPassword(password);
            await newUser.save((err) => {
                if(err) return console.log(err);
                req.flash('success_msg' , 'You are registered');
                res.redirect('/users/signin');
            });
        }
    }
});

router.get('/logout' , (req , res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;