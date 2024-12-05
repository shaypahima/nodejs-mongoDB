import User from "../model/user.js";

import bcrypt from "bcryptjs";
import { transporter, sender, recipients } from "../util/emailTransporter.js";

export const getLogin = (req, res) => {
  const feedback = req.flash('feedback')[0]
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/auth/login',
    feedback
  });
}

export const getSignup = (req, res) => {
  const feedback = req.flash('feedback')[0]
  res.render('auth/signup', {
    pageTitle: 'Sign-Up',
    path: '/auth/signup',
    feedback
  });
}

export const postSignup = async (req, res) => {
  const { email, firstName, lastName, password, confirmPassword } = req.body
  const fullName = `${firstName} ${lastName}`
  try {
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      console.log('Email already taken!')
      req.flash('feedback', 'Email already taken!')
      return res.redirect('/signup')
    }
    if (confirmPassword !== password) {
      console.log('Passwords are not identical!')
      req.flash('feedback', 'Passwords are not identical!')
      return res.redirect('/signup')
    }
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
    const sendEmail = await transporter.sendMail({
      from: sender,
      to: recipients,
      subject: "You are awesome!",
      text: "Congrats for signing up to my website !",
      category: "Integration Test",
      sandbox: true
    })
    console.log(sendEmail);
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
      req.flash('feedback', "User doesn't exist!")
      return res.redirect('/login')
    }

    const correctPassword = await bcrypt.
      compare(password, existingUser.password)

    if (!correctPassword) {
      console.log("Incorrect password!")
      req.flash('feedback', 'Incorrect password!')
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