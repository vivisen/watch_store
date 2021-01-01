const mongoose = require("mongoose");

const ProductsSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    required: true,
  },
});

const Products = mongoose.model("Products", ProductsSchema);

module.exports = Products;

// const { ObjectId } = require("mongodb");

// const { getDb } = require("../utils/database");

// class Products {
//   constructor(image, name, description, price, userId) {
//     this.name = name;
//     this.image = image;
//     this.description = description;
//     this.price = price;
//     this.userId = userId;
//   }
//   async save() {
//     const db = getDb();
//     db.collection("products").insertOne(this);
//   }
//   static fetchAll() {
//     const db = getDb();
//     return db.collection("products").find().toArray();
//   }
//   static findById(id) {
//     const db = getDb();
//     return db
//       .collection("products")
//       .find({ _id: new ObjectId(id.trim()) })
//       .next();
//   }
//   static updateProduct(id, newData) {
//     const db = getDb();
//     return db
//       .collection("products")
//       .updateOne({ _id: new ObjectId(id.trim()) }, { $set: newData });
//   }
//   static deleteProduct(id) {
//     const db = getDb();
//     return db
//       .collection("products")
//       .deleteOne({ _id: new ObjectId(id.trim()) });
//   }
// }

// module.exports = Products;
