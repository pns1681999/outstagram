const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const crypto=require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config/keys');
const requireLogin = require('../middleware/requireLogin')
const nodemailer=require('nodemailer')
const sendgridTransport =require('nodemailer-sendgrid-transport')
const {SENDGRID_API,EMAIL} = require('../config/keys')
//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
const transporter=nodemailer.createTransport(sendgridTransport({
  auth:{
    api_key:"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"
  }
}))
router.get('/protected',requireLogin, (req, res) => {
    res.send('Hello');
});

router.post("/signup", (req, res) => {
  const { name, email, password,pic } = req.body;
  if (!name || !email || !password) {
    return res.status(422).json({ error: "Please add all fields" });
  }

  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res
          .status(422)
          .json({ error: "user already exists with that email" });
      }
      bcrypt.hash(password, 10).then((hashedpassword) => {
        const user = new User({
          name,
          email,
          password: hashedpassword,
          pic
        });

        user.save()
          .then((user) => {
            transporter.sendMail({
              to:user.email ,
              from :"1712743@student.hcmus.edu.vn",
              subject:"signup success",
              html:"<h1>welcome to outstagram</h1>"
            }).then(()=>{
              res.json({ message: "saved successfully" });
            })
            
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "please add email or password" });
  }
  User.findOne({ email: email })
  .populate("followers", "_id name pic")
  .populate("following", "_id name pic")
  .then((savedUser) => {
    if (!savedUser) {
        return res.status(422).json({ error: "Invalid email or password"});
    }
    bcrypt.compare(password,savedUser.password)
    .then(doMatch=>{
        if(doMatch){
          //  User.find({email:{$ne: email}}, {followers: {$nin:{_id: _id}}})
          //  .then(suggestion=>{
          //    console.log(suggestion)
          //     // res.json({ message: "successfully signed in" });
              
          //  })
          User.find({$and : [{email: {$ne:email}}, {"followers": {$ne:savedUser._id}}]})
          .select("-password")
          .then(suggestion=>{
           const token = jwt.sign({_id:savedUser._id}, JWT_SECRET);
           const {_id,name,email,followers,following,pic} = savedUser;
           res.json({token, user:{_id,name,email,followers,following,pic,suggestion}});
          })
          //  // res.json({ message: "successfully signed in" });
          //  const token = jwt.sign({_id:savedUser._id}, JWT_SECRET);
          //  const {_id,name,email,followers,following,pic} = savedUser;
          //  res.json({token, user:{_id,name,email,followers,following,pic}});
        }
        else{
            return res.status(422).json({ error: "Invalid add email or password" });
        }
    })
    .catch(err=>{
        console.log(err);
    })
  });

});
router.post('/reset-password',(req,res)=>{
  crypto.randomBytes(32,(err,buffer)=>{
    if(err){
      console.log(err)
    }
    const token=buffer.toString("hex")
    User.findOne({email:req.body.email}).then(user=>{
      if(!user)
        {return res.status(422).json({error:"User dont with this mail"})}

        user.resetToken=token
        user.expireToken=Date.now()+3600000
        user.save().then((result)=>{
          transporter.sendMail({
            to:user.email ,
            from :"1712743@student.hcmus.edu.vn",
            subject:"password reset",
            html:`<p>You  requested for password reset</p>
                  <h5>click in that <a href="http://localhost:3000/reset/${token}">link</a> to reset password</h5>`
          })
          res.json({message:"check your email"})
        })


    })

  })
})


router.post('/new-password',(req,res)=>{
  const newPassword = req.body.password
  const sentToken = req.body.token
  User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
  .then(user=>{
      if(!user){
          return res.status(422).json({error:"Try again session expired"})
      }
      bcrypt.hash(newPassword,12).then(hashedpassword=>{
         user.password = hashedpassword
         user.resetToken = undefined
         user.expireToken = undefined
         user.save().then((saveduser)=>{
             res.json({message:"password updated success"})
         })
      })
  }).catch(err=>{
      console.log(err)
  })
})

module.exports = router;
