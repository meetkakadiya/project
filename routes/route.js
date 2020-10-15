const express = require('express')

const router = express.Router()

const adminControllers = require('../controller/adminControllers')


router.post('/addproducts', adminControllers.addProducts)
router.get('/seachProducts/:name', adminControllers.searchProducts)
router.get('/showOrder', adminControllers.showOrders)



module.exports = router