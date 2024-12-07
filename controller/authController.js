import User from "../model/user.js";

import bcrypt from "bcryptjs";

import { sendResetPasswordEmail } from "../util/emailTransporter.js";

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

    req.session.user = newUser

  } catch (error) {
    console.log(error);
  }
  res.redirect('/')

}


export const postLogout = async (req, res) => {
  try {
    await req.session.destroy()
  } catch (error) {
    console.log(error);
  }
  res.redirect('/')
}


export const getForgotPassword = (req, res) => {
  const feedback = req.flash('feedback')[0]
  res.render('auth/forgot-password', {
    pageTitle: 'Forgot Your password',
    path: '/auth/forgot-password',
    feedback
  });
}

export const postForgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    const existingUser = await User.findOne({ email })
    if (!existingUser) {
      req.flash('feedback', "User email doesn't exist!")
      return res.redirect('/forgot-password')
    }

    const token = await existingUser.setResetToken()

    if (!token) {
      console.log('no token');
      return res.redirect('/forgot-password')
    }
    await sendResetPasswordEmail(email, token)

    res.render('auth/successful-message', {
      pageTitle: 'Reset request was sent!',
      path: '/auth/successful-message',
      messageTitle:"A reset request was sent!",
      messageContent:"Please check your inbox for further steps.",

    })
  } catch (error) {
    console.log(error);
  }

}

export const getResetPassword = async (req, res) => {
  const feedback = req.flash('feedback')[0]
  const { userKey: resetPassKey } = req.params
  const user = await User.findOne({ resetPassKey })

  if (!user) {
    console.log('expired link');
    return res.redirect('/')
  }

  req.session.resetPassUser = user

  res.render('auth/reset-password-form', {
    pageTitle: 'Reset Your Password',
    path: '/auth/reset-password-form',
    feedback,
  });

}

export const postResetPassword = async (req, res) => {
  const { resetPassUser } = req;
  const { newPassword, confirmNewPassword } = req.body
  if (newPassword !== confirmNewPassword) {
    console.log('Passwords are not identical!')
    req.flash('feedback', 'Passwords are not identical!')
    return res.redirect(`reset-password/${resetPassUser.resetPassKey}`)
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 12)

  resetPassUser.password = hashedNewPassword
  resetPassUser.resetPassKey = undefined
  await resetPassUser.save()
  
  await req.session.destroy()

  return res.render('auth/successful-message', {
      pageTitle: 'Password successfully updated!',
      path: '/auth/successful-message',
      messageTitle:"Password successfully updated!",
      messageContent:"Now you can login with the new password.",
  })


}