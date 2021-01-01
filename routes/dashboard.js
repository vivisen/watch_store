const { Router } = require("express");

const {
  addNewProduct,
  adminPanel,
  updateProduct,
} = require("../controller/dashboardController");
const isAdmin = require("../middleware/is-Admin");
const isAuth = require("../middleware/is-auth");

const router = new Router();

//! Description => admin panel (dashboard) route
//? Method and Routes => GET && /dashboard/admin-panel
router.get("/admin-panel", isAuth, isAdmin, adminPanel);

//! Description => add new product into store
//? Method and Routes => GET && /dashboard/add-new-product
router.get("/add-new-product", isAuth, isAdmin, addNewProduct);

//! Description => UPDATE product
//? Method and Routes => GET && /dashboard/update-product
router.get("/update-product/:id", isAuth, isAdmin, updateProduct);

module.exports = router;
