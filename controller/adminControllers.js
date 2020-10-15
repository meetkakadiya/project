const response = require('express')
const product = require('../models/admin')
const users = require('../models/user')
const orders = require('../models/order')


const addProducts = (req, res, next) => {
    let products = new product({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price
    })

    products.save()
    .then(response => {
        res.json({
            message : 'product added'
        })
    })
    .catch(error => {
        res.json({
            message: 'error'
        })
    })
}

const searchProducts = (req, res, next) => {
    let finddata = req.params
    console.log(finddata)
    product.find(finddata)
    .then(response => {
        res.json({
            response
        })
    })
    .catch(error => {
        res.json({
            message:'product not available'
        })
    })
}

const showOrders = (req, res, next) => {

    let allOrders = []

    users.find()
    .then(response => {
        allOrders.push({
            userId : response.userId
        })
        res.json({
            allOrders
        })
    }).catch(error => {
        res.json({
            message:'userId not found'
        })
    })
}

module.exports = {
    addProducts, searchProducts, showOrders
}