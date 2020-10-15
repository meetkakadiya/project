const express = require("express");
const { check, validationResult} = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

const User = require("../models/user");
const auth = require('../middleware/auth')
const productData = require('../models/admin');
const cartData = require('../models/cart')
const OrderData = require('../models/order')
const { response } = require("express");

/**
 * @method - POST
 * @param - /signup
 * @description - User SignUp
 */

router.post(
    "/signup",
    [
        check("username", "Please Enter a Valid Username")
        .not()
        .isEmpty(),
        check("email", "Please enter a valid email").isEmail(),
        check("password", "Please enter a valid password").isLength({
            min: 6
        })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const {
            username,
            email,
            password
        } = req.body;
        try {
            let user = await User.findOne({
                email
            });
            if (user) {
                return res.status(400).json({
                    msg: "User Already Exists"
                });
            }

            user = new User({
                username,
                email,
                password
            });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();

            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload,
                "randomString", {
                    expiresIn: 10000
                },
                (err, token) => {
                    if (err) throw err;
                    res.status(200).json({
                        token
                    });
                }
            );
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Error in Saving");
        }
    }
);

router.post(
    "/login",
    [
      check("email", "Please enter a valid email").isEmail(),
      check("password", "Please enter a valid password").isLength({
        min: 6
      })
    ],
    async (req, res) => {
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array()
        });
      }
  
      const { email, password } = req.body;
      try {
        let user = await User.findOne({
          email
        });
        if (!user)
          return res.status(400).json({
            message: "User Not Exist"
          });
  
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
          return res.status(400).json({
            message: "Incorrect Password !"
          });
  
        const payload = {
          user: {
            id: user.id
          }
        };
  
        jwt.sign(
          payload,
          "randomString",
          {
            expiresIn: 3600
          },
          (err, token) => {
            if (err) throw err;
            res.status(200).json({
              token
            });
          }
        );
      } catch (e) {
        console.error(e);
        res.status(500).json({
          message: "Server Error"
        });
      }
    }
);

router.get('/profileData', auth, async (req, res) => {
    try {
      // request.user is getting fetched from Middleware after token authentication
      const user = await User.findById(req.user.id);
      res.json(user);
    } catch (e) {
      res.send({ message: "Error in Fetching user" });
    }
});

router.get('/productData', (req, res, next)=>{
    productData.find()
    .then(response => {
        res.json({
            response
        })
        next();
    })
    .catch(error => {
        res.json({
            message:'product not shown'
        })
    })
})

router.post('/viewProduct', (req,res,next)=>{
    let productId = req.body.productId
    productData.findById(productId)
    .then(response => {
        res.json({
            response
        })
    })
    .catch(error => {
        res.json({
            message:'product details not available'
        })
    })
})

router.post('/editprofile', (req, res, next) => {
    let userID = req.body.userID

    let userData = {
        username : req.body.username,
        email: req.body.email,
        password: req.body.password
    }

    User.findByIdAndUpdate(userID, {$set : userData})
    .then(()=>{
        res.json({
            message:'user profile updated'
        })
    })
    .catch(error => {
        res.json({
            message:'error'
        })
    })

})

router.post('/addcart', async (req, res, next)=> {
  let productId = req.body.productId
  let quantity = req.body.quantity

  let data = []

   await productData.findById(productId)
    .then(response => {
      data.push({
        productData : response,
        quantity: quantity
      })       
    }).catch(error => {
      res.json({
        message:'product not available'
      })
    })

    var cart = new cartData(data);

   await cart.save({data: data})
    .then(response => {
      res.json({
        message:'data added in cart'
      })
    })
    .catch(error => {
      res.json({
        message:'data not added in cart'
      })
    })
   
})

router.get('/showcart', (req, res,next) => {
  cartData.find()
  .then(response => {
    res.json({
      response
    })
  })
  .catch(error => {
    res.json({
      message:'cart data not shown'
    })
  })
})

router.post('/orderedproduct',async (req, res, next) => {
  let cartProductId = req.body.cartProductId

  let orderData = []

  await cartData.findById(cartProductId)
  .then(response => {
    orderData.push({
       response
    })
  }).catch(error => {
    res.json({
      message:'product not available'
    })
  })
 
  var order = new OrderData(orderData);

  await order.save({orderData: orderData})
    .then(response => {
      res.json({
        message:'item ordered'
      })
    })
    .catch(error => {
      res.json({
        message:'item not ordered'
      })
    })


})

router.get('/showorder', (req, res, next) => {
  OrderData.find()
  .then(response => {
    res.json({
      response
    })
  })
  .catch(error => {
    res.json({
      message:'ordered data not shown'
    })
  })
})


module.exports = router;