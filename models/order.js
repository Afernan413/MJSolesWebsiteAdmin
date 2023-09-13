import {model, models, Schema} from "mongoose";

const orderSchema = new Schema({
    line_items:Object,
    name:String,
    email:String,
    city:String,
    zipcode:String,
    streetAddress:String,
    country:String,
    paid:Boolean,
}, {
    timestamps : true,
})

export const order = models?.order || model('order',orderSchema)