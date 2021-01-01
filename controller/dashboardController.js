const Products = require("../model/products");

module.exports.adminPanel = (req, res) => {
  res.render("./dashboard/admin-panel", {
    title: "Dashboard | Admin Panel",
    layout: "./layouts/dashboardLayout",
  });
};

module.exports.addNewProduct = (req, res) => {
  res.render("./dashboard/add-product", {
    title: "Dashboard | Add new product",
    layout: "./layouts/dashboardLayout",
    error: "",
    elementError: [],
    oldData: undefined,
  });
};

module.exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Products.findById(id);
    res.render("./dashboard/update-product", {
      title: "DASHBOARD | update product",
      layout: "./layouts/dashboardLayout",
      product,
      elementError: [],
      error: "",
      oldData: undefined,
      oldId: undefined,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};
