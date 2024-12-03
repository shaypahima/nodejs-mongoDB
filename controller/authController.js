import User from "../model/user.js";

import bcrypt from "bcryptjs";

export const getLogin = (req, res) => {
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/auth/login',
  });
}

export const getSignup = (req, res) => {
  res.render('auth/signup', {
    pageTitle: 'Sign-Up',
    path: '/auth/signup',
  });
}

export const postSignup = async (req, res) => {
  const { email, firstName, lastName, password, confirmPassword } = req.body
  const fullName = `${firstName} ${lastName}`
  try {
    const existingUser = await User.findOne({
      email,
      fullName
    })

    if (existingUser) {
      console.log('User already exist!')
      return res.redirect('/signup')
    }
    if (confirmPassword !== password) { throw Error('Passwords are not identical!') }
    const hashedPassword = await bcrypt.hash(password, 12)
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      cart: {
        cartItem: []
      },
      orders: [],
    })
    console.log('User created!');
    req.session.user = newUser

  } catch (error) {
    console.log(error);
  }
  res.redirect('/')

}

export const postLogin = async (req, res) => {
  try {

    const { email, password } = req.body
    const existingUser = await User.findOne({ email })

    if (!existingUser) {
      console.log("User doesn't exist!")
      return res.redirect('/login')
    }

    const correctPassword = await bcrypt.
      compare(password, existingUser.password)

    if (!correctPassword) {
      console.log("Incorrect password!")
      return res.redirect('/login')
    }

    req.session.user = existingUser
    res.redirect('/')

  } catch (error) {
    console.log(error);
  }
}

export const postLogout = async (req, res) => {
  try {
    await req.session.destroy()
  } catch (error) {
    console.log(error);
  }
  res.redirect('/')
}