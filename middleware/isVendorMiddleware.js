const isVendor = (req, res, next) => {
    const id = req.locals.vendorId;
    if (id) {
      next();
    } else {
      return res.send({
        message: "only vendors are allowed to access this page",
      });
    }
  };
  
  module.exports = { isVendor };