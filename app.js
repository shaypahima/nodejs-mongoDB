import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config'

import express from 'express';
import session from 'express-session';

import connectMongoDBSession from 'connect-mongodb-session';
const MongoDBStore = connectMongoDBSession(session);

import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import User from './model/user.js';


//routes
import adminRoutes from './routes/adminRoutes.js'
import shopRoutes from './routes/shopRoutes.js'
import authRoutes from './routes/authRoutes.js'
import { get404 } from './controller/errorController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const store = new MongoDBStore({
  uri: process.env.DATABASE_URI,
  collection: 'sessions'
})


app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  store
}))

app.use(async (req, res, next) => {
  try {
    if (!req.session.user) return next()
    req.user = await User.findById(req.session.user._id)
    next()
  }
  catch (error) {
    console.log(error);
  }
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes)
app.use(get404)


const start = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI)
    console.log('Connected to DB server successfully!');

    app.listen(3000, () => console.log('Server started on port 3000'))

  } catch (error) {
    console.log(error);
  }
}
await start()

