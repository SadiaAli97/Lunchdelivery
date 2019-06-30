var mongoose=require("mongoose");




var Schema=mongoose.Schema;
var Msgschema = new mongoose.Schema({
    user:{type:Schema.Types.ObjectId,ref:"User"},
    un:String,
    name:String,
    message: String,
    response: String
});

module.exports=mongoose.model("Message",Msgschema);



