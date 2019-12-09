//jshint esversion:8
const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const User = require('../models/User');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('index'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    user: req.user
  })
);

router.get("/edit", ensureAuthenticated, (req, res)=>{ 
    res.render("edit",{user: req.user});
});
router.post("/edit", ensureAuthenticated, (req,res)=>{
  const {email, name}=req.body;
  const updateName = {
    _id: req.body.id
  };
  const updateItem = {$set:{ name: name, email:email }};
  User.updateOne(updateName,updateItem, (err)=>{
    if(err){
      console.log(err);
    }else{
      res.redirect('/setting');
    }
    
  });
});

router.post("/edit", (req, res)=>{
  const {name, email} = req.body;

  if(!name || !email){
    req.flash("error_msg","Enter all fields");
  }
  if(name || email){
    res.render("edit", {name, email});
  }
  User.findOne({name:name}).then(user =>{
    User.updateOne({name:name},{$set:{name:name, email:email}},(err)=>{
      if(err){
        console.log(err);
      }else{
        res.redirect("/setting");
      }
    });
  }).catch(err => console.log(err));
});

//setting
router.get("/setting", ensureAuthenticated, (req, res) => res.render("setting", {user:req.user}));

router.post("/delete", (req, res) => {
  const deleteItem = req.body.id;
  User.findByIdAndDelete(deleteItem, (err) => {
    if (!err) {
      console.log("Successfully deleted");
      console.log(deleteItem);
      
      res.redirect("/users/login");
    } else {
      console.log(err);
    }
  });
});

module.exports = router;
