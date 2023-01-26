const express = require('express')
const app = express()
const cors = require("cors")
const {connect, set}= require('mongoose')
const {config} = require('dotenv')

config()
app.use(cors())
app.use(express.json())

// ========= MONGO DB =======
set('strictQuery', true);
connect(process.env.MONGODB_URL)
    .then(res=>console.log('MongoDB is connect'))
    .catch(res=>console.log('MongoDB is not connect'))

// ========= HOME =======
app.get('/', async(req,res)=>{
    res.send('app is runnung')
})

// ========= ROUTES =======
const products = require('./routes/products')
const admins = require('./routes/admins')

// ========= ENTPOINTS =======
app.use("/products", products)
app.use("/admins", admins)


// ========= PORT ADDRESS =======
const PORT = process.env.PORT || 7000
app.listen(PORT,()=>{console.log(PORT + " is listened")})