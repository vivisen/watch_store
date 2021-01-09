const fs = require("fs");
const path = require("path");

const PDFDocument = require("pdfkit");

const Products = require("../model/products");
const Orders = require("../model/orders");
const paginationGenerator = require("../utils/paginatio");
const rootDir = require("../utils/rooDir");

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
module.exports.getShop = async (req, res, next) => {
  const { page = 1 } = req.query;
  try {
    const perPage = 8;
    const productsLength = await Products.countDocuments();
    // create paginations
    const paginations = paginationGenerator(productsLength, perPage);
    const products = await Products.find()
      .skip((page - 1) * perPage)
      .limit(perPage);
    res.render("shop", {
      title: "Store Shop || All Products",
      products,
      paginations,
      createPagination: productsLength > 8,
      firstIndex: paginations[0],
      finalIndex: paginations[paginations.length - 1],
      activeIndex: page,
    });
  } catch (err) {
    console.log(err);
    return next(err);
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

// get invoice
module.exports.getInvoice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Orders.findOne({ _id: id });
    if (
      req.user.isAdmin ||
      order.user.userId.toString() === req.user._id.toString()
    ) {
      const invoiceName = `invoice-${id}.pdf`;
      const invoicePath = path.join(rootDir, "data", "invoices", invoiceName);
      const doc = new PDFDocument().font(
        "public/rajdhani/Rajdhani-Semibold.ttf"
      );
      const computinPrices = order.products.map((p) => p.price * p.qty);
      const totalPrice = computinPrices.reduce((x, y) => {
        return x + y;
      }, 0);
      doc.fontSize(35).fillColor("#4cb2ff").text("Uwen Store");
      doc.text("----------------------------------------");
      doc.fontSize(30).fillColor("#2c2c44").text("Your Invoice: ");
      order.products.forEach((p, index) => {
        doc
          .fontSize(14)
          .text(
            `${index + 1} - Name: ${p.pName} - Quantity: ${p.qty} - Price: ${
              p.price
            }$ - Final Price: ${p.price * p.qty}`
          );
      });
      doc.text("------------------------------------------------------------");
      doc.fillColor("#63d492").text(`User invoicing: @${order.user.name}`);
      doc.fillColor("#1e1e2c").text(`Total Price: ${totalPrice}$`);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `inline; filename=${invoiceName}`);
      doc.pipe(fs.createWriteStream(invoicePath));
      doc.pipe(res);
      return doc.end();
    } else {
      return next(new Error("Unauthorizied!"));
    }
  } catch (err) {
    console.log(err);
    return next(err);
  }
};