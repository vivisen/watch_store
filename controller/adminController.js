const { validationResult } = require("express-validator");

const Products = require("../model/products");

module.exports.addNewProduct = async (req, res) => {
  try {
    if (validationResult(req).isEmpty()) {
      const { image, name, description, price } = req.body;
      const userId = req.user._id;
      await Products.create({
        image,
        name,
        description,
        price,
        userId,
      });
      res.redirect("/");
    } else {
      const errors = validationResult(req).array();
      const [error] = errors.map((error) => error.msg);
      const elementError = errors.map((error) => error.param);
      return res.status(422).render("./dashboard/add-product", {
        title: "Add New Product",
        layout: "./layouts/dashboardLayout",
        error,
        elementError,
        oldData: { ...req.body },
      });
    }
  } catch (err) {
    return res.redirect("/500");
  }
};

module.exports.adminProducts = async (req, res) => {
  const products = await Products.find();
  res.render("admin-products", {
    title: "ADMIN | ADMIN PRODUCTS",
    products,
    authentication: req.session.isLoggined,
  });
};

// post update product
module.exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    if (validationResult(req).isEmpty()) {
      await Products.updateOne({ _id: id }, req.body);
      res.redirect("/");
    } else {
      const errors = validationResult(req).array();
      const [error] = errors.map((error) => error.msg);
      const elementError = errors.map((error) => error.param);
      return res.status(422).render("./dashboard/update-product", {
        title: "Update Product",
        layout: "./layouts/dashboardLayout",
        error,
        elementError,
        oldData: { ...req.body },
        oldId: req.params.id,
        product: [],
      });
    }
  } catch (err) {
    console.log("Update Product ERROR => ", err);
  }
};

module.exports.deleteProduct = async (req, res) => {
  try {
    await Products.deleteOne({ _id: req.params.id });
    res.redirect("/");
  } catch (err) {
    console.log("delete product ERROR => ", err);
  }
};
