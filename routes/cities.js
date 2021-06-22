const express = require('express');
const router = express.Router();
const User = require('../models/user-model');
const City = require('../models/city-model') 
const axios = require('axios');

router.post("/createcitylist", async (req, res) => {
  try {
    const {city, user} = new City(req.body);
    const checkCities = await City.find({city: city});
      if (!checkCities.length) {
        const citylist = await City.create({
          city,
          user 
        });

        console.log(`${user} searched for ${city}`)
        res.json(citylist);
        console.log(citylist)
      } else {
        console.log(`${city} already in the array`)
        res.json(`${city} already in the array`)
      }
  } catch (e) {
    res.status(500).json(`error occurred ${e}`);
    return;
  }
})

router.post("/searchedcities", async (req, res) => {
  try {
    const { city, userID } = req.body;
    const checkUserCity = await User.findById(userID);
    if(!checkUserCity.city.includes(city)) {
      const user = await User.findByIdAndUpdate(userID, { 
        $push: {
          city: city
        }
      });

    res.json(user);
    } else {
       res.json('city already included');
    }
  } catch (e) {
    res.status(500).json(`error occurred ${e}`);
    return;
  }
});

router.get("/listedcities", async (req, res) => {
  try{
    const userCities = await User.findById(req.user._id);
    const alphabetize = userCities.city.sort()
    res.json(alphabetize);
  }
  catch (e) {
    res.status(500).json(`error occurred ${e}`);
    return;
  }
})

router.put("/deletecity", async (req,res) =>{
  try{
    const { city } = req.body;
    console.log(city)
    const findUser = await User.findByIdAndUpdate(req.user._id, {
      $pull: {
        city: city
      }
    });
    console.log(`${city} should have been deleted`);
    console.log(findUser)
    res.json(findUser);
  }
  catch (e) {
    res.status(500).json(`error occurred ${e}`);
    return;
  }
})

module.exports = router; 
