import Layout from "@/components/layout";
import Link from "next/link";
import {useEffect, useState} from "react";
import axios from "axios"

export default function products(){
    const[products,setProducts] = useState([]);
    useEffect(() => {
        axios.get('/api/products').then(response => {
            setProducts(response.data);
        });
    },[]);
    return (<Layout>

        <Link className="bg-green-700 text-white py-1 px-2 rounded-md" href= {'/products/new'}>Add new products</Link>
        <table className="basic mt-2">
            <thead>
            <tr>
                <td>Product Name</td>
                <td></td>
            </tr>
            </thead>
            <tbody>
                {products.map(product => (
                <tr key={product._id}>
                    <td>{product.title}, Product Id : {product._id}</td>
                    <td>
                        <Link href={'/products/edit/' + product._id}_>
                            Edit
                        </Link>
                        <Link href={'/products/delete/' + product._id}_>
                            Delete
                        </Link>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    </Layout>);
}