import Layout from "@/components/layout";
import {useState} from "react";
import axios from "axios";
import {redirect} from "next/navigation";
import {Router, useRouter} from "next/router";
import ProductForm from "@/components/ProductForm";

export default function NewProduct(){
    return (
        <Layout>
            <h1>New Product</h1>
            <ProductForm/>
        </Layout>
    )
}