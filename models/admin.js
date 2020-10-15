const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
    name: {
        type: String
    },
    description: {
        type: String
    },
    price: {
        type: Number
    },

}, {timestamps: true})

const product = mongoose.model('product', productSchema)
module.exports = product