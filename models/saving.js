var mongoose=require("mongoose");




var Schema=mongoose.Schema;
var SvgSchema= new Schema({
    
    user:{type:Schema.Types.ObjectId,ref:"User"},
   s_amount:Number,
    s_date:String,
    s_type:String
});

module.exports=mongoose.model("Saving",SvgSchema);