import { Router } from "express";
import {
  getLogin,
  getSignup,
  postLogin,
  postLogout,
  postSignup,
  getForgotPassword,
  getResetPassword,
  postForgotPassword,
  postResetPassword
} from "../controller/authController.js";
import { getResetPassUser } from "../middleware/auth-middlewares.js";


const router = Router();

router.get('/login', getLogin)

router.get('/signup', getSignup)

router.post('/login', postLogin)

router.post('/signup', postSignup)

router.post('/logout', postLogout)

router.get('/forgot-password', getForgotPassword)

router.post('/forgot-password', postForgotPassword)

router.get('/reset-password/:userKey', getResetPassword)

router.post('/reset-password',getResetPassUser ,postResetPassword)


export default router