import mongoose from "mongoose";
import clientPromise from "@/lib/mongodb";
import {Product} from "@/models/Product";
import {mongooseConnect} from "@/lib/mongoose";
import {model} from "mongoose";
import {isAdminReq} from "@/pages/api/auth/[...nextauth]";


export default async function handle(req,res){

    const {method} = req;
    await mongooseConnect();
    await isAdminReq(req,res)

    if(method === 'GET'){
        if(req.query?.id){
            res.json(await Product.findOne({_id:req.query.id }))
        }
        else{
            res.json(await Product.find());
        }

    }
    if(method === 'POST'){
        const {title, description,brand,price,images, category, properties} = req.body;
        const productDoc = await Product.create({
            title,description,brand,price,images,category: category || null, properties,

        })
        res.json(productDoc);
    }

    if(method === 'PUT'){
        const {title,description,brand,price,_id,images, category, properties} = req.body;
        await Product.updateOne({_id}, {title,description,brand,price,images, category: category || null, properties})
        res.json(true)
    }

    if(method === 'DELETE'){
        if(req.query?.id){
            await Product.deleteOne({_id:req.query?.id})
            res.json(true)
        }
    }
}