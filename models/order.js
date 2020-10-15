const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderSchema = new Schema({
  
        id: {
            type: String
        }
    
}, {timestamps: true})

const order = mongoose.model('order', orderSchema)
module.exports = order