const {Router} = require('express')
const router = Router()
const {Products, validateProduct} = require('../models/productSchema')
const auth = require('../middleware/auth')

// ======== GET =========
router.get('/',auth , async(req,res)=>{
    try{
        let allProducts = await Products.find()
        if(!allProducts.length){
            return res.status(404).json({state:false, msg:"Ma'lumot topilmadi", innerData:allProducts})
        }
        res.status(200).json({state:true, msg:"Barcha ma'lumotlar", innerData:allProducts})
    }
    catch{
        res.status(400).json({state:false, msg:"So'rovda xatolik aniqlandi!", data:null})
    }   
})

// ======== POST =========
router.post('/', async(req,res)=>{
    try{
        const {value,error} = validateProduct(req.body)
        if(error){
            return res.status(421).json({state:false, msg:error.details[0].message, innerData:null})
        }
        const newProduct = await Products.create(value)
        const savedProduct = await newProduct.save()
        res.status(201).json({state:true, msg:"ma'lumot saqlandi", innerData:savedProduct})
    }
    catch{
        return res.status(400).json({state:false, msg:"something went wrong", innerData:null})
    }
})

// ======== PUT=========
router.put('/:_id', async(req,res)=>{
    try{
        const {value,error} = validateProduct(req.body)
        if(error){
            return res.status(421).json({state:false, msg:error.details[0].message, innerData:null})
        }
        const updated = await Products.findByIdAndUpdate(req.params._id, value)
        res.status(200).json({state:true, msg:"ma'lumot o'zgartirildi", data:updated})
    }
    catch{
        return res.status(400).json({state:false, msg:"something went wrong", innerData:null})
    }
})

// ======== DELETE =========
router.delete('/:_id', async(req,res)=>{
    try{
        const deletedProduct = await Products.findByIdAndDelete(req.params._id)
        res.status(200).json({state:true, msg:"ma'lumot o'chirildi", data:deletedProduct})
    }
    catch{
        res.status(400).json({state:false, msg:"something went wrong", data:null})
    }
})

// ======== SEARCH =========
router.get("/search", async (req, res) => {
    try {
        let allProduct = await Products.find()
        let {productName} = req.query
        let searchResult = allProduct
                                .filter(i=>i.title.toLowerCase().includes(productName.toLowerCase()))
                                // .slice(0,5)
        if(!searchResult.length){
            return res.send({ state: false, msg: "Bunday mahsulot yoq", innerData: [] })
        }
        res.send({ state: true, msg: "Searched products", innerData:searchResult})
    } catch (err) {
        res.status(400).json({ state: false, msg: "something went wrong", innerData: null })
    }
})

// ======== FILTER CATEGORY =========
router.get("/category", async (req, res) => {
    try {
        const {category} = req.query
        let allProduct = await Products.find({category:category})
        if(!allProduct.length){
            return res.send({ state: false, msg: "Bunday mahsulot yoq", innerData: [] })
        }
        res.send({ state: true, msg: "Filtered Category", innerData:allProduct})
    } catch (err) {
        res.status(400).json({ state: false, msg: "something went wrong", innerData: null })
    }
})

// ======== FILTER PRICE =========
// router.get("/price", async (req, res) => {
//     try {
//         const price = req.query
//         let allProduct = await Products.find()
//         const aa =  await allProduct.filter(i=>i.price.old > price.minValue &i.price.old > price.maxValue)
//         if(!aa.length){
//             return res.send({ state: false, msg: "Bunday mahsulot yoq", innerData: [] })
//         }
//         res.send({ state: true, msg: "Filtered Category", innerData:aa})
//     } catch (err) {
//         res.status(400).json({ state: false, msg: "something went wrong", innerData: null })
//     }
// })

module.exports = router