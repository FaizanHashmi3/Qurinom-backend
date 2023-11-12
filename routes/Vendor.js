const express = require('express');
const { registerVendor, loginVendor } = require('../controllers/Vendor.controller');

const app = express();

app.post('/register', registerVendor);
app.post('/login', loginVendor);

module.exports = app;