import mongoose, {model, models, Schema} from "mongoose";

const ProductSchema = new Schema({
    title: {type:String, required: true},
    description: String,
    brand: String,
    price : {type:Number, required:true},
    images : [{type:String}],
    category : {type:mongoose.Schema.Types.ObjectId, required:false, ref:'Category'},
    properties : {type:Object}
});

export const Product = models.product || model('product', ProductSchema);

