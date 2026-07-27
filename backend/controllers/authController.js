const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const pool = require('../db')







//sign up and login function 
const signup = async (req, res) => {

try{
    const { email, password } = req.body

    const existingUser = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
    )
    
    if (existingUser.rows.length > 0){
        return res.status(400).json({ error: 'Email already in use' })
    }
    const hashedPassword = await bcrypt.hash(password, 10)

    const result = await pool.query(
        'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
        [email, hashedPassword]
    )

    res.status(201).json({message: 'Account created', user:result.rows[0]})

   
} catch (err){
    console.error(err)
    res.status(500).json({error: 'Signup failed'})
}

}




const login = async (req, res) => {

try{
    //get the email and password from the request
  const { email, password } = req.body
    //NOW WE CAN USE VARIABLES: email, password 

    //finding the user in the database by email 
  const existingUser = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  )


  //if no user exists, stop here 
  if (existingUser.rows.length === 0){
    return res.status(401).json({
        error: 'Invalid email or password'
    })
  }

  //get the user object
  const user = existingUser.rows[0]
  
  //compare the entered password with the hashed password
  const validPassword = await bcrypt.compare(
    password, user.password
  )


  //if the password doesnt match, stop here
  if (!validPassword){
    return res.status(401).json({
        error: 'Invalid email or password'
    })
  }

  //create a JWT token
  const token = jwt.sign(
    { userId: user.id},
    process.env.JWT_SECRET,
    {expiresIn: '7d'}
  )


  //send the token and user info back
  res.status(200).json({
    message: 'Login successful',
    token,
    user:{
        id: user.id,
        email: user.email
    }
  })

  
} catch (err){
    console.error(err)
    res.status(500).json({
        error:'Login failed'
    })
}

}


module.exports = { signup, login}