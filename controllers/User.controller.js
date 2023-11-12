const joi = require("joi");
const bcrypt = require("bcrypt");
const User = require("../Model/User");
const jwt = require("jsonwebtoken");

const BCRYPT_SALT = Number(process.env.BCRYPT_SALTS);

const registerUser = async (req, res) => {
  const isValid = joi
    .object({
      name: joi.string().required(),
      username: joi.string().min(3).max(25).alphanum(),
      password: joi.string().min(8).required(),
      email: joi.string().email().required(),
    })
    .validate(req.body);

  if (isValid.error) {
    return res.send({
      message: "Invalid input",
      data: isValid.error,
    });
  }
  const { name, email, username, password } = req.body;
  try {
    const userExists = await User.find({ $or: [{ username }, { email }] });
    if (userExists.length != 0) {
      return res.send({
        message: "Username / Email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT);
    const userObj = new User({
      name: name,
      username: username,
      email: email,
      password: hashedPassword,
    });

    try {
      await userObj.save();
      return res.send({
        message: "User registered successfully",
      });
    } catch (err) {
      return res.send({
        message: "Failed to save user data in DB.",
        data: err,
      });
    }
  } catch (err) {
    return res.send({
      message: "Error in validation.",
      data: err,
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const isValid = joi
    .object({
      email: joi.string().email().required(),
      password: joi.string().required(),
    })
    .validate(req.body);

  if (isValid.error) {
    return res.send({
      message: "Invalid email / Password",
      data: isValid.error,
    });
  }
  let userData;
  try {
    userData = await User.findOne({ email });
    if(!userData){
      return res.send({
        message: "No user found! please register first to login",
      });
    }
  } catch (err) {
    return res.send({
      message: "Failed to fetch user data",
      data: err,
    });
  }

  const isPasswordSame = await bcrypt.compare(password, userData.password);

  if (!isPasswordSame) {
    return res.send({
      message: "Incorrect password!",
    });
  }

  const payload = {
    username: userData.username,
    name: userData.name,
    email: userData.email,
    userId: userData._id,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET);
  return res.send({
    status: 200,
    message: "Successfully logged in",
    data: { token: token },
  });
};

module.exports = { registerUser, loginUser };