const products = [];

exports.getAddProducts = (req, res) => {
  res.render("add-product", {
    pageTitle: "Add Products",
    path: "/admin/add-product",
  });
};

exports.postAddProducts = (req, res) => {
  products.push({ title: req.body.title });
  res.redirect("/");
};

exports.getProducts = (req, res, next) => {
  res.render("shop", {
    pageTitle: "Shop",
    path: "/",
    products,
  });
};
