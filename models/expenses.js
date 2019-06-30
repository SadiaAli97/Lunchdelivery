var mongoose=require("mongoose");


var Schema=mongoose.Schema;
var Expschema= new Schema({
    
    user:{type:Schema.Types.ObjectId,ref:"User"},
   e_amount:Number,
    e_date:String,
    e_type:String,
    e_desc:String
    
});

module.exports=mongoose.model("Expense",Expschema);