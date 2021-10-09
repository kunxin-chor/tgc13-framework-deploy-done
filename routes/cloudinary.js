const express = require('express');
const cloudinary = require('cloudinary');

const router = express.Router();

router.get('/sign', function(req,res){
    // retrieve the parameters of the upload that we are sign
    // the parameters will include things the file size,
    // the image name and also a timestamp.
    // then cloudinary will give us a signature base
    // on the info above. The signature is only valid
    // for a limited duration and is one-use.

    const params_to_sign = JSON.parse(req.query.params_to_sign);
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    // get the signature
    const signature = cloudinary.utils.api_sign_request(params_to_sign, apiSecret);

    res.send(signature);

})

module.exports = router;