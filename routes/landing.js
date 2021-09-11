const express = require('express')
const router = express.Router(); // create a router object from express

router.get('', (req,res)=>{
    res.render("landing/welcome");
})

router.get('/about-us', (req,res)=>{
    res.send("<h1>About Us</h1>")
})

router.get('/contact-us', (req,res)=>{
    res.send("<h1>Contact us</h1>")
})

// export out the router object so that other javascript files
// can use it
module.exports = router;