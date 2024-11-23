import { ObjectId } from "mongodb";
import Product from "../model/product.js"
import User from "../model/user.js";


export const getIndex = async (req, res) => {
  const products = await Product.findAll()
  products.forEach(prod => {
    prod.id = prod._id.toString()
  });

  res.render('shop/index', {
    prods: products,
    pageTitle: 'Shop',
    path: '/'
  })
}

export const getProducts = async (req, res) => {
  const products = await Product.findAll()
  products.forEach(prod => {
    prod.id = prod._id.toString()
  });

  res.render('shop/product-list', {
    prods: products,
    pageTitle: 'Products',
    path: '/products'
  })
}

export const getProduct = async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await Product.findByPk(productId)
    product.id = productId
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products'
    })
  } catch (error) {
    console.log(error);
  }
}

export const getCart = async (req, res) => {
  try {
    const products = await User.getUserCart(req.userId)
    console.log("products: ", products);
    res.render('shop/cart', {
      pageTitle: 'Shopping Cart',
      path: '/cart',
      products
    })
  } catch (error) {
    console.log(error);
  }
}

export const postCart = async (req, res) => {
  try {
    const { payload: productId } = req.body;
    const objProductId = ObjectId.createFromHexString(productId)
    const objUserId = req.userId
    await User.addProductToUserCart(objUserId, objProductId)
  
  } catch (error) {
    console.log(error);
  }
}


export const postCartDeleteProduct = async (req, res) => {
  const { payload: productId } = req.body;
  const { cart } = req
  try {
    const [product] = await cart.getProducts({ where: { id: productId } })
    await cart.removeProduct(product)
    res.redirect('/cart')

  } catch (error) {
    console.log(error);
  }

}

export const getOrders = async (req, res) => {
  try {
    const userOrdersObj = await req.user.getOrders()
    const { user } = req
    const userOrders = userOrdersObj.map(order => {
      const { id: orderId, totalPrice, createdAt } = order.dataValues
      return {
        orderId,
        totalPrice,
        createdAt: `${createdAt.getDate()}/${createdAt.getMonth()}/${createdAt.getFullYear()}`,
        user
      }
    })
    res.render('shop/orders', {
      pageTitle: 'User Orders',
      path: '/orders',
      userOrders
    })
  } catch (error) {
    console.log(error);
  }
}

export const getOrderDetail = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { user } = req

    const [orderObj] = await user.getOrders({ where: { id: orderId } })
    const products = await orderObj.getProducts()
    products.forEach(prod => prod.dataValues)
    const createdAt = orderObj.dataValues.createdAt

    const order = {
      products,
      createdAt: `${createdAt.getDate()}/${createdAt.getMonth()}/${createdAt.getFullYear()}`,
      totalPrice: orderObj.dataValues.totalPrice,
    }
    res.render('shop/order-detail', {
      pageTitle: 'Order Details',
      path: '/order-detail',
      order
    })
  } catch (error) {
    console.log(error);
  }
}


export const getCheckout = async (req, res) => {
  try {
    const products = await req.cart.getProducts()
    products.forEach(prod => prod.dataValues)

    res.render('shop/checkout', {
      pageTitle: 'Checkout Summary',
      path: '/checkout',
      products: products
    })
  } catch (error) {
    console.log(error);
  }
}

export const postCheckout = async (req, res) => {
  try {
    const products = await req.cart.getProducts()
    const totalPrice = products.reduce((acc, cur) => {
      return acc + cur.dataValues.price * cur.dataValues.cartItem.dataValues.quantity
    }, 0)
    const userOrder = await req.user.createOrder({ totalPrice })
    await products.forEach(async product => {
      const qty = product.dataValues.cartItem.dataValues.quantity
      await userOrder.addProduct(product, { through: { quantity: qty } })
    });

    await req.cart.setProducts([])
    res.redirect('/cart')
  } catch (error) {
    console.log(error);
  }


}



