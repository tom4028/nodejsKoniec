const express = require('express');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:3000/shop',{useNewUrlParser:true});

const User = require('./models/user');
const Product = require('./models/product');
const Cart = require('./models/cart');

const app = express();

const products = require('./products/products');
const users = require('./user/user');

app.use(express.json());
app.use(express.urlencoded({extended:true}));




app.use('/products',products);
app.use('/users',users);

app.get('/',(req,res)=>{

    //console.log('ok');

    Product.find()
    .then(result=>{
        console.log(result);
        app.locals.products = [...result];
        res.send(app.locals.products);
    })
    .catch(err=>{console.log(err)});

    
});

app.get('/getshoppingCart',(req,res)=>{
    const userAuth= req.get('User-Auth');
    console.log(userAuth);
    if(userAuth){
        Cart.find({ownerId:userAuth})
        .then(result=>{
            res.status(200).send(result[0]);
        })
        .catch(err=>console.log(err));
    }else{
        res.status(404).send('Permission denied.');
    }
})

app.post('/addToShopingCart/:id',(req,res)=>{
        const id = req.params.id.toString();
        const userAuth= req.get('User-Auth');
        console.log(userAuth);
        let tempProduct = '';
        User.find({authId:userAuth})
        .then(result=>{
            tempUser = result[0];
            //console.log(tempUser);
            Product.find({authId:id})
            .then(result=>{
                tempProduct = result[0];
                console.log(tempProduct);
                Cart.find({ownerId:userAuth})
                .then(result=>{
                    //console.log(result.length);
                    if(result.length===0){
                        const newCart = new Cart();
                        newCart._id = new mongoose.Types.ObjectId;
                        newCart.ownerId = userAuth;
                        newCart.cartProducts.push(tempProduct);
                        newCart.save()
                        res.status(200).send(newCart);
                    }else{
                        let tempShoppingCart = result[0];
                        tempShoppingCart.cartProducts.push(tempProduct);
                        Cart.findOneAndUpdate({ownerId:userAuth},tempShoppingCart)
                        .then(result=>{
                            res.status(200).send('product added');
                        })
                        .catch(err=>console.log(err));   
                    }
                })
                .catch(err=>console.log(err));
            })
            .catch(err=>console.log(err));
        })
        .catch(err=>console.log(err));
});

app.put('/deleteFromShopingCart/:id',(req,res)=>{
        const id = req.params.id.toString();
        const userAuth= req.get('User-Auth');
        Cart.find({ownerId:userAuth}).then(result=>{
            if(result.length===0){
                res.status(404).send('No such a shopping cart');
            }else{
                let tempShoppingCart = result[0];
                console.log(result);
                let tempProducts = tempShoppingCart.cartProducts.filter(p => p.authId !== id);

                tempShoppingCart.cartProducts = tempProducts;
                Cart.findOneAndUpdate({ ownerId: userAuth }, tempShoppingCart).then(result => {
                    res.status(200).send('Shopping cart updated');
                }).catch(err => console.log(err));
            }
            
        }).catch(err=>console.log(err));
})

app.delete('/deleteShoppingCart',(req,res)=>{
    const userAuth = req.get('User-Auth');
    Cart.findOneAndDelete({ownerId:userAuth}).then(result=>{
        console.log('ShopiingCart deleted');
        res.status(200).send('Shopping Cart deleted');
    }).catch(err=>console.log(err));
})



app.listen(3000,()=>{
    console.log('Server is running...');
})