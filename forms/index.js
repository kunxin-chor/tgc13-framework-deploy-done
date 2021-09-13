const forms = require('forms');

// create some shortcuts
const fields = forms.fields;
const validators = forms.validators;

const createProductForm = function() {
    return forms.create({
        // <input type="text" name="productName" etc. >
        "name": fields.string({
            required: true,
            errorAfterField: true, 
        }),
        "cost": fields.string({
            required: true,
            errorAfterField: true
        }),
        "description": fields.string({
            required: true,
            errorAfterField: true
        })
    })
}

module.exports = { createProductForm}