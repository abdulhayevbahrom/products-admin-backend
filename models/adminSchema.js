const Joi = require("joi")
const {Schema, model} = require("mongoose")

const adminSchema = new Schema({
   fullname: {
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
   },
    gender: {
        type: String,
        required: true
    },
   username:{
    type: String,
    required: true
   },
   password:{
    type: String,
    required: true
   },
   isAdmin:{
    type: Boolean,
    required: true
   },
   
})

const Admins = model("admin",adminSchema )

const validateAdmin = (body) => {
    const schema = Joi.object({
        fullname: Joi.object({
            fname: Joi.string().required(),
            lname: Joi.string().required()
        }),
        gender: Joi.string().required(),
        username: Joi.string().required(),
        password: Joi.string().required(),
        isAdmin: Joi.boolean().required(),

    })

    return schema.validate(body)
}

module.exports = {Admins, validateAdmin}