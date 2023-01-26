const {Router} = require("express")
const router = Router()
const {config} = require('dotenv')
config()
const {Admins,validateAdmin} = require('../models/adminSchema')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')

//=========== GET ==========
router.get('/', auth, async(req,res)=>{
    try{
        // barcha adminlarni olish 
        const alladmins = await Admins.find()
        if(!alladmins.length){
            return res.status(404).json({state: false, msg: "Data is not defined", innerData: null})
        }   
        // frontendga barcha adminlarni jonatish
        res.status(200).json({state: true, msg: "All admins", innerData: alladmins})   
    }
    catch{
        res.status(500).json({state: false, msg: "Server error", innerData: null})
    }
})

//=========== SIGN UP ==========
router.post('/', async(req,res)=>{
    try{
        // frontend dan kelgan malumotni validatsiya uchun bervoriladi
        // value => malumot muvofaqqiyatli tekshirilsa otsa   
        // error => malumotda xatolik bolsa   
        const {value, error} = validateAdmin(req.body)
        if(error){
            return res.status(400).json({state: false, msg: error.details[0].message, innerData: null})   
        }
        // username avvaldan mavjud emasligini tekshirish 
        const exactAdmin = await Admins.findOne({username: value.username})
        if (exactAdmin) {
            return res.status(400).json({state: false, msg: "username is already been taken", innerData: null})
        }
        // yangi admin yaratish
        const newAdmin = await Admins.create(value);
        const saveAdmin = await newAdmin.save();
        // yaratilgan adminni frontend ga yuborish
        res.status(201).json({state: true, msg: "Admin is created", innerData: saveAdmin})
    }
    catch{
        res.status(500).json({state: false, msg: "Server error", innerData: null})
    }
})

//=========== SIGN IN ==========
router.post('/sign-in', async(req,res)=>{
    try{
        // frontend jonatgan username va password ni olish
        const {username, password} = req.body
        // username va password bosh emasligini tekshirish
        if(!username || !password){
            return res.status(403).json({state: false, msg: "Username or password is empty", innerData: null})
        }
        // Bazada frontend dan kelgan usernamega teng username borligini tekshirish
        const exactAdmin = await Admins.findOne({username}) // => username : username
        if(!exactAdmin){
            return res.status(400).json({state: false, msg: "Username or password is incorrect", innerData: null})
        }
        // Bazadan topilgan adminni password di frontend dan kelgan password bilan birxilligini tekshirish
        if(exactAdmin.password !== password){
            return res.status(400).json({state: false, msg: "Username or password is incorrect", innerData: null})
        }
        // front uchun passwordni yashirish
        exactAdmin.password = "*".repeat(exactAdmin.password.length) 
        // Bazadan topilgan adminga TOKEN berish
        const token = jwt.sign({_id: exactAdmin._id, username, isAdmin:exactAdmin.isAdmin}, process.env.PRIVATE_KEY)
        // res.send(token)
        // Frontend ga muvofaqqiyatli yuborish
        res.status(200).json({state: true, msg: "Successfully sign in", innerData: {admin: exactAdmin, token}})
    }
    catch{
        res.status(500).json({state: false, msg: "Server error", innerData: null})
    }    
})

//=========== DELETE ==========
router.delete('/:id', auth, async (req,res)=>{
    try{
        const deleteAdmin = await Admins.findByIdAndDelete(req.params.id)
        res.status(200).json({state:true, msg:"ma'lumot o'chirildi", innerData:deleteAdmin})
    }
    catch{
        res.status(500).json({state: false, msg: "Server error", innerData: null})
    }   
})

module.exports = router