import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config'

import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import User from './model/user.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


//routes
import adminRoutes from './routes/adminRoutes.js'
import shopRoutes from './routes/shopRoutes.js'
import { get404 } from './controller/errorController.js';

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(async (req, res, next) => {
  try {
    const user = await User.findById('67439fe477fd72b5dd92b83d')
    req.user = user
    // const cart = await user.getCart()

    // req.cart = cart

    next()
  }
  catch (error) {
    console.log(error);
  }
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(get404)


const start = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI)
    console.log('Connected to DB server successfully!');
    const user = await User.findOne()
    if(!user){
      await User.create({
        name:'Bill Gates',
        email:'billy@gmail.com',
        cart:{
          cartItem:[]
        }
      })
      console.log('User created!');
    }else{
      console.log('User already exist!');
    }
    app.listen(3000, () => console.log('Server started on port 3000'))
    
  } catch (error) {
    console.log(error);
  }
}
await start()

