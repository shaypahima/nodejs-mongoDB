import User from "../model/user.js";


export const getLogin = (req, res) => {

  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/auth/login',
    isAuthenticated: req.user
  });
}

export const getSignup = (req, res) => {
  res.render('auth/signup', {
    pageTitle: 'Sign-Up',
    path: '/auth/signup',
    isAuthenticated: req.user
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

  if (existingUser)
     { throw Error('User already exist!') }
  if (confirmPassword !== password) 
    { throw Error('Passwords are not identical!') }

  const newUser = await User.create({
    fullName,
    email,
    password,
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
    const existingUser = await User.findOne({
      email: req.body.email,
      password: req.body.password
    })

    if (!existingUser) { throw Error("User doesn't exist!") }
    req.session.user = existingUser

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