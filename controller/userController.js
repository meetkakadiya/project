const response = require('express')
const user = require('../models/user')

const alluser = async (req, res, next) => {
    try {
       
        const user = await User.findById(req.user.id);
        res.json(user);
      } catch (e) {
        res.send({ message: "Error in Fetching user" });
      }
}

module.exports = {
    alluser
}


