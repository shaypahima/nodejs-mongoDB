import { Router } from "express";
import {
  getEditProduct,
  getProducts,
  postDeleteProduct,
  postEditProduct,
  getAddProduct,
  postAddProduct
} from "../controller/adminController.js";
import {
  isAuth,
  isAuthToEdit
} from "../middleware/auth-middlewares.js";


const router = Router();

router.get('/products', isAuth, getProducts);

router.get('/add-product', isAuth, getAddProduct)

router.post('/add-product', postAddProduct)

router.get('/edit-product/:productId', isAuth, getEditProduct)

router.post('/edit-product', isAuth, isAuthToEdit, postEditProduct)

router.post('/delete-product', isAuth, isAuthToEdit, postDeleteProduct)

export default router