const express = require('express');
const router = express.Router();
const User = require('../models/user-model');
const axios = require('axios');


//list user contacts. for view contacts page. 
router.get("/mycontacts", async (req, res) => {
  try{
    const myContacts = await User.find({
      _id: req.user._id}
    ).populate('contacts')
    console.log(myContacts)
    res.json(myContacts);
  }
  catch (e) {
    res.status(500).json(`error occurred ${e}`);
    return;
  }
})

// router.get("/citycontacts," async (req, res) => {
//   try{
//     //1. find contacts based in City

//     //2. find contacts with contacts based in City
//   } catch (e) {
//     res.status(500).json(`error occurred ${e}`);
//     return;
//   }
// })

router.post("/addcontact", async (req, res) => {
  try {
    const { contact } = req.body;
    console.log(contact)
    const searchedContact = await User.findOne({username: contact})
    console.log(searchedContact)
    if (searchedContact) {
      const addContact = await User.findByIdAndUpdate(req.user._id, { 
        $push: {
          contacts: searchedContact._id
        }
      });
    res.json(addContact);
    } else {
      console.log(`${contact} does not exist`)
      res.json(`${contact} does not exist`)
    }
  } catch (e) {
      res.status(500).json(`error occurred ${e}`)
    }
})

module.exports = router; 