import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config'

import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import csrf from 'csurf'

import connectMongoDBSession from 'connect-mongodb-session';
const MongoDBStore = connectMongoDBSession(session);
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
//sessions will created at mongoDB 
const store = new MongoDBStore({
  uri: process.env.DATABASE_URI,
  collection: 'sessions'
})
const csrfProtection = csrf()

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

