const Products = require("../model/products");

// index page controller
module.exports.indexPage = async (req, res) => {
  const products = await Products.find();
  res.render("index", {
    title: "Rozmatik Kala",
    products,
    authentication: req.session.isLoggined,
  });
};

// all products page controller
module.exports.allProducts = (req, res) => {
  res.render("all-products", {
    title: "All Products",
    authentication: req.session.isLoggined,
  });
};

module.exports.addToCart = async (req, res) => {
  try {
    const { _id } = await Products.findById(req.body.productId.trim());
    await req.user.addToCart(_id, req.user);
    res.redirect("/");
  } catch (err) {
    console.log("add to cart ERROR => ", err);
  }
};

module.exports.cart = async (req, res) => {
  try {
    const products = await req.user
      .populate("cart.items.productId")
      .execPopulate();
    const prices = products.cart.items.map((p) => p.productId.price * p.qty);
    const totalPrice = prices.reduce((x, y) => x + y, 0);
    res.render("cart", {
      title: "Cart | Watch Store",
      products: products.cart.items,
      totalPrice,
      authentication: req.session.isLoggined,
    });
  } catch (err) {
    console.log("get cart page ERROR => ", err);
  }
};

module.exports.deleteCartProduct = async (req, res) => {
  const { productId: id } = req.body;
  try {
    await req.user.deleteFromCart(id, req.user);
    res.redirect("/cart");
  } catch (err) {
    console.log("delete product ERROR => ", err);
  }
};

module.exports.productDetails = async (req, res) => {
  const { productId } = req.body;
  try {
    const product = await Products.findById(productId);
    res.render("product-details", {
      title: "PRODUCT DETAILS",
      product,
      authentication: req.session.isLoggined,
    });
  } catch (err) {
    console.log("get product details ERROR => ", err);
  }
};

// get orders
module.exports.orders = async (req, res) => {
  const orders = await req.user.getOrders(req.user);
  res.render("orders", {
    title: "ORDERS",
    orders,
    authentication: req.session.isLoggined,
  });
};

// post orders
module.exports.addOrders = async (req, res) => {
  try {
    await req.user.addOrders(req.user);
    res.redirect("/cart");
  } catch (err) {
    console.log("add to orders ERROR => ", err);
  }
};
