import React, { useState, useContext, useEffect } from 'react';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom';
import { TextInput, Table, ScrollArea, Button, Image, NativeSelect, Loader } from '@mantine/core';
import { ProductContext } from '../../context/productContext/ProductContext';
import { deleteProduct, getProducts } from '../../context/productContext/apiCalls';
import { Search } from 'tabler-icons-react';
import { Pagination } from '@mui/material';
import EditProduct from './EditProduct';
import formatDistance from "date-fns/formatDistance";

const ProductList = () => {
  const { products, isFetching, dispatch } = useContext(ProductContext);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('');
  const [edit, setEdit] = useState(false);
  const [editId, setEditId] = useState('');

  useEffect(() => {
    getProducts(dispatch);
  }, [dispatch]);

  const handleDelete = (id) => {
    deleteProduct(id, dispatch)
        .then(
        alert('Successfully deleted!')
  );
  }

  const showEdit = (id) => {
    setEdit(true);
    setEditId(id);
    window.scrollTo(0, 0);
  }

  return (
    <>
    <Helmet>
      <title>Manage Products | Lamborghini E-Commerce</title>
      <meta name='description' content='Admin Products' />
    </Helmet>
    
    <TextInput
      size="md"
      placeholder="Search by product name"
      onChange={(e) => setSearch(e.target.value)}
      rightSectionWidth={42}
      style={{ marginBottom: '10px' }}
      icon={<Search size={24} color='black' />}
    />
    <NativeSelect
      size="md"
      data={['Accessories', 'Desktops', 'Laptops', 'Phones', 'Tablets', 'Watches','Vehicles','Clothes', 'Toys', 'Decorations']}
      onChange={(e) => setCategory(e.target.value)}
      value={category}
      placeholder="Select one"
      label="Filter products"
      style={{ marginBottom: '10px' }}
    />
    <Link to='/account/add-product'>
      <Button type="Submit" color="orange" style={{marginTop: '10px'}}>Add New Product</Button>
    </Link>
    
    {edit ? 
    <EditProduct
    editId={editId}
    setEdit={setEdit}
    />
    :
    <></>
    }

    {isFetching ?
    <Loader color="violet" size="xl" style={{ padding: '20px', width: '100%', display: 'flex', justifyContent: 'center' }}/>
    :
    <>
    <ScrollArea>
      <Table sx={{ minWidth: 800 }} verticalSpacing="sm" style={{ justifyContent: 'center' }}>
        <thead>
          <tr>
            <th>Image</th>
            <th>Added Date</th>
            <th>Product Title</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        {
        products
        .slice((page - 1) * 10, (page - 1) * 10 + 10)
        ?.filter((product) => {
          if(category === '' && search === ''){
            return true
          }
          if(category !== '' && search !== '' && product.category.includes(category) && product.title.toLowerCase().includes(search.toLowerCase())){
            return true
          }
          if(category !== '' && product.category.includes(category)){
            return true
          }
          if(search !== '' && product.title.toLowerCase().includes(search.toLowerCase())){
            return true
          }
          return false
        })
        .map((product) => {
          const timestamp = product.createdAt;
          const date = new Date(timestamp);
          const formattedDate = date.toLocaleString();
          return (
            <tr key={product._id}>
            <td>
              <Image
              width={80}
              height={80}
              fit="contain"
              src={product.image}
              />
            </td>
            <td>{formattedDate}</td>
            <td>{product.title}</td>
            <td>{product.category}</td>
            <td>
              <Button type="Submit" color="blue" size="sm" style={{ marginRight: '15px' }} onClick={() => showEdit(product._id)}>Edit</Button>
              <Button type="Submit" color="orange" size="sm" onClick={() => handleDelete(product._id)}>Delete</Button>
            </td>
          </tr>
          )
        })
        }
        </tbody>
      </Table>
    </ScrollArea>
    <Pagination
      count={(products?.length / 10).toFixed(0)}
      onChange={(_, value) => {
        setPage(value);
        window.scroll(0, 450);
      }}
      style={{ padding: 20, width: '100%', display: 'flex', justifyContent: 'center' }}
    />
    </>
    }
    </>
  )
}

export default ProductList