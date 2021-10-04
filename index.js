const express = require('express')
const hbs = require('hbs')
const wax = require('wax-on') // for {{#extends}} {{#block}}
require('dotenv').config();
const session = require('express-session');
const flash = require('connect-flash')

// Create an express application
let app = express(); 

// set the view engine
app.set('view engine', 'hbs');

// set the static folder (we find browser-based JavaScript, css files and images)
app.use(express.static('public'))

// setup handlebars to use wax-on (so that we can use template inheritance)
wax.on(hbs.handlebars);
// tell wax-on where to find the layout files
wax.setLayoutPath('./views/layouts')

// enable forms
app.use(express.urlencoded({
    extended: false
}))

// setup sessions
app.use(session({
    'secret': 'keyboard cat',
    'resave': false,
    'saveUninitialized': true
}))

// setup flash
app.use(flash())

// register flash middleware to display the flashed messages inside our hbs files
app.use(function(req,res,next){
    // we are adding to the hbs template variables named
    // success_messages and error_messages
    // they will be assigned the values of the flashed messages 'success_messages' and 'error_messages'
    res.locals.success_messages = req.flash('success_messages');
    res.locals.error_messages = req.flash('error_messages')
    next();
})

const landingRoutes = require('./routes/landing')
const productRoutes = require('./routes/products')

async function main() {

    app.use('/', landingRoutes);
    app.use('/products', productRoutes);
}

main();

app.listen(3000, function(){
    console.log("Server has started")
})