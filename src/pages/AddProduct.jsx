import React, { useState, useContext } from 'react';
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { TextInput, Textarea, Title, Button, NativeSelect } from '@mantine/core';
import { createProduct } from '../context/productContext/apiCalls';
import { ProductContext } from '../context/productContext/ProductContext';

const AddProduct = () => {
  const admin = JSON.parse(localStorage.getItem('user')).isAdmin;
  const [product, setProduct] = useState(null);
  const { dispatch } = useContext(ProductContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.value;
    setProduct({ ...product, [e.target.id]:value })
  }

  const handleSubmit = () => {
    createProduct(product, dispatch)
        .then(() => {
          alert('Product Successfully Added to the Database!');
          navigate('/');
          window.location.reload();
        });
  }

  return (
    <>
    <Helmet>
      <title>Add New Product | Lamborghini E-Commerce</title>
      <meta name='description' content='Add New Product' />
    </Helmet>
    {
      admin ? 
      <>
      <Title order={2}>Add A New Product</Title>
      <TextInput
      label="Image Link"
      placeholder='http://website.com/image.jpg'
      id="image"
      size="md"
      required
      onChange={handleChange}
      />
      <TextInput
      label="Product Name"
      placeholder='Name of product'
      id="title"
      size="md"
      required
      onChange={handleChange}
      />
      <Textarea
      label="Description"
      id="description"
      size="md"
      required
      onChange={handleChange}
      />
      <NativeSelect
      size="md"
      id='category'
      data={['Accessories', 'Desktops', 'Laptops', 'Phones', 'Tablets', 'Watches','Vehicles','Clothes', 'Toys', 'Decorations']}
      onChange={handleChange}
      placeholder="Select one"
      label="Choose category"
      />
      <TextInput
      placeholder="0"
      label="Price"
      id="price"
      size="md"
      type='number'
      required
      onChange={handleChange}
      />

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
        <Button type="Submit" onClick={handleSubmit}>Add Product</Button>
      </div>
    </>
      :
    <div style={{ width: '100%', marginLeft: 'auto', marginRight: 'auto' }}><Title order={3}>You do not have permission to access this</Title></div>
    }
    </>
  )
}

export default AddProduct