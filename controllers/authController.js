const crypto = require("crypto");
const User = require("./../models/user");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENDGRID_KEY,
    },
  })
);

exports.getLogin = (req, res) => {
  let message = req.flash("loginError");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    isAuthenticated: req.session.isLoggedIn,
    errorMessage: message,
    oldInput: {
      email: "",
      password: "",
    },
  });
};

exports.getReset = (req, res) => {
  let message = req.flash("resetError");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset", {
    pageTitle: "Reset Password",
    path: "/reset",
    errorMessage: message,
  });
};

exports.getSignup = (req, res) => {
  let message = req.flash("signupError");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    pageTitle: "Signup",
    path: "/signup",
    isAuthenticated: req.session.isLoggedIn,
    errorMessage: message,
    oldInput: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
};

exports.postLogin = (req, res) => {
  const { email, password } = req.body;
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    errors = errors.array();
    return res.status(422).render("auth/login", {
      pageTitle: "Login",
      path: "/login",
      isAuthenticated: req.session.isLoggedIn,
      errorMessage: errors[0].msg,
      oldInput: {
        email,
        password,
      },
    });
  }
  User.findOne({ email })
    .then((user) => {
      if (user) {
        bcrypt
          .compare(password, user.password)
          .then((result) => {
            if (!result) {
              req.flash("errorMessage", "Invalid Email/Password Combination");
              res.redirect("/login");
            } else {
              req.session.user = user;
              req.session.isLoggedIn = true;
              req.session.save((err) => {
                if (err) {
                  return console.log(err);
                }
                console.log("User Signed In");
                res.redirect("/");
              });
            }
          })
          .catch(console.log);
      }
    })
    .catch(console.log);
};

exports.postReset = (req, res) => {
  const { email } = req.body;
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    User.findOne({ email })
      .then((user) => {
        if (!user) {
          req.flash("resetError", "This email is not registered");
          res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then((resp) => {
        const resetLink = `http://dro:3000/reset/${token}`;
        console.log(resetLink);
        res.redirect("/reset");
        transporter.sendMail({
          to: email,
          from: "lorddro1532@gmail.com",
          subject: "Reset Password",
          html: `
                <h2>Click the link below to reset your password</h2>
                <a href='${resetLink}'>Reset Password</a>
              `,
        });
      })
      .catch(console.log);
  });
};

exports.postSignup = (req, res) => {
  const { email, password, confirmPassword } = req.body;
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors = errors.array();
    return res.status(422).render("auth/signup", {
      pageTitle: "Signup",
      path: "/signup",
      isAuthenticated: req.session.isLoggedIn,
      errorMessage: errors[0].msg,
      oldInput: {
        email,
        password,
        confirmPassword,
      },
    });
  }

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        email,
        password: hashedPassword,
        cart: {
          items: [],
          totalPrice: 0.0,
        },
      });
      return user.save();
    })
    .then((resp) => {
      console.log("User Signed Up");
      res.redirect("/login");
      transporter.sendMail({
        to: email,
        from: "lorddro1532@gmail.com",
        subject: "Sign Up Succeeded",
        html: "<h1> You signed up successfully!!!</h1>",
      });
    })
    .catch(console.log);
};

exports.postLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return console.log(err);
    }
    res.redirect("/login");
  });
};

exports.getUpdatePassword = (req, res) => {
  let message = req.flash("updateError");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  const resetToken = req.params.resetToken;
  User.findOne({ resetToken, resetTokenExpiration: { $gt: Date.now() } })
    .then((user) => {
      if (!user) {
        req.flash("loginError", "Invalid Token");
        return res.redirect("/login");
      } else {
        res.render("auth/new-Password", {
          pageTitle: "New Password",
          path: "/reset",
          errorMessage: message,
          userId: user._id,
          passwordToken: resetToken,
        });
      }
    })
    .catch(console.log);
};

exports.postUpdatePassword = (req, res) => {
  const { userId, resetToken, password } = req.body;
  User.findOne({
    _id: userId,
    resetToken,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      if (!user) {
        req.flash("loginError", "Invalid Token");
        return res.redirect("/login");
      } else {
        bcrypt
          .hash(password, 12)
          .then((hashedPassword) => {
            user.password = hashedPassword;
            user.resetToken = undefined;
            user.resetTokenExpiration = undefined;
            return user.save();
          })
          .then((resp) => {
            console.log("Password Updated Successfully");
            //req.flash("loginError", "Invalid Token");
            return res.redirect("/login");
          })
          .catch(console.log);
      }
    })
    .catch(console.log);
};
