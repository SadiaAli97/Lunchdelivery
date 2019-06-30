var mongoose=require("mongoose");

var Schema=mongoose.Schema;
var Accschema= new Schema({
    
    user:{type:Schema.Types.ObjectId,ref:"User"},
    ac_num:Number,
    bank_name:String,
    ac_type:String,
    ifsc:String,
    br_name:String
    
});

module.exports=mongoose.model("Account",Accschema);