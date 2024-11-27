import Product from "../model/product.js"


export const getIndex = async (req, res) => {

  const products = await Product.find({})
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
  const products = await Product.find({})
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
    const product = await Product.findById(productId)
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
    const products = await req.user.getCartItems()

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
    const { payload } = req.body;
    await req.user.addToCart(payload)
    res.redirect('/cart')
  
  } catch (error) {
    console.log(error);
  }
}

export const postCartDeleteProduct = async (req, res) => {
  try {
    const { payload } = req.body;
    console.log(req.body);
    await req.user.deleteCartItem(payload)
    res.redirect('/cart')

  } catch (error) {
    console.log(error);
  }
}

export const getOrders = async (req, res) => {
  try {
    const userOrders = req.user.orders.map(order =>{
      const orderDetails = order.toObject()
      return {
        orderId: orderDetails._id.toString(),
        totalPrice: orderDetails.totalPrice,
        createdAt: orderDetails.createdAt.toLocaleDateString()
      }
    })

    res.render('shop/orders', {
      pageTitle: 'User Orders',
      path: '/orders',
      userOrders,
      user: req.user
    })
  } catch (error) {
    console.log(error);
  }
}

export const getOrderDetail = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await req.user.getOrderById(orderId)

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
    const products = await req.user.getCartItems()

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
    req.user.addOrder()
    res.redirect('/cart')
  } catch (error) {
    console.log(error);
  }
}



