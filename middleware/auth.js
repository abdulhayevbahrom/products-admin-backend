const jwt = require("jsonwebtoken")
const {config} = require('dotenv')
config()

const auth =(req, res, next)=>{
    const token = req.headers.token 
    if(!token){
        res.status(400).json({state:false, mgs:"Token is not defined", innerData:null})
    }
    jwt.verify(token, process.env.PRIVATE_KEY, (err, decodet)=>{
        if(err){
            return res.status(400).json({state:false, msg:"Toekn is fake", innerData:null})
        }
        req.admin = decodet
        next()
    })
}

module.exports = auth