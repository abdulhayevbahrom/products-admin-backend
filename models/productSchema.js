const Joi = require('joi')
const { Schema, model } = require('mongoose')

const productSchema = new Schema({
    title: { 
        type: String, 
        required: true 
    },
    price:{
        old:{
            type:Number, 
            required:true
        },
        final:{
            type:Number
        }
    },
    url: {
        type: Array, 
        required: true
    },
    category: { 
        type: String, 
        required: true 
    },
    star:{
        type:Number
    }
})

const Products = model("product", productSchema)

const validateProduct = (body) => {
    const schema = Joi.object({
        title: Joi.string().required().min(2),
        price: Joi.object({old:Joi.number().required(), final:Joi.number()}).required(),
        url: Joi.array().required().min(1),
        category: Joi.string().required().min(2),
        star:Joi.number()
    })
    return schema.validate(body)
}

module.exports = { validateProduct, Products }