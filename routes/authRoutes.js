import { Router } from "express";
import { 
  getLogin,
  getSignup,
  postLogin,
  postLogout,
  postSignup
 } from "../controller/authController.js";


const router = Router();

router.get('/login', getLogin)

router.get('/signup', getSignup)

router.post('/signup',postSignup)

router.post('/login', postLogin)

router.post('/logout', postLogout)


export default router