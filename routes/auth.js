const { Router } = require("express");

const { body } = require("express-validator");

const {
  getLogin,
  postSignup,
  postLogin,
  postLogout,
  getSignup,
  getResetPassword,
  postResetPassword,
  getNewPassword,
  postNewPassword,
} = require("../controller/authController.js");
const isAuth = require("../middleware/is-auth.js");

const router = new Router();

//! @Description => signup page for registered new user
//? Routes and Method => /signup && GET
router.get("/signup", getSignup);

//! @Description => login page for logined the user
//? Routes and Method => /login && GET
router.get("/login", getLogin);

//! @Description => reset password page
//? Routes and Method => /reset-password && GET
router.get("/reset-password", getResetPassword);

//! @Description => get the new password page for changing user account password
//? Routes and Method => /new-password && GET
router.get("/new-password/:token", getNewPassword);

//! @Description => register user to the database and website
//? Routes and Method => /siginup && POST
router.post(
  "/signup",
  body("name", "Please enter a valid name!").isString().notEmpty(),
  body("username", "Please enter a valid username!").isString().notEmpty(),
  body("email", "Please enter a valid E-Mail!").isEmail().notEmpty(),
  body(
    "password",
    "Please enter a valid password, Password character should greeter than 8."
  )
    .isLength({ min: 8 })
    .notEmpty(),
  postSignup
);

//! @Desciption => login user
//? Routes and Method => /login && POST
router.post(
  "/login",
  body("email", "Please enter a valid E-Mail.").isEmail().notEmpty(),
  body(
    "password",
    "Please enter a valid password, password should greeter than 8 character."
  )
    .isLength({ min: 8 })
    .notEmpty(),
  postLogin
);

//! @Desciption => logout user
//? Routes and Method => /logout && POST
router.post("/logout", isAuth, postLogout);

//! @Desciption => handle reset user account password
//? Routes and Method => /reset && POST
router.post("/reset-password", postResetPassword);

//! @Desciption => handle changing user account password
//? Routes and Method => /new-password && POST
router.post(
  "/new-password",
  body(
    "password",
    "Please enter a valid password, Password character should greeter than 8."
  )
    .isLength({ min: 8 })
    .notEmpty()
    .custom((value, { req }) => {
      console.log("value => ", value);
      console.log(req.body.confirmPassword);
      if (value !== req.body.confirmPassword) {
        throw new Error("Passwords not comparing.");
      }
      return true;
    }),
  postNewPassword
);

module.exports = router;
