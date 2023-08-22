import Layout from "@/components/layout";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import axios from "axios";
import ProductForm from "@/components/ProductForm";

export default function EditProductPage(){
    const [ProductInfo, setProductInfo] = useState(null);
    const router = useRouter();
    const {id} = router.query;

    useEffect(() => {
        if(!id){
            return;
        }
        axios.get('/api/products?id='+id).then(response =>{
            setProductInfo(response.data);
        });
    }, [id]);
    return(
        <Layout>
            <h1>Edit Product</h1>
            {ProductInfo && (
                <ProductForm {...ProductInfo}/>
            )}

        </Layout>
    );
}