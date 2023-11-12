const Joi = require("joi");
const Product = require("../Model/Product");

const createProduct = async (req, res) => {
  const { name, description, price, inStock, category } = req.body;

  const isValid = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().min(10).max(200).required(),
    price: Joi.number().required(),
    inStock: Joi.boolean().required(),
    category: Joi.string().required(),
  }).validate(req.body);

  if (isValid.error) {
    return res.send({
      message: "Invalid input.",
      data: isValid.error
    });
  }

  try {
    let productObj = new Product({
      name,
      description,
      price,
      inStock,
      category,
      vendorName: req.locals.vendorname,
      vendorId: req.locals.vendorId,
    });

    await productObj.save();

    return res.send({
      message: "Successfully added the product",
    });
  } catch (err) {
    return res.send({
      message: "Failed to add product",
      data: err,
    });
  }
};

const getVendorProduct = async (req, res) => {
  const vendorId = req.locals.vendorId;
  let productData;

  try {
    productData = await Product.find({ vendorId });

    return res.send({
      status: 200,
      message: "successfully fetched all products",
      data: productData,
    });
  } catch (err) {
    return res.send({
      message: "Failed to fetch your products",
    });
  }
};

const updateProduct = async (req, res) => {
  const isValid = Joi.object({
    productId: Joi.string().required(),
    name: Joi.string(),
    description: Joi.string().min(10).max(200),
    inStock: Joi.boolean(),
    price: Joi.number(),
    category: Joi.string(),
  }).validate(req.body);

  if (isValid.error) {
    return res.send({
      message: "Invalid input",
    });
  }

  const { productId, name, description, inStock, price, category } = req.body;
  const vendorId = req.locals.vendorId;
  let productData;
  try {
    productData = await Product.findById(productId);
    if(!productData){
      return res.send({
        message: "Product doesn't exists"
      })
    }
    if (productData.vendorId !== vendorId) {
      return res.send({
        message: "Unauthorized to update the product",
      });
    }
  } catch (err) {
    return res.send({
      message: "Failed to fetch product",
      data: err,
    });
  }

  try {
    await Product.findByIdAndUpdate(
      { _id: productId },
      { name, description, inStock, price, category }
    );
    return res.send({
      message: "Product updated successfully",
    });
  } catch (err) {
    return res.send({
      message: "Failed to update product",
    });
  }
};

const getAllProducts = async (req, res) => {
  const { category, price, sort, inStock } = req.body;

  const isValid = Joi.object({
    inStock: Joi.boolean(),
    price: Joi.number(),
    category: Joi.string(),
    sort: Joi.string(),
  }).validate(req.body);

  if (isValid.error) {
    return res.send({
      message: "Invalid input",
    });
  }
  try {
    const filter = {};
    if(inStock === true || inStock === false) filter.inStock = inStock;
    if(price) filter.price = price;
    if(category) filter.category = category;
    const sortObj = {};
    sortObj[sort] = 1;
    
    const productsList = await Product.find(filter).sort(sortObj);
    return res.send({
      status: 200,
      message: "Fetched all products successfully",
      data: productsList,
    });
  } catch (err) {
    return res.send({
      message: "Failed to fetch products",
      data: err,
    });
  }
};

module.exports = {
  createProduct,
  getVendorProduct,
  updateProduct,
  getAllProducts,
};