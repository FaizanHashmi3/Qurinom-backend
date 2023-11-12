const Joi = require("joi");
const bcrypt = require("bcrypt");
const Vendor = require("../Model/Vendor");
const jwt = require("jsonwebtoken");

const BCRYPT_SALT = Number(process.env.BCRYPT_SALTS);

const registerVendor = async (req, res) => {
  const { name, vendorname, email, password } = req.body;

  const isValid = Joi.object({
    name: Joi.string().required(),
    vendorname: Joi.string().alphanum().required(),
    password: Joi.string().min(8).required(),
    email: Joi.string().email().required(),
  }).validate(req.body);

  if (isValid.error) {
    return res.send({
      message: "Invalid input",
      data: isValid.error,
    });
  }

  try {
    const vendorExists = await Vendor.find({
      $or: [{ vendorname }, { email }],
    });
    if (vendorExists.length > 0) {
      return res.send({
        message: "Vendor already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT);
    const vendorObj = new Vendor({
      name,
      vendorname,
      email,
      password: hashedPassword,
    });
    
    await vendorObj.save();
    
    return res.send({
      message: "Vendor registered successfully",
    });
  } catch (err) {
    return res.send({
      message: "Failed to register vendor",
      data: err,
    });
  }
};

const loginVendor = async (req, res) => {
  const { email, password } = req.body;

  const isValid = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }).validate(req.body);

  if (isValid.error) {
    return res.send({
      message: "Enter valid credentials",
      data: isValid.error,
    });
  }

  let vendorData;
  try {
    vendorData = await Vendor.findOne({ email });
    if (!vendorData) {
      return res.send({
        message: "No vendor found. Register first to login",
      });
    }
  } catch (err) {
    return res.send({
      message: "Failed to fetch vendor data",
      data: err,
    });
  }

  const isPasswordSame = await bcrypt.compare(password, vendorData.password);

  if (!isPasswordSame) {
    return res.send({
      message: "Incorrect password!",
    });
  }

  const payload = {
    vendorname: vendorData.vendorname,
    name: vendorData.name,
    email: vendorData.email,
    vendorId: vendorData._id,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET);
  return res.send({
    status: 200,
    message: "logged in successfully",
    data: { token },
  });
};

module.exports = { registerVendor, loginVendor };