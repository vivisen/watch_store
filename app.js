const path = require("path");

const express = require("express");
const morgan = require("morgan");
const ejsLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const session = require("express-session");
const mongodbStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("flash");
const dotenv = require("dotenv");
const database = require("./utils/database");
const chalk = require("chalk");
const User = require("./model/user");

//! Routes and Controller
const storeRoutes = require("./routes/store");
const adminRouter = require("./routes/admin");
const authRouter = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
const { _404, _500 } = require("./controller/error");

const app = express();
const csrfProtection = csrf();

//! Configs
app.set("views", "views");
app.set("view engine", "ejs");
app.set("layout", "./layouts/mainLayout");
dotenv.config({ path: "./config/config.env" });

//** Config mongodb store for saved sessions cookie
const store = new mongodbStore({
  uri: "mongodb://localhost:27017",
  collection: "sessions",
  databaseName: "watch_store",
});

//! Custom Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(ejsLayouts);
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, maxAge: 600000 },
    store,
  })
);
app.use(async (req, res, next) => {
  try {
    if (!req.session.user) {
      return next();
    }
    const user = await User.findById(req.session.user);
    if (!user) return next();
    req.user = user;
    next();
  } catch (err) {
    console.log("find user ERROR => ", err);
  }
});
app.use(csrfProtection);
app.use((req, res, next) => {
  res.locals.authentication = req.session.isLoggined;
  res.locals.csrfToken = req.csrfToken();
  res.locals.username = req.user ? req.user.username : null;
  next();
});
app.use(flash());

//! Development configs
if (process.env.NODE_ENV === "development") {
  app.use(morgan("tiny"));
}

//! Routes
app.use(storeRoutes);
app.use("/admin", adminRouter);
app.use(authRouter);
app.use("/dashboard", dashboardRoutes);

//! 500
app.use("/500", _500);

//! 404
app.use(_404);

const { PORT } = process.env;

database
  .then(async () => {
    app.listen(PORT, () =>
      console.log(
        `Server is runing on ${process.env.NODE_ENV} mode, PORT ${PORT} `
      )
    );
  })
  .catch((err) => {
    console.log(chalk.bgRed("DATABASE CONNECTION ERROR => ", err));
  });
