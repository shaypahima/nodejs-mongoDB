import Product from "../model/product.js"
import User from "../model/user.js"



export const isAuth = (req, res, next) => {
  if (!req.session.user) {
    res.redirect('/login')
  }
  next()
}

export const isAuthToEdit = async (req, res, next) => {
  try {
    req.productId = req.body.payload
    req.product = await Product.findById(req.productId)

    const productUserId = req.product.userId.toString()
    const userId = req.user._id.toString()

    if(productUserId !== userId ){
      return res.redirect('/')
    }
    next()

  } catch (error) {
    console.log(error);
  }
}

export const getConnectedUser = async (req, res, next) => {
  try {
    if (!req.session.user) return next()
    req.user = await User.findById(req.session.user._id)
    next()

  } catch (error) {
    console.log(error);
  }
}

export const getResetPassUser = async (req, res, next) => {
  try {
    if (!req.session.resetPassUser) return next()
    req.resetPassUser = await User.findById(req.session.resetPassUser._id)
    next()

  } catch (error) {
    console.log(error);
  }
}