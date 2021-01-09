const { Router } = require("express");

const {
  indexPage,
  allProducts,
  addToCart,
  cart,
  deleteCartProduct,
  productDetails,
  orders,
  addOrders,
  getInvoice,
  getShop,
} = require("../controller/storeController");
const isAuth = require("../middleware/is-auth");

const router = new Router();

//! @Description => Store index page
//? Routes and Method => / && GET
router.get("/", indexPage);

//! @Description => Get the all products in store
//? Routes and Method => /shop && GET
router.get("/shop", getShop);

//! @Description => All Products page
//? Routes and Method => /all-products && GET
router.get("/all-products", allProducts);

//! @Description => Get the products in the shopping cart
//? Routes and Method => /cart && GET
router.get("/cart", isAuth, cart);

//! Description => Displaying orders
//? Routes and Method => /admin/orders && GET
router.get("/orders", isAuth, orders);

//! @Description => added the products from cart in the orders database
//? Routes and Method => /admin/add-orders && GET
router.get("/add-orders", isAuth, addOrders);

//! @Description => get the order invoice
//? Routes and Method => /order/:orderId && GET
router.get("/order/:id", getInvoice);

//! @Description => Get the product details
//? Routes and Method => /product-details && POST
router.post("/product-details", productDetails);

//! @Description => Added the product to the shopping cart
//? Routes and Method => /add-to-cart && /POST
router.post("/add-to-cart", isAuth, addToCart);

//! @Description => Deleted product in the cart
//? Routes and Method => /delete-cart-product && POST
router.post("/delete-cart-product", isAuth, deleteCartProduct);

module.exports = router;
