import { Router } from "express";
import {
  getEditProduct,
  getProducts,
  postDeleteProduct,
  postEditProduct,
  getAddProduct,
  postAddProduct
} from "../controller/adminController.js";


const router = Router();

router.get('/products', getProducts);

router.get('/add-product', getAddProduct)

router.post('/add-product', postAddProduct)

router.get('/edit-product/:productId', getEditProduct)

router.post('/edit-product', postEditProduct)

router.post('/delete-product', postDeleteProduct)

export default router