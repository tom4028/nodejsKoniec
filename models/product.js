const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const photoSchema = new Schema({
    _id:Schema.Types.ObjectId,
    name:String,
    description:String,
    authId:String,
    price:Number
    
})

module.exports = mongoose.model("Product",photoSchema);