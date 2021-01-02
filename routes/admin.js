const { Router } = require("express");
const { body } = require("express-validator");

const {
  addNewProduct,
  adminProducts,
  updateProduct,
  deleteProduct,
} = require("../controller/adminController");
const isAuth = require("../middleware/is-auth");
const isAdmin = require("../middleware/is-Admin");

const router = new Router();

//! Description => admin products router (for DELETE and UPDATE products);
//? Method and Route => GET && /admin/products
router.get("/products", isAuth, isAdmin, adminProducts);

//! Description => Delete product
//? Method and Routes => GET && /admin/delete-product/:id

router.get("/delete-product/:id", isAuth, deleteProduct);

//! Description => Add New Product in admin route
//? Method and Route => POST && /admin/add-new-product
router.post(
  "/add-new-product",
  isAuth,
  body("image", "Image field is required").notEmpty(),
  body("name", "Please enter a valid name!").notEmpty(),
  body("description", "Please enter a valid description").notEmpty(),
  body("price", "Please enter a valid price!").notEmpty(),
  addNewProduct
);

//! Description => Update product
//? Method and Route => POST && /admin/update-product/:id
router.post(
  "/update-product/:id",
  isAuth,
  body("image", "Please add a valid image file").notEmpty(),
  body("name", "Please enter a valid name!").notEmpty(),
  body("description", "Please enter a valid description").notEmpty(),
  body("price", "Please enter a valid price!").notEmpty(),
  updateProduct
);

module.exports = router;
