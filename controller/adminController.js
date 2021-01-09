const fs = require("fs");
const path = require("path");

const { validationResult } = require("express-validator");

const Products = require("../model/products");
const rootDir = require("../utils/rooDir");

module.exports.addNewProduct = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(422).render("./dashboard/add-product", {
        title: "Add New Product",
        layout: "./layouts/dashboardLayout",
        error: "image field is required!",
        elementError: "image",
        oldData: { ...req.body },
      });
    } else if (validationResult(req).isEmpty()) {
      const { name, description, price } = req.body;
      const { filename: image } = req.file;
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
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
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
module.exports.updateProduct = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(422).render("./dashboard/update-product", {
        title: "Update Product",
        layout: "./layouts/dashboardLayout",
        error: "image field is required!",
        elementError: "image",
        oldData: { ...req.body },
        oldId: req.params.id,
        product: [],
      });
    } else if (validationResult(req).isEmpty()) {
      const { id } = req.params;
      const { filename: image } = req.file;
      // get old product image for delete from file
      const { image: oldImage } = await Products.findOne({ _id: id });
      fs.unlinkSync(path.join(rootDir, "public", "images", oldImage));
      // update product with new data
      await Products.updateOne({ _id: id }, { ...req.body, image });
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
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

module.exports.deleteProduct = async (req, res, next) => {
  console.log("controller run");
  try {
    const { image } = await Products.findOne({ _id: req.params.id });
    await Products.deleteOne({ _id: req.params.id });
    // get the product image and delete from files
    fs.unlinkSync(path.join(rootDir, "public", "images", image));
    return res
      .status(200)
      .json({ status: 200, message: "delete product success full!" });
  } catch (err) {
    return res
      .status(500)
      .json({ status: 500, message: "delete product failed!" });
    // const error = new Error(err);
    // error.httpStatusCode = 500;
    // return next(error);
  }
};
