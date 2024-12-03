import { Router } from "express";
import {
  getIndex,
  getProduct,
  getProducts,
  getCart,
  getCheckout,
  getOrderDetail,
  getOrders,
  postCart,
  postCartDeleteProduct,
  postCheckout
} from "../controller/shopController.js";
import { isAuth } from "../middleware/auth-middlewares.js";




const router = Router()

router.get('/', getIndex);

router.get('/products', getProducts);

router.get('/products/:productId', getProduct);

router.get('/cart', isAuth, getCart);

router.post('/cart', isAuth, postCart);

router.post('/cart-delete-item', postCartDeleteProduct);

router.get('/orders', isAuth, getOrders);

router.post('/create-order', postCheckout)

router.get('/orders/:orderId', isAuth, getOrderDetail);

router.get('/checkout', isAuth, getCheckout);

export default router