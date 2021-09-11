const express = require('express')
const hbs = require('hbs')
const wax = require('wax-on') // for {{#extends}} {{#block}}
require('dotenv').config();

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

const landingRoutes = require('./routes/landing')

async function main() {

    app.use('/', landingRoutes)
}

main();

app.listen(3000, function(){
    console.log("Server has started")
})