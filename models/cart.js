const mongoose = require('mongoose')
const Schema = mongoose.Schema

const cartSchema = new Schema({
    productData : {
        id: {
            type: String
        },
        name: {
            type: String
        },
        description: {
            type: String
        },
        price: {
            type: Number
        },
    },  
    quantity: {
        type: Number
    }

}, {timestamps: true})

const cart = mongoose.model('cart', cartSchema)
module.exports = cart