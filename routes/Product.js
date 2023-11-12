const express = require('express');
const { createProduct, updateProduct, getVendorProduct, getAllProducts } = require('../controllers/Product.controller');
const { isAuth } = require('../middleware/authMiddleware');
const { isVendor } = require('../middleware/isVendorMiddleware');
const app = express();

app.post('/createProduct', isAuth, isVendor, createProduct);
app.put('/updateProduct', isAuth, isVendor, updateProduct);
app.get('/getVendorProducts', isAuth, isVendor, getVendorProduct);
app.get('/getAllProducts', isAuth, getAllProducts);

module.exports = app;