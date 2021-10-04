const express = require('express');
const router = express.Router();

// import the user model
const {
    User
} = require('../models')

// import the forms
const {
    createRegistrationForm,
    createLoginForm,
    bootstrapField
} = require('../forms');


router.get('/register', (req, res) => {
    // create an instance of the registration form
    const registerForm = createRegistrationForm();
    res.render('users/register', {
        'form': registerForm.toHTML(bootstrapField)
    })
})

router.post('/register', (req, res) => {
    const registerForm = createRegistrationForm();
    registerForm.handle(req, {
        'success': async (form) => {
            const user = new User({
                'username': form.data.username,
                'email': form.data.email,
                'password': form.data.password
            })
            await user.save();
            req.flash("success_messages", "Registration completed. You may log in now.")
            res.redirect('/users/register')
        },
        'error': (form) => {
            res.render('/users/register', {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/login', (req, res) => {
    const loginForm = createLoginForm();
    res.render('users/login', {
        'form': loginForm.toHTML(bootstrapField)
    })
})

router.post('/login', (req, res) => {

    const loginForm = createLoginForm();
    loginForm.handle(req, {
        'success': async (form) => {
            // 1. find the user by the email provided in the request
            let user = await User.where({
                'email': form.data.email
            }).fetch({
                require: false
            })

            if (!user) {
                req.flash('error_messages', "Sorry, the authentication details you have provided is not working.");
                res.redirect('/users/login')
            }

            // 2. if the user exists, check if the password matches
            // i.e the password provided by the user matches the password stored
            // in the database
            if (user.get('password') == form.data.password) {
                // if it matches, store the user in the client session
                req.session.user = {
                    'id': user.get('id'),
                    'username': user.get('username'),
                    'email': user.get('email')
                }
                req.flash('success_messages', "Welcome back, " + user.get('username'));
                res.redirect('/users/profile')
                
                // 3. if the above case is true (user exists and password matches)
                // then we save the user as logged in the session
            } else {
                // password does not match.
                req.flash('error_messages', "Sorry, the authentication details you have provided is not working.");
                res.redirect('/users/login')
            }

        },
        'error': (form) =>{
            res.render('users/login',{
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})


// profile page
router.get('/profile', (req,res)=>{
    // once an object has been saved to session, we can retrieve it
    // just by `req.session.<key`
    const user = req.session.user;

    if (!user) {
        req.flash('error_messages', "You do not have permission to access this page");
        req.redirect('/users/login')
    }

    res.render('users/profile',{
        'user':user 
    })
})

module.exports = router;