const crypto = require("crypto");

const nodemailer = require("nodemailer");
const { hash, compare } = require("bcrypt");
const { validationResult } = require("express-validator");

const User = require("../model/user");

module.exports.getSignup = async (req, res) => {
  if (req.user) return res.redirect("/");
  res.render("register", {
    title: "Sign In",
    authentication: req.session.isLoggined,
    error: "",
    oldData: {},
  });
};

module.exports.getLogin = (req, res) => {
  if (req.user) return res.redirect("/");
  res.render("./auth/login", {
    title: "Login",
    error: "",
    oldData: {},
  });
};

module.exports.postSignup = async (req, res, next) => {
  try {
    const { name, username, email, password } = req.body;
    if (validationResult(req).isEmpty()) {
      // hashed the password
      const hashedPassword = await hash(password, 12);
      const checkExistsEmail = await User.exists({ email });
      const checkExistsUsername = await User.exists({ username });
      if (!checkExistsEmail && !checkExistsUsername) {
        await User.create({
          name,
          username,
          email,
          password: hashedPassword,
          cart: { items: [] },
        });
        return res.redirect("/login");
      } else {
        return res.status(422).render("register", {
          title: "sign up user",
          error: "Sorry, this username or email already exists!",
          oldData: { name, username, email },
        });
      }
    } else {
      const [error] = validationResult(req)
        .array()
        .map((error) => error.msg);
      return res.status(422).render("register", {
        title: "sign up user",
        oldData: { name, username, email },
        error,
      });
    }
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

module.exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (validationResult(req).isEmpty()) {
      // find the user with email
      const user = await User.findOne({ email });
      // if user is exist
      if (user) {
        const hashedPassword = user.password;
        // comparing passwords => ( password in request body and user password )
        const comparingPasswords = await compare(password, hashedPassword);
        // if passwords comparing === true : create a session with isLoggined and user _id and then redirection
        if (comparingPasswords) {
          req.session.isLoggined = true;
          req.session.user = user._id;
          req.session.save(() => {
            res.redirect("/");
          });
        } else {
          return res.status(422).render("./auth/login", {
            title: "LOGIN || AUTH",
            error: "password is invalid!",
            oldData: { email },
          });
        }
      } else {
        return res.status(422).render("./auth/login", {
          title: "LOGIN || AUTH",
          error:
            "Sorry, i`m not founded user by this E-Mail, Please enter a valid E-Mail.",
          oldData: { email },
        });
      }
    } else {
      const [error] = validationResult(req)
        .array()
        .map((error) => error.msg);
      return res.status(422).render("./auth/login", {
        title: "LOGIN || AUTH",
        error,
        oldData: { email },
      });
    }
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

module.exports.postLogout = (req, res) => {
  req.session.destroy(() => {
    return res.redirect("/");
  });
};

module.exports.getResetPassword = (req, res) => {
  res.render("./auth/reset-password", {
    title: "RESET PASSWORD | AUTHENTICATION",
  });
};

module.exports.postResetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const token = crypto.randomBytes(12).toString("hex");
    const user = await User.findOne({ email });
    user.userToken = token;
    user.userTokenExpiration = Date.now() + 600000;
    await user.save();
    const transporter = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "0390e79098b695",
        pass: "d7298a80bb737b",
      },
    });
    const mailOptions = {
      from: "watchstore@info.com",
      to: email,
      subject: "Reset Password",
      html: `
      <div style="font-family: sans-serif; padding: 1em; border-radius: 5px; box-shadow: 2px 2px 8px #ccc">
        <h1>You are requested for reseting Password</h1>
        <p>For reset password, Please clicked on this link <a href="http://localhost:3000/new-password/${token}">reset password</a></p>
      </div>
      `,
    };
    await transporter.sendMail(mailOptions, (err, info) => {
      if (err) return console.log("send email ERROR => ", err);
      console.log("INFO : ", info);
    });
    res.redirect("/");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

module.exports.getNewPassword = (req, res) => {
  res.render("./auth/new-password", {
    title: "NEW PASSWORD || AUTH",
    userToken: req.params.token,
    error: "",
  });
};

module.exports.postNewPassword = async (req, res, next) => {
  try {
    if (validationResult(req).isEmpty()) {
      const { password, userToken } = req.body;
      const user = await User.findOne({
        userToken,
        userTokenExpiration: { $gt: Date.now() },
      });
      if (user) {
        const hashedNewPassword = await hash(password, 12);
        user.password = hashedNewPassword;
        user.userToken = undefined;
        user.userTokenExpiration = undefined;
        await user.save();
      }
      res.redirect("/");
    } else {
      const [error] = validationResult(req)
        .array()
        .map((error) => error.msg);
      return res.status(422).render("./auth/new-password", {
        title: "NEW PASSWORD || AUTH",
        userToken: req.params.token,
        error,
      });
    }
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};
