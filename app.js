import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config'

import express from 'express';
import session from 'express-session';
import connectMongoDBSession from 'connect-mongodb-session';
import bodyParser from 'body-parser';
import flash from 'connect-flash'
import csrf from 'csurf'

import mongoose from 'mongoose';

//routes
import adminRoutes from './routes/adminRoutes.js'
import shopRoutes from './routes/shopRoutes.js'
import authRoutes from './routes/authRoutes.js'
import { get404 } from './controller/errorController.js';
import { getConnectedUser } from './middleware/auth-middlewares.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const csrfProtection = csrf()

//sessions will created at mongoDB 
const MongoDBStore = connectMongoDBSession(session);
const store = new MongoDBStore({
  uri: process.env.DATABASE_URI,
  collection: 'sessions'
})
//view
app.set('view engine', 'ejs');
app.set('views', 'views');

//middlewares

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

//create session
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  store
}))

app.use(flash())

app.use(csrfProtection)

app.use(getConnectedUser)

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.user,
  res.locals.csrfToken = req.csrfToken()
  next();
})

//routes
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

