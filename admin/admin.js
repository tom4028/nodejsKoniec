const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

mongoose.connect('mongodb://localhost/shop',{useNewUrlParser:true});



const Admin = require('../models/admin');

const authSzyfr = require('../szyfr/szyfr');

const app = express();

router.use(express.json());
router.use(express.urlencoded({extended:true}));

router.get('/',(req,res)=>{

    console.log('ok');

    User.find()
    .then(result=>{
        console.log(result);
        app.locals.users = [...result];
        res.send(app.locals.users);
    })
    .catch(err=>{console.log(err)});

    
});

router.post('/addAdmin',(req,res)=>{
    const admin = req.body;
    const newAuth = authSzyfr();
    const newAdmin = new User({
        ...admin
    });
    newAdmin._id = new mongoose.Types.ObjectId;
    newAdmin.password = authSzyfr();
    nnewAdmin.authId=newAuth;
    newAdmin.save()
    .then(result=>{
        res.status(200).send(newAdmin);
    })
    .catch(err=>console.log(err));
    
});

router.delete('/deleteAdmin/:id',(req,res)=>{
    const id = req.params.id.toString();
    
    Admin.deleteOne({authId:id})
    .then(result=>{
                 
        res.status(200).send('Admin was deleted');
    })
    .catch(err=>console.log(err));
})



module.exports = router