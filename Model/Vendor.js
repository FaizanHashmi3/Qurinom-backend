const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VendorSchema = new Schema({
    name: {
        type: String, 
        require: true,
    },
    vendorname: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true,
    }
});

module.exports = mongoose.model('vendors', VendorSchema);