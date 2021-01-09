const mongoose = require("mongoose");

const Orders = require("./orders");

const UserSchema = new mongoose.Schema({
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    min: 4,
    max: 255,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    max: 255,
    trim: true,
  },
  password: {
    type: String,
    min: 8,
    max: 50,
    required: true,
    trim: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: mongoose.Schema.ObjectId,
          required: true,
          ref: "Products",
        },
        qty: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  userToken: String,
  userTokenExpiration: Date,
  createdAt: {
    type: Date,
    default: Date.now(),
    required: true,
  },
});

//! -------------My User Model Custom METHODS------------
//? ** addToCart
UserSchema.methods.addToCart = (newProductId, user) => {
  console.log("this: ", this);
  const { cart } = user;
  const findIndex = cart.items.findIndex(
    (p) => p.productId.toString() === newProductId.toString()
  );
  if (findIndex >= 0) {
    cart.items.map((p) => {
      if (p.productId.toString() === newProductId.toString()) return p.qty++;
    });
    return User.updateOne({ _id: user._id }, { cart: cart });
  } else {
    const updatedCart = {
      items: [...user.cart.items, { productId: newProductId, qty: 1 }],
    };
    return User.updateOne({ _id: user._id }, { cart: updatedCart });
  }
};

//? ** deleteFromCart
UserSchema.methods.deleteFromCart = (productId, user) => {
  let updatedCart = [...user.cart.items];
  updatedCart = updatedCart.filter(
    (p) => p.productId.toString() !== productId.toString()
  );
  return User.updateOne(
    { _id: user._id },
    { cart: { items: [...updatedCart] } }
  );
};

//? ** add orders
UserSchema.methods.addOrders = async (user) => {
  try {
    const productsFromCart = await user
      .populate("cart.items.productId")
      .execPopulate();
    const products = productsFromCart.cart.items.map((p) => {
      return {
        pId: p.productId._id,
        pName: p.productId.name,
        qty: p.qty,
        price: p.productId.price,
      };
    });
    const newOrder = {
      products: [...products],
      user: {
        userId: user._id,
        name: user.username,
      },
    };
    await User.updateOne({ _id: user._id }, { cart: { items: [] } });
    return Orders.create({ ...newOrder });
  } catch (err) {
    console.log("add order method ERROR => ", err);
  }
};

UserSchema.methods.getOrders = async (user) => {
  if (user.isAdmin) return await Orders.find();
  return await Orders.find({ "user.userId": user._id });
};

const User = mongoose.model("User", UserSchema);

module.exports = User;

// const { ObjectId } = require("mongodb");

// const { getDb } = require("../utils/database");

// class User {
//   constructor(name, username, email, password, _id, cart) {
//     this.name = name;
//     this.username = username;
//     this.email = email;
//     this.password = password;
//     this._id = _id;
//     this.cart = cart;
//   }
//   save() {
//     return getDb().collection("users").insertOne(this);
//   }
//   addToCart(productId, id, user) {
//     console.log(user);
//     const cart = user.cart;
//     const existProduct = user.cart.findIndex(
//       (product) => product._id.toString() === productId.toString()
//     );
//     if (existProduct !== -1) {
//       user.cart.forEach((product) => {
//         if (product._id.toString() === productId.toString()) {
//           return ++product.qty;
//         }
//       });
//       return getDb()
//         .collection("users")
//         .updateOne({ _id: new ObjectId(id) }, { $set: { cart: user.cart } });
//     } else {
//       cart.push({ _id: new ObjectId(productId), qty: 1 });
//       return getDb()
//         .collection("users")
//         .updateOne({ _id: new ObjectId(id) }, { $set: { cart: cart } });
//     }
//   }
//   static findById(id) {
//     return getDb()
//       .collection("users")
//       .find({ _id: new ObjectId(id.trim()) })
//       .next();
//   }
//   async getCart(id) {
//     const productsId = this.cart.map((product) => product._id);
//     const products = await getDb()
//       .collection("products")
//       .find({ _id: { $in: productsId } })
//       .toArray();
//     const finalyResult = [];
//     products.map((product) => {
//       this.cart.map((ci) => {
//         if (product._id.toString() === ci._id.toString()) {
//           return finalyResult.push({ ...product, qty: ci.qty });
//         }
//       });
//     });
//     return finalyResult;
//   }
//   deleteProductInCart(productId, userId) {
//     const updatedCart = this.cart.filter(
//       (product) => product._id.toString() !== productId.toString()
//     );
//     return getDb()
//       .collection("users")
//       .updateOne({ _id: userId }, { $set: { cart: updatedCart } });
//   }
//   async addOrders() {
//     const order = {
//       userId: this._id,
//       products: [...this.cart],
//     };
//     return getDb().collection("orders").insertOne(order);
//   }
//   async getOrders() {
//     const productsId = this.cart.map((p) => p._id);
//     const products = await getDb()
//       .collection("products")
//       .find({ _id: { $in: productsId } })
//       .toArray();
//     const ordersProducts = [];
//     products.map((p) => {
//       this.cart.map((c) => {
//         if (p._id.toString() === c._id.toString()) {
//           ordersProducts.push({ ...p, qty: c.qty });
//         }
//       });
//     });
//     return [{ userId: this._id, products: ordersProducts }];
//   }
// }

// module.exports = User;
