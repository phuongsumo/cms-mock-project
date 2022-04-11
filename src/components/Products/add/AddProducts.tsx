import { Button, Form, Input, InputNumber, Select } from "antd";
import TextArea from "antd/lib/input/TextArea";
import React, { useEffect, useState } from "react"
import Uploader from '../Uploader';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import axios from "axios";
import { Link } from "react-router-dom";


const api = 'https://6227fddb9fd6174ca81830f6.mockapi.io/tea-shop/product'; 
const apiImage = 'https://api.cloudinary.com/v1_1/tocotoco/image/upload';

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
}

const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 8 },
  };
  const formTailLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 8, offset: 4 },
  };
  
  
const AddProducts = () => {
    const [form] = Form.useForm();
    const Option = Select.Option;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [image, setImage] = useState<any>();
    const [imageSelected, setImageSelected] = useState<any>();

    function handleChange(value: any) {
        console.log(`selected ${value}`);

    }
    const [datas, setDatas] = useState<ProductObject[]>([]);
    async function fetchData() {
        let response = await axios(api);
        let listProducts = await response.data;
        setDatas([...listProducts]);
    }

    useEffect(() => {
        fetchData();
    }, [])

    const onFinish = (values: any) => {
        console.log('Received values of form: ', values);
        const products =  datas.map(list=>{
            return list.name
        });
        const nameProduct = values.name;
        const  priceProducts = values.gia;
        const saleProducts = values.giaSale;
        const categoryProducts = values.loai;
        const motaCategory = values.description;
        const pictureProducts = values.anh;
        const kichco = values.sizecoc;
       let check;
       for(let i = 0; i<products.length ; i++){
           check=true;
           
               if(nameProduct === products[i].toString() )
           {
               check=false;
               break;
           } 
        
    }  
    if(check){
        // var dataPost = {
        // name: nameProduct,
        // price: priceProducts,
        // salePrice: saleProducts,
        // category: categoryProducts,
        // description: motaCategory,
        // image: pictureProducts
        // };
     
        let url_post = api;

            fetch(url_post, {
                    method: 'POST', 
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(values), 
                })
                .then((response) => response.json()) 
                .then((data) => {

                    console.log('Success:', data); 
                })
                .catch((error) => {

                    console.error('Error:', error); 
                });
                alert("đăng ký thành công");
        <Link to='/'></Link>
    
    }else{
        alert("Tên đăng nhập đã tồn tại ")
    }       
      };
      
      const handleImageChange = (data: any) => {
        if (data) {
            setImageSelected(data)
            const img = data
            img.preview = URL.createObjectURL(data)
            setImage(img)
        } else {
            setImage("")
        }
    }
    return (
    <>
    <>
    <h2> Add Product </h2>
    </>
    <>

            <Form form={form} name="register" initialValues={{ remember: true }} onFinish={onFinish}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 10 }}
            >
                <Form.Item name="name" label="Nhập tên sản phẩm" 
                rules={[
                    {
                        required: true,
                        message: 'Please input name product',
                    },
                    { whitespace: true },
                    { min: 6 }
                ]}
                hasFeedback>
                    <Input  name="name" className={`${Error.name ? 'is-invalid' : ''}`} placeholder="Please input name product" />
                </Form.Item>
                <Form.Item name="price" label="Nhập giá bán" rules={[ {
                        required: true,
                        message: 'Please input price product',
                    },
                    { whitespace: true },
                    { min: 1 }
                    ]} 
                    hasFeedback>
                    <Input name="price" min={1}  style={{ width: '100%' }} placeholder="Please input  price" />
                </Form.Item>
                <Form.Item name="salePrice" label="Nhập giá bán khuyến mãi" rules={[ {
                        required: true,
                        message: 'Please input saleprice product',
                    },
                    { whitespace: true },
                    { min: 1 }
                    ]} 
                    hasFeedback>
                    <Input name="salePrice" min={1}  style={{ width: '100%' }} placeholder="Please input sale price" />
                </Form.Item>
                <Form.Item name="category" label="Nhập loại sản phẩm" rules={[ {
                        required: true,
                        message: 'Please select category product',
                    },]} hasFeedback>
                    <Select placeholder="Please select category"
                        style={{ width: '100%' }}
                        onChange={handleChange}
                    >
                        <Option value="1"> Trà sữa</Option>
                        <Option value="2">Trà 2 </Option>
                        <Option value="3">Trà 3 </Option>
                        <Option value="4"> Trà 4</Option>
                    </Select>
                </Form.Item>
                <Form.Item name="description" label="Thêm mô tả sản phẩm" rules={[
                    {
                        required: true,
                        message: 'Please input description product',
                    },
                    { whitespace: true },
                    { min: 10 }
                ]}
                    hasFeedback>
                    <TextArea name="description" rows={4} placeholder="Please input description" />
                </Form.Item>
                <Form.Item name="image" label="Thêm ảnh sản phẩm" 
                    hasFeedback>
                    {/* <Uploader /> */}
                    <Input type="file"></Input>
                </Form.Item>
                <Form.Item name="size" label="Chọn kích thước size cốc" rules={[ {
                        required: true,
                        message: 'Please select zise product',
                    },]} 
                    hasFeedback>
                    <Select placeholder="Please select size"
                        options={[
                            {
                                value: 'sizeM',
                                label: 'Size M ',
                            },
                            {
                                value: 'sizeL',
                                label: 'Size L ',
                            },
                        ]} />
                </Form.Item>
                <Button  style={{width: '200px'}} type="primary" htmlType="submit"> Submit </Button>

            </Form>

        </></>

    )
}
export default AddProducts


function register(arg0: string): JSX.IntrinsicAttributes & import("antd").InputProps & React.RefAttributes<import("antd").InputRef> {
    throw new Error("Function not implemented.");
}

