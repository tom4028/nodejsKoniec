const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    _id:Schema.Types.ObjectId,
    name:String,
    password:String,
    authId:String,
    shoppingCart:Array
})

module.exports = mongoose.model("User",userSchema);