const express = require('express');
const router = express.Router();
const User = require('../models/user-model');
const axios = require('axios');

router.post("/searchedcities", async (req, res) => {
  try {
    const { city, userID } = req.body;
    console.log(city);
    console.log(userID);
    user = await User.findByIdAndUpdate(userID, { 
        $push: {
          city: city
        }
      });
    res.json(user);
  } catch (e) {
    res.status(500).json(`error occurred ${e}`);
    return;
  }
});

router.get("/listedcities/:id", async (req, res) => {
  try{
    const listCities = await User.find(city, {id: req.params.id})
    console.log(listCities)
    res.json(listCities);
  }
  catch (e) {
    res.status(500).json(`error occurred ${e}`);
    return;
  }
})

module.exports = router; 