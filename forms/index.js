const forms = require('forms');

// create some shortcuts
const fields = forms.fields;
const validators = forms.validators;
const widgets = forms.widgets;

// attribute: https://github.com/caolan/forms
var bootstrapField = function (name, object) {
    if (!Array.isArray(object.widget.classes)) { object.widget.classes = []; }

    if (object.widget.classes.indexOf('form-control') === -1) {
        object.widget.classes.push('form-control');
    }

    var validationclass = object.value && !object.error ? 'is-valid' : '';
    validationclass = object.error ? 'is-invalid' : validationclass;
    if (validationclass) {
        object.widget.classes.push(validationclass);
    }

    var label = object.labelHTML(name);
    var error = object.error ? '<div class="invalid-feedback">' + object.error + '</div>' : '';

    var widget = object.widget.toHTML(name, object);
    return '<div class="form-group">' + label + widget + error + '</div>';
};

// the first argument will be an array of categories
const createProductForm = function(categories, tags) {
    return forms.create({
        // <input type="text" name="productName" etc. >
        "name": fields.string({
            required: true,
            errorAfterField: true, 
        }),
        "cost": fields.string({
            required: true,
            errorAfterField: true,
            validators:[validators.integer(), validators.min(0)]
        }),
        "description": fields.string({
            required: true,
            errorAfterField: true
        }),
        "category_id": fields.string({
            label:'Category',
            required: true,
            errorAfterField: true,
            widget: widgets.select(), // indicate we want a <select></select> to fill in the field
            choices: categories
        }),
        "tags": fields.string({
            required: true,
            erorrAfterField: true,
            widget: widgets.multipleSelect(),
            choices: tags
        })
    })
}


const createRegistrationForm = () => {
    return forms.create({
        'username': fields.string({
            'required': true,
            'errorAfterField': true,            
        }),
        'email': fields.string({
            'required': true,
            'errorAfterField': true
        }),
        'password': fields.string({
            'required': true,
            'errorAfterField': true,
            'widget': widgets.password()
        }),
        'confirm_password': fields.string({
            'required': true,
            'errorAfterField': true,
            'widget': widgets.password(),
            'validators':[ validators.matchField('password')]
        })
    })
}

module.exports = { createProductForm, createRegistrationForm, bootstrapField}