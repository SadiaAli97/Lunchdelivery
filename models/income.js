var mongoose=require("mongoose");




var Schema=mongoose.Schema;
var IcmSchema= new Schema({
    
    user:{type:Schema.Types.ObjectId,ref:"User"},
    amount:Number,
    date:String,
    sources:String,
});


module.exports=mongoose.model("Income",IcmSchema);