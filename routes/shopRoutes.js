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




const router = Router()

router.get('/', getIndex);

router.get('/products', getProducts);

router.get('/products/:productId', getProduct);

router.get('/cart', getCart);

router.post('/cart', postCart);

router.post('/cart-delete-item', postCartDeleteProduct);

router.get('/orders', getOrders);

router.post('/create-order', postCheckout)

router.get('/orders/:orderId', getOrderDetail);

router.get('/checkout', getCheckout);

export default router