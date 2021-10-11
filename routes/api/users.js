const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

function generateToken(user, secretKey) {
    // first arg of sign if an object. This contains
    // the payload (basically the info that we want
    // to encrypt into json web token)
    let token = jwt.sign({
        'username': user.username,
        'id' : user.id,
        'email': user.email
    }, secretKey, {
        'expiresIn':'1h' // 1h is for 1hour, 1d is for 1 day, 
                         //1w for one week, 1m for one minute
    });
    return token;
}

function getHashedPassword(password){
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

const { User } = require('../../models')

router.post('/login', async function(req,res){
    // extract the email from the request's body
    // it's req.bdoy because the method is POST and the email
    // key is sent via POST
    let email = req.body.email;
    let password = req.body.password;
    let user = await User.where({
        'email': email
    }).fetch({
        'require': false
    })

    if (user && user.get('password') == getHashedPassword(password)) {
        let accessToken = generateToken(user.toJSON(), process.env.TOKEN_SECRET);
        res.send({
            'accessToken': accessToken
        })
    } else {
        res.status(401);
        res.send({
            "error":"Wrong email or password"
        })
    }
})


module.exports = router;