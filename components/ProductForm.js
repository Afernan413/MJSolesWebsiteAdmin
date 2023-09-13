import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import axios from "axios";
import Layout from "@/components/layout";
import {ReactSortable} from "react-sortablejs"


export default function ProductForm({
                                        _id,
                                        brand:existingBrand,
                                        title:existingTitle,
                                        description:existingDescription,
                                        price:existingPrice,
                                        images:existingImagse,
                                        category:existingCategory,
                                        properties:assignedProperties,
}) {
    const[title, setTitle] = useState(existingTitle || '');
    const[description, setDescription] = useState(existingDescription || '');
    const[brand, setBrand] = useState(existingBrand || '');
    const[price, setPrice] = useState(existingPrice || '');
    const[gotoProducts,setgotoProducts] = useState(false);
    const [images,setImages] = useState(existingImagse||[]);
    const [categories, setcategories] = useState([])
    const [category, setcategory] = useState(''||existingCategory)
    const [productProperties, setProductProperties] = useState(assignedProperties || {})
    const router = useRouter();
    const [draggingOver, setDraggingOver] = useState(false);

    const stopEvent = e => {
        e.preventDefault();
        e.stopPropagation();
    }

    const handleDragEnter = e => {
        stopEvent(e);
    };

    const handleDragLeave = e => {
        stopEvent(e);
        setDraggingOver(false);
    };

    const handleDragOver = e => {
        stopEvent(e);
        setDraggingOver(true);
    };


    useEffect(() =>{
        axios.get('/api/categories').then(result=>{
            setcategories(result.data)
        })
    }, [])
    async function saveProduct(ev) {
        ev.preventDefault();
        const data = {title, description,brand, price,images, category, properties:productProperties}

        if(_id){
            await axios.put('/api/products', {...data, _id} )
            setgotoProducts(true)

        }
        else{
            await axios.post('/api/products', data)
            setgotoProducts(true)
        }

    }

    if(gotoProducts){
        router.push('/products')

    }
    async function uploadPhoto(ev){
        const files = ev.target?.files;
        if(files?.length>0){
            const data = new FormData();
            for(const file of files){

                data.append('file',file);
            }

           const res = await axios.post('/api/upload',data);
            setImages(oldImages => {
                return[...oldImages, ...res.data.links];
            })

        }

    }

    async function handleDrop(ev){
        stopEvent(ev);
        setDraggingOver(false);
        const files = ev.dataTransfer.files;
        if(files?.length>0){
            const data = new FormData();
            for(const file of files){

                data.append('file',file);
            }

            const res = await axios.post('/api/upload',data);
            setImages(oldImages => {
                return[...oldImages, ...res.data.links];
            })

        }
    }
    function updateImagesOrder(images){
        setImages(images)
    }

    const propertiestoFill = []
    if(categories.length > 0 && category){
        let selectedCatInfo = categories.find(({_id}) => _id===category)
        propertiestoFill.push(...selectedCatInfo.properties)
        while(selectedCatInfo?.parent?._id){
            const parentcat = categories.find(({_id}) => _id===selectedCatInfo?.parent?._id)
            propertiestoFill.push(...parentcat.properties)
            selectedCatInfo = parentcat
        }
    }

    function changeProductProperty(propName, value){
        setProductProperties(prev => {
            const newProductProps = {...prev}
            newProductProps[propName] = value
            return newProductProps
        })
    }

    return (

        <form onSubmit = {saveProduct}>

            <label>Product Name</label>
            <input type="text" placeholder ="product name" value = {title} onChange={ev => setTitle(ev.target.value)}/>
            <label>Category</label>
            <select value = {category} onChange={ev => setcategory(ev.target.value)}>
                <option value="">Uncategorized</option>
                {categories.length > 0 && categories.map(c => (
                    <option value={c._id}>{c.name}</option>
                ))}
            </select>
            {propertiestoFill.length > 0 && propertiestoFill.map(p => (
                <div className="flex gap-1">

                    {p.name}
                    <select value={productProperties[p.name]} onChange={(ev) => changeProductProperty(p.name, ev.target.value)}>
                        {p.values.map(v=>(
                            <option value={v}>{v}</option>
                        ))}
                    </select>
                </div>
            ))}
            <label>Photos</label>
            <div className="mb-2 flex flex-wrap gap-2">

                <ReactSortable list={images} className="flex flex-wrap gap-1" setList={updateImagesOrder}>
                {images?.length && images.map(link => (
                    <div key = {link} className = "h-32">
                        <img src={link} alt="" className="rounded-lg w-32 h-32"/>
                    </div>
                ))}
                </ReactSortable>
                <label
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    className="w-32 h-32 border flex items-center justify-center rounded-lg bg-gray-200 cursor-pointer">
                    Upload
                    <input type="file"

                           onChange={uploadPhoto} className="hidden" multiple/>
                </label>


            </div>
            <label>Product Description</label>
            <textarea placeholder="description" value = {description}
                      onChange={ev=>setDescription(ev.target.value)}></textarea>
            <label>Product Brand</label>
            <textarea placeholder="brand" value = {brand}
                      onChange={ev=>setBrand(ev.target.value)}></textarea>
            <label>Product Price</label>
            <input type="number" placeholder ="product price"value = {price}
                   onChange={ev=>setPrice(ev.target.value)}/>
            <button type="submit" className="btn-primary">Save</button>



        </form>
    );
}