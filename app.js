import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config'

import express from 'express';
import bodyParser from 'body-parser';

import {mongoConnect} from './util/database.js';
import User from './model/user.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


//routes
import adminRoutes from './routes/adminRoutes.js'
import shopRoutes from './routes/shopRoutes.js'
import { get404 } from './controller/errorController.js';
import { ObjectId } from 'mongodb';

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(async (req, res, next) => {
  try {
    const user = await User.findByPk('673f8b100f44afd5d814a7d9')
    // const cart = await user.getCart()
    req.userId = user._id

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


mongoConnect(()=>{
  app.listen(3000, () => console.log('Server started on port 3000'))
})
