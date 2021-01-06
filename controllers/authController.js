const User = require("./../models/user");
const bcrypt = require("bcryptjs");

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
  });
};

exports.postLogin = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        req.flash("loginError", "Invalid Email/Password Combination");
        return res.redirect("/login");
      } else {
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

exports.postSignup = (req, res) => {
  const { email, password, confirmPassword } = req.body;

  User.findOne({ email })
    .then((resp) => {
      if (resp) {
        req.flash("signupError", "The user already exists");
        res.redirect("/signup");
      } else {
        bcrypt
          .hash(password, 12)
          .then((hashedPassword) => {
            console.log(hashedPassword);
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
          })
          .catch(console.log);
      }
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
