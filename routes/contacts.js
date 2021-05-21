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

router.get("/citycontacts/:city", async (req, res) => {
  try{
    const city = req.params.city
    let myFirstLevelConnections = [];
    let mySecondLevelConnections = []
    //1. show contacts based in that ciy city
    currentLoggedUser = await User.findById(req.user._id).populate("contacts")
    myFirstLevelConnections = currentLoggedUser.contacts;
    //Franco, Mariana
    let connectionsPromises = [];
    myFirstLevelConnections.forEach(async (contact) => {
      let secondLevel = contact.contacts;
      secondLevel.forEach( async (secondLevelContactId) => {
        connectionsPromises.push(User.findOne({_id : secondLevelContactId}))
      })
    })
    const foundAllSecondConnections = await Promise.all(connectionsPromises);
    const cityBased = [];
     foundAllSecondConnections.forEach((contact) => {
      if (contact.base === city) {
        cityBased.push(contact._id);
      }
    })
    let contactsIdsToReturn = [];

    cityBased.forEach((_cityBased) => {
       myFirstLevelConnections.forEach(async (contact) => {
        if (contact.contacts.indexOf(_cityBased) !== -1) {
          contactsIdsToReturn.push(contact._id)
        }
      })
    })
   
    let contactToReturnPromises = [];
    contactsIdsToReturn.forEach((contactToReturn) => {
      contactToReturnPromises.push(User.findOne({_id : contactToReturn}))
    })

    const contactsToReturn = await Promise.all(contactToReturnPromises);
    
    let usernames = [];
    contactsToReturn.forEach((user) => {
      if(!usernames.username) {
        usernames.push(user.username);
      }
    })

    res.status(200).json(usernames);
  }
    catch(e) {
    console.log("error",e)
    }
})

router.get("/citycontacts/:city/:username", async (req, res) => {
  try{
    const myContact = req.params.username
    const city = req.params.city;
    //1. show contacts based in that ciy city
    const connectionsData = await User.findOne({username: myContact}).populate("contacts")
    const cityBased = [];
    connectionsData.contacts.forEach((contact) => {
      if (contact.base === city) {
        cityBased.push(contact);
      }})
    let connections = [];
    cityBased.forEach((connection) => {
      connections.push(connection.username);
    }) 


    console.log(connections)
    res.status(200).json(connections);
  }
    catch(e) {
    console.log("error",e)
    }
})

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