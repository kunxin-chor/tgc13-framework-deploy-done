const express = require('express');
const router = express.Router();

// import the user model
const {User} = require('../models')

// import the forms
const { createRegistrationForm, bootstrapField} = require('../forms');


router.get('/register', (req,res)=>{
    // create an instance of the registration form
    const registerForm = createRegistrationForm();
    res.render('users/register', {
        'form': registerForm.toHTML(bootstrapField)
    })
})

router.post('/register', (req,res)=>{
    const registerForm = createRegistrationForm();
    registerForm.handle(req,{
        'success': async(form) => {
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

module.exports = router;

