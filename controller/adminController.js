
import { ObjectId } from "mongodb";
import Product from "../model/product.js";



export const getProducts = async (req, res, next) => {
  try {

    const query = { userId: req.userId }
    const products = await Product.find(query)
    products.forEach(prod => {
      prod.id = prod._id.toString()
    });

    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    })
  } catch (error) {
    console.log(error);

  }
}

export const getAddProduct = async (req, res) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
}

export const postAddProduct = async (req, res) => {
  try {
    const { title, imageUrl, price, description } = req.body
    const product = new Product(title, price, description, imageUrl, req.userId)
    await product.create()

    res.redirect('/')
  } catch (error) {
    console.log(error);
  }
}

export const getEditProduct = async (req, res) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const { productId } = req.params;

  try {
    const product = await Product.findByPk(productId)
    product.id = product._id.toString()

    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product
    });
  } catch (error) {
    console.log(error);
  }
}

export const postEditProduct = async (req, res) => {
  const { productId } = req.body;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  try {
    const product = new Product(updatedTitle, updatedPrice, updatedDesc, updatedImageUrl)
    await product.replaceOne(productId)

    res.redirect('/admin/products');
  } catch (error) {
    console.log(error);
  }

}

export const postDeleteProduct = async (req, res) => {
  try {
    const { payload: productId } = req.body
    Product.deleteOne(productId)
    res.redirect('/')

  } catch (error) {
    console.log(error);
  }
}
