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
  Product.findById(productId, (product) => {
    if (product) {
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        product,
      });
    } else {
      res.status(404).render("404", { pageTitle: "Page Not Found", path: "" });
    }
  });
};

exports.postAddProduct = (req, res) => {
  const { title, imageUrl, price, description } = req.body;
  const product = new Product(title, imageUrl, price, description);
  product
    .save()
    .then((result) => {
      console.log(result);
      res.redirect("/admin/products");
    })
    .catch(console.log);
};

exports.postEditProduct = (req, res) => {
  const { title, imageUrl, price, description, id } = req.body;
  const product = new Product(id, title, imageUrl, price, description);
  product.save(() => res.redirect("/admin/products"));
};

exports.deleteProduct = (req, res) => {
  const { id } = req.body;
  Product.deleteById(id, () => res.redirect("/admin/products"));
};

exports.getAdminProducts = (req, res) => {
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render("admin/products", {
        pageTitle: "Admin Products List",
        path: "/admin/products",
        products: rows,
      });
    })
    .catch(console.log);
};
