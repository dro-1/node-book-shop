const User = require("./../models/user");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res) => {
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.getSignup = (req, res) => {
  res.render("auth/signup", {
    pageTitle: "Signup",
    path: "/signup",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postLogin = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.redirect("/login");
      } else {
        bcrypt
          .compare(password, user.password)
          .then((result) => {
            if (!result) {
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
