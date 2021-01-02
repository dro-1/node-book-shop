const Product = require("./../models/product");

exports.getAddProduct = (req, res) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    product: {},
  });
};

exports.getEditProduct = (req, res) => {
  const { productId } = req.params;
  Product.findByPk(productId)
    .then(({ dataValues }) => {
      if (dataValues) {
        console.log(dataValues);
        res.render("admin/edit-product", {
          pageTitle: "Edit Product",
          path: "/admin/edit-product",
          product: dataValues,
        });
      } else {
        res
          .status(404)
          .render("404", { pageTitle: "Page Not Found", path: "" });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postAddProduct = (req, res) => {
  const { title, imageUrl, price, description } = req.body;
  Product.create({
    title,
    imageUrl,
    price,
    description,
  })
    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch(console.log);
};

exports.postEditProduct = (req, res) => {
  const { title, imageUrl, price, description, id } = req.body;
  Product.findByPk(id)
    .then((resp) => {
      if (resp.dataValues) {
        resp.title = title;
        resp.imageUrl = imageUrl;
        resp.price = price;
        resp.description = description;
        return resp.save();
      } else {
        res
          .status(404)
          .render("404", { pageTitle: "Page Not Found", path: "" });
      }
    })
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.deleteProduct = (req, res) => {
  const { id } = req.body;
  Product.destroy({
    where: {
      id,
    },
  })
    .then((resp) => {
      if (resp === 1) {
        res.redirect("/admin/products");
      }
    })
    .catch(console.log);
};

exports.getAdminProducts = (req, res) => {
  Product.findAll()
    .then((resp) => {
      const products = resp.map((re) => ({ ...re.dataValues }));
      res.render("admin/products", {
        pageTitle: "Admin Products List",
        path: "/admin/products",
        products,
      });
    })
    .catch(console.log);
};
