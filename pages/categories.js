import Layout from "@/components/layout"
import React, {useEffect, useState} from "react";
import axios from "axios";
import { withSwal } from 'react-sweetalert2'
function CategoriesPage({swal}){
    const [editedCategory, setEditedCategory] = useState(null)
    const [name, setName] = useState('')
    const [parentCategory, setParentCategory] = useState('')
    const [categories, setCategories] = useState([])
    const [properties, setProperties] = useState([])


    useEffect(() => {
        fetchCat()
    }, []);
    function fetchCat(){
        axios.get('/api/categories').then(result =>{
            setCategories(result.data)
        })
    }
    async function saveCategory(ev){
        ev.preventDefault()
        const data = {name, parentCategory, properties:properties.map(prop => ({name:prop.name, values:prop.values.split(',')}))}
        if(editedCategory){
            data._id = editedCategory._id
            await axios.put('/api/categories', data)
            setEditedCategory(null)
        }else{
            await axios.post('/api/categories',data)
        }

        setName('')
        setParentCategory('')
        setProperties([])
        fetchCat()

    }
    function editCategory(category){
        setEditedCategory(category);
        setName(category.name)
        setParentCategory((category.parent?._id))
        setProperties(category.properties.map(({name,values}) => ({name, values:values.join(',')})))
    }
    function deleteCategory(category){
        swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete ${category.name}`,
            showCancelButton : true,
            cancelButtonText : 'Cancel',
            confirmButtonText : 'Yes, Delete!',
        }).then(async result => {
            if(result.isConfirmed){
                const {_id} = category;
                await axios.delete('/api/categories?_id=' + _id)
                fetchCat()
            }
            console.log({result});
        }).catch(error => {
            // when promise rejected...
        });
    }
    function addProperty(){
        setProperties(prev => {
            return [...prev, {name:'',values:'',}];
        })
    }

    function removeProperty(index){
        setProperties(prev => {
            return [...prev].filter((prop,pIndex)=>{
                return pIndex!== index;
            })
        })
    }

    function handlePropertyNameChange(index,property,newName){
        setProperties(prevState => {
            const prop = [...prevState]
            prop[index].name = newName
            return prop
        })
    }
    function handlePropertyValuesChange(index,property,newValues){
        setProperties(prevState => {
            const prop = [...prevState]
            prop[index].values = newValues
            return prop
        })
    }
    return(
        <Layout>
            <h1>Categories</h1>
            <label>{editedCategory? `Edit Category '${editedCategory.name}'` : 'Create new Category'}</label>
            <form onSubmit={saveCategory}>
                <div className="flex gap-1">
                <input type="text" placeholder={'Category Name'} onChange={ev=> setName(ev.target.value)} value={name} />
                <select value={parentCategory} onChange={ev => setParentCategory(ev.target.value)}  >
                    <option value="">No parent category</option>
                    {categories.length > 0 && categories.map(category => (
                        // eslint-disable-next-line react/jsx-key
                        <option value={category._id}>
                                {category.name}
                        </option>
                    ))}

                </select>
                </div>
                <div className="mb-2">
                    <label className = "block">Properties</label>
                    <button
                        onClick={addProperty}
                        type="button"
                        className="btn-primary text-sm mb-2">
                        Add new property
                    </button>
                    {properties.length > 0 && properties.map((property, index) =>(
                        // eslint-disable-next-line react/jsx-key
                        <div className="flex gap=1">
                            <input
                                type="text"
                                onChange={(ev)=> handlePropertyNameChange(index, property,ev.target.value)}
                                value={property.name}
                                placeholder="Property name (EX: Size)"/>
                            <input
                                type="text"
                                value={property.values}
                                onChange={(ev)=>handlePropertyValuesChange(index,property, ev.target.value)}
                                placeholder="Values (comma seperated)"/>
                            <button
                                onClick={()=> removeProperty(index)}
                                type="button"
                                className="btn-primary text-sm mb-2 ">
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
                {editedCategory &&(
                    <button onClick={() => {setEditedCategory(null); setName(''); setParentCategory(''); setProperties([]) }} type='submit' className="btn-primary py-1 mr-1">Cancel</button>
                )}
                <button type='submit' className="btn-primary py-1">Save</button>
            </form>
            {!editedCategory && (
                <table className = "basic mt-4">
                    <thead>
                    <tr>
                        <td >Category Name</td>
                        <td> Parent Category</td>
                        <td></td>
                    </tr>
                    </thead>
                    <tbody>
                    {categories.length > 0 && categories.map(category => (
                        <tr>
                            <td>{category.name}</td>
                            <td>{category?.parent?.name}</td>
                            <td>
                                <button onClick={() => editCategory(category)} className="btn-primary mr-1">
                                    Edit
                                </button>
                                <button onClick={() => deleteCategory(category)} className="btn-primary">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

        </Layout>
    )
}

export default withSwal(({swal}, ref) =>(
    <CategoriesPage swal={swal}/>
))