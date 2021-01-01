const Products = require("../model/products");

// index page controller
module.exports.indexPage = async (req, res, next) => {
  try {
    const products = await Products.find();
    res.render("index", {
      title: "Rozmatik Kala",
      products,
      authentication: req.session.isLoggined,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

// all products page controller
module.exports.allProducts = (req, res) => {
  res.render("all-products", {
    title: "All Products",
    authentication: req.session.isLoggined,
  });
};

module.exports.addToCart = async (req, res, next) => {
  try {
    const { _id } = await Products.findById(req.body.productId.trim());
    await req.user.addToCart(_id, req.user);
    res.redirect("/");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

module.exports.cart = async (req, res, next) => {
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
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

module.exports.deleteCartProduct = async (req, res, next) => {
  const { productId: id } = req.body;
  try {
    await req.user.deleteFromCart(id, req.user);
    res.redirect("/cart");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

module.exports.productDetails = async (req, res, next) => {
  const { productId } = req.body;
  try {
    const product = await Products.findById(productId);
    res.render("product-details", {
      title: "PRODUCT DETAILS",
      product,
      authentication: req.session.isLoggined,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

// get orders
module.exports.orders = async (req, res, next) => {
  try {
    const orders = await req.user.getOrders(req.user);
    res.render("orders", {
      title: "ORDERS",
      orders,
      authentication: req.session.isLoggined,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

// post orders
module.exports.addOrders = async (req, res, next) => {
  try {
    await req.user.addOrders(req.user);
    res.redirect("/cart");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};
