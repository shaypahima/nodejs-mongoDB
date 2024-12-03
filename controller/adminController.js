import { ObjectId } from "mongodb";
import Product from "../model/product.js";


export const getProducts = async (req, res, next) => {
  try {

    const products = await Product.find({ userId: req.user })
    products.forEach(prod => {
      prod.id = prod._id.toString()
    });

    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
    })
  } catch (error) {
    console.log(error);

  }
}

export const getAddProduct = async (req, res) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  });
}

export const postAddProduct = async (req, res) => {
  try {
    const { title, imageUrl, price, description } = req.body
    await Product.create({
      title, imageUrl, price, description, userId: req.session.user
    })

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
  const ProductObjId = ObjectId.createFromHexString(productId)

  try {
    const product = await Product.findById(ProductObjId)
    product.id = productId

    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product,
    });
  } catch (error) {
    console.log(error);
  }
}

export const postEditProduct = async (req, res) => {
  const { productId } = req.body;
  const ProductObjId = ObjectId.createFromHexString(productId)

  const update = {
    title: req.body.title,
    price: req.body.price,
    imageUrl: req.body.imageUrl,
    description: req.body.description
  }
  try {
    await Product.findByIdAndUpdate(ProductObjId, update)

    res.redirect('/admin/products');
  } catch (error) {
    console.log(error);
  }

}

export const postDeleteProduct = async (req, res) => {
  try {
    const { payload: productId } = req.body
    const ProductObjId = ObjectId.createFromHexString(productId)

    await req.user.deleteCartItem(productId)
    await Product.findByIdAndDelete(ProductObjId)

    res.redirect('/')

  } catch (error) {
    console.log(error);
  }
}
