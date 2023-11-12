const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        require: true,
    },
    price: {
        type: Number,
        require: true,
    },
    inStock: {
        type: Boolean,
        require: true,
    },
    category: {
        type: String,
        require: true,
    },
    vendorId: {
        type: String,
        require: true,
    },
    vendorName: {
        type: String,
        require: true,
    },
})

module.exports = mongoose.model('products', ProductSchema);