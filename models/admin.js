const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    _id:Schema.Types.ObjectId,
    name:String,
    password:String,
    adminAuthId:String
})

module.exports = mongoose.model("Admin",adminSchema);