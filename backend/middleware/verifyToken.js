//middleware

const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
        
    if (!token){
        return res.status(401).json('you are not authorized')
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = decoded.userId
        next()
    } catch (err){
      return res.status(401).json({error: 'invalid access'})  

    }
    
    

    
}

module.exports = verifyToken