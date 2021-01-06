const User = require("./../models/user");

exports.getLogin = (req, res) => {
  console.log(req.session.isLoggedIn);
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postLogin = (req, res) => {
  User.findById("5ff3415ae1031f26643137da")
    .then((user) => {
      req.session.user = user;
      req.session.isLoggedIn = true;
      req.session.save((err) => {
        if (err) {
          return console.log(err);
        }
        res.redirect("/");
      });
    })
    .catch(console.log);
};

exports.postSignup = (req, res) => {
  // const user = new User({
  //   name: "dro",
  //   email: "dro@dro.com",
  //   cart: {
  //     items: [],
  //     totalPrice: 0.0,
  //   },
  // });
  // user.save();
  // User.findById("5ff3415ae1031f26643137da")
  //   .then((user) => {
  //     req.session.user = user;
  //     req.session.isLoggedIn = true;
  //     req.session.save((err) => {
  //       if (err) {
  //         return console.log(err);
  //       }
  //       res.redirect("/");
  //     });
  //   })
  //   .catch(console.log);
};

exports.postLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return console.log(err);
    }
    res.redirect("/login");
  });
};
