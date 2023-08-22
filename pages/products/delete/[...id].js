import Layout from "@/components/layout";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import axios from "axios";

export default function DeleteProductPage(){
    const router = useRouter();
    const [productInfo, setProductInfo] = useState();
    const {id} = router.query;
    useEffect(() => {
        if(!id){
            return;
        }
        axios.get('/api/products?id='+id).then(response=>{
            setProductInfo(response.data);
        })
    }, [id]);
    function goBack(){
        router.push('/products')
    }
    async function deleteProduct(){
        await axios.delete('/api/products?id='+id)
        router.push('/products')
    }
    return(
        <Layout>
           <h1>Do you really want to delete
               "{productInfo?.title}"?
           </h1>
            <div className="flex gap-2 justify-center ">
            <button
                onClick={deleteProduct}
                className="btn-primary inline-flex gap-2">
                Yes
            </button>
            <button className="btn-primary inline-flex gap-2" onClick={goBack}>
                No
            </button>
            </div>
        </Layout>
    )
}