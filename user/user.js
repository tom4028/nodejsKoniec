const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

mongoose.connect('mongodb://localhost/shop',{useNewUrlParser:true});


const User = require('../models/user');
const Admin = require('../models/admin');

const authSzyfr = require('../szyfr/szyfr');


router.use(express.json());
router.use(express.urlencoded({extended:true}));


const authMiddleware = (req,res,next)=>{
    const adminId = req.get('Admin-Auth');
    
        Admin.find({adminAuthId:adminId})
        .then(result=>{
            console.log(result);
            if(result.length===0){
                res.status(404).send("Permission denied");
            }else{
                if(result[0].adminAuthId===adminId.toString()){
                    res.status(200).send("You have permission to modify products");
                    next();
                }
            }
        })
        .catch(err=>console.log(err));
    
}

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

router.post('/addUser',authMiddleware,(req,res)=>{
    const user = req.body;
    const newAuth = authSzyfr();
    const newUser = new User({
        ...user
    });
    newUser._id = new mongoose.Types.ObjectId;
    newUser.password = authSzyfr();
    newUser.authId=newAuth;
    newUser.shoppingCart = [];
    newUser.save()
    .then(result=>{
        res.status(200).send(newUser);
    })
    .catch(err=>console.log(err));;
    res.status(200).send(newUser);
});

router.delete('/deleteUser/:id',authMiddleware,(req,res)=>{
    const id = req.params.id.toString();
    
    User.deleteOne({authId:id}).then(result=>{
         
         console.log(result);
        
        res.status(200).send('User was deleted');
    }).catch(err=>console.log(err));
})



module.exports = router;