const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

mongoose.connect('mongodb://localhost/shop',{useNewUrlParser:true});


const Product = require('../models/product');
const Admin = require('../models/admin');

const authSzyfr = require('../szyfr/szyfr');

router.use(express.json());
router.use(express.urlencoded({extended:true}));

const authMiddleware = (req,res,next)=>{
    const adminId = req.get('Admin-Auth');
    
        Admin.find({adminAuthId:adminId}).then(result=>{
            console.log(result);
            if(result.length===0){
                res.status(404).send("Permission denied");
            }else{
                if(result[0].adminAuthId===adminId.toString()){
                    res.status(200).send("You have permission to modify products");
                    next();
                }
            }
        }).catch(err=>console.log(err));
    
}

//app.use(authMiddleware);


router.post('/addProduct',authMiddleware,(req,res)=>{
    const product = req.body;
    const newAuth = authSzyfr();
    const newProduct = new Product({
        ...product
    });
    newProduct._id = new mongoose.Types.ObjectId;
    newProduct.authId=newAuth;
    newProduct.save()
    .then(result=>{
        res.status(200).send(newProduct);
    }).catch(err=>console.log(err));
    
});
router.delete('/deleteProduct/:id',authMiddleware,(req,res)=>{
    const id = req.params.id;
    Product.deleteOne({authId:id})
    .then(result=>{
        
        res.status(200).send('Product was deleted');
    })
    .catch(err=>console.log(err));
    
})
router.put('/updateProduct/:id',authMiddleware,(req,res)=>{
    const id = req.params.id;
    const body = req.body;
    Product.findOneAndUpdate({authId:id},{...body})
    .then(result=>{
        
        res.status(200).send('Product was updated');
    })
    .catch(err=>console.log(err));
    
})

module.exports = router