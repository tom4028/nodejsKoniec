const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const cartSchema = new Schema({
    _id:Schema.Types.ObjectId,
    ownerId:String,
    cartProducts:Array
    
})

module.exports = mongoose.model("Cart",cartSchema);