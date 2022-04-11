import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Table, Space, Input, Checkbox, Button, Modal, Form, DatePicker, InputNumber, Switch, Cascader, TreeSelect, Select, Radio, Upload, message } from 'antd';
import styles from './Users.module.css'
import { getValue } from '@testing-library/user-event/dist/utils';
import Icon, { AudioOutlined } from '@ant-design/icons';
import style from './Product.module.css'
import Uploader from './Uploader';
import TextArea from 'antd/lib/input/TextArea';
import { Link } from 'react-router-dom';
import { AddProducts } from '../index.js';

const { Search } = Input;


const api = 'https://6227fddb9fd6174ca81830f6.mockapi.io/tea-shop/product';


interface ProductObject {
    lenght: any;
    name: string;
    price: string;
    salePrice: string;
    description: string;
    image: string;
    category: string;
    sizeM: string;
    sizeL: string;
    id: string;
    key: string;
    created_at: string;
}

const Product = () => {
    const [data, setData] = useState<ProductObject[]>([]);
    const [list, setList] = useState<ProductObject[]>([]);
    const [reRender, setReRender] = useState<string>('');

    const { Column } = Table;

    useEffect(() => {
        axios.get(api)
            .then((response) => {
                setData(response.data)
                setList(response.data)
            })
    }, [reRender])

    data.map((product, i) => {
        product.key = product.id
        data[i] = product;
    })


    const handleDelete = (id: string) => {
        if (id === '1') {
            alert('Không thể xóa tài khoản này!')
        } else {
            let result = window.confirm('Bạn chắc chắn muốn xóa tài khoản này?')
            if (result) {
                axios.delete(`${api}/${id}`)
                    .then(response => setReRender(id))
            }
        }
    }


    const onChangeInput = (value: string) => {
        let products = data.filter(product => {
            return product.name.includes(value)
        })
        setList(products);
    }
    const { Search } = Input;

    const suffix = (
        <AudioOutlined
            style={{
                fontSize: 16,
                color: '#1890ff',
            }}
        />
    );
    const onSearch = (value: any) => {
        let users = data.filter(user => {
            return user.name.includes(value)
        })
        setList(users);
    };
    const [isModalVisible, setIsModalVisible] = useState(false);
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    

    return (
        <>
            <Search
                placeholder="Tìm kiếm tên sản phẩm"
                enterButton="Search"
                size="large"
                suffix={suffix}
                onSearch={onSearch}
            />


            <>
                <Link to="/AddProducts"   className={style.btn} >
                    Add product
                </Link>

            </>



            <Table bordered dataSource={list}>
                <Column title="Tên sản phẩm " dataIndex="name" key="name" />
                <Column title="Giá bán " dataIndex="price" key="price" />
                <Column title="Giá bán khuyến mại" dataIndex="salePrice" key="salePrice" />
                <Column title="Mô tả" dataIndex="description" key="description" />
                <Column title="Ảnh minh họa" dataIndex="image" key="image" />
                <Column title="Loại sản phẩm" dataIndex="category" key="category" />
                <Column title="Size cốc" render={(text, record: any) => {

                    if (!record.sizeM && !record.sizeL) {
                        return (
                            <><Checkbox id="sizeM" checked>Size M</Checkbox><Checkbox id="sizeL" checked>Size L</Checkbox></>
                        );
                    }
                    else {
                        return (
                            <><Checkbox id="sizeM">Size M</Checkbox><Checkbox id="sizeL">Size L</Checkbox></>
                        );
                    }
                }} />
                <Column
                    title="Action"
                    key="action"
                    render={(text, record: any) => (

                        <Space size="middle">
                            <a onClick={() => handleDelete(record.id)}>Xóa</a>
                            {/* <a onClick={() => handleEdit(record.id)}>Sửa</a> */}
                        </Space>
                    )}
                />

            </Table>
        </>
    )
}

export default Product

function setSize(value: any): void {
    throw new Error('Function not implemented.');
}
