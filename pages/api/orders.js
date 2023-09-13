import mongoose from "mongoose";
import {mongooseConnect} from "@/lib/mongoose";
import {order} from "@/models/order";

export default async function handler(req,res){
    await mongooseConnect();
    res.json(await order.find().sort({createdAt:-1}));
}