const mongoose = require("mongoose");

const connection = mongoose.connect("mongodb://localhost:27017/watch_store", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

module.exports = connection;
