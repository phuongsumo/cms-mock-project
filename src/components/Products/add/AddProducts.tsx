import { Button, Checkbox, Col, Form, Input, message, Radio, Row, Select } from "antd"
import React, { useEffect, useState } from "react"
import styles from '../Product.module.css'
import axios from "axios"
import { useNavigate } from "react-router-dom";



const api = 'https://6227fddb9fd6174ca81830f6.mockapi.io/tea-shop/product';
const apiImage = 'https://api.cloudinary.com/v1_1/tocotoco/image/upload';

interface ProductObject {
    lenght: any;
    name: string;
    price: string;
    salePrice: string;
    image: string;
    category: string;
    sizeM: boolean;
    sizeL: boolean;
    hot: boolean;
    id: string;
    key: string;
}

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 8 },
};
const formTailLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 5 },
};

const AddProducts = () => {
    const [form] = Form.useForm();
    const Option = Select.Option;
    const [image, setImage] = useState<any>();
    const [imageSelected, setImageSelected] = useState<any>();
    const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

    let navigate = useNavigate();
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

    useEffect(() => {
        return () => {
            image && URL.revokeObjectURL(image.preview)
        }
    }, [image])

    const onFinish = (values: any) => {
        setConfirmLoading(true);

        const formData = new FormData();
        formData.append("file", imageSelected);
        formData.append("upload_preset", "tocoproduct");

        axios.post(apiImage, formData)
            .then(response => {
                // Assign data to Cloudinary image URL
                values.image = response.data.secure_url
                if (values.size.length === 2) {
                    values.sizeM = true;
                    values.sizeL = true;
                } else if (values.size[0] === '1') {
                    values.sizeM = true;
                    values.sizeL = false;
                } else if (values.size[0] === '2') {
                    values.sizeM = false;
                    values.sizeL = true;

                }
                delete values.size;
                if (!values.hot) {
                    values.hot = false
                }
                if (!values.salePrice) {
                    values.salePrice = ''
                }

                // Post data to Api
                axios.post(api, values)
                    .then(() => {
                        message.success("Th??m s???n ph???m th??nh c??ng ")
                        setConfirmLoading(false)
                    })
                    .then(() => { navigate("/products", { replace: true }) })
                    .catch(err => message.error('C?? l???i x???y ra'))
            })
            .catch(err => message.error('C?? l???i x???y ra'))
    };

    const handleImageChange = (data: any) => {
        if (data) {
            setImageSelected(data)
            const img = data
            img.preview = URL.createObjectURL(data)
            setImage(img)
        } else {
            setImage('')
        }
    }

    return (
        <div style={{ minHeight: '100vh' }}>
            <>
                <h2> Th??m s???n ph???m </h2>
            </>
            <>

                <Form
                    {...layout}
                    form={form} name="register"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 10 }}
                >
                    <Form.Item name="name" label="Nh???p t??n s???n ph???m"
                        rules={[
                            {
                                required: true,
                                message: 'Vui l??ng nh???p t??n s???n ph???m',
                            },
                            { whitespace: true },
                            { min: 6, message: 'Vui l??ng nh???p t???i thi???u 6 k?? t???' }
                        ]}
                        hasFeedback>
                        <Input name="name" className={`${Error.name ? 'is-invalid' : ''}`} placeholder="T??n s???n ph???m" />
                    </Form.Item>
                    <Form.Item name="price" label="Nh???p gi?? b??n" rules={[{
                        required: true,
                        message: 'Vui l??ng nh???p gi?? b??n',
                    },
                    { whitespace: true }
                    ]}
                        hasFeedback>
                        <Input name="price" min={1} style={{ width: '100%' }} placeholder="Nh???p gi?? b??n" />
                    </Form.Item>
                    <Form.Item name="salePrice" label="Nh???p gi?? b??n khuy???n m??i" rules={[{
                        required: false
                    },
                    { whitespace: true }
                    ]}
                        hasFeedback>
                        <Input name="salePrice" min={1} style={{ width: '100%' }} placeholder="Gi?? khuy???n m???i" defaultValue='' />
                    </Form.Item>
                    <Form.Item name="category" label="Nh???p lo???i s???n ph???m" rules={[{
                        required: true,
                        message: 'Vui l??ng ch???n lo???i s???n ph???m',
                    },]} hasFeedback>
                        <Select placeholder="Lo???i s???n ph???m"
                            style={{ width: '100%' }}
                            onChange={handleChange}
                        >
                            <Option value="1">Tr?? s???a</Option>
                            <Option value="2">Fresh Fruit Tea</Option>
                            <Option value="3">Machiato Cream Cheese</Option>
                            <Option value="4">S???a chua d???o</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="image"
                        label="Th??m ???nh s???n ph???m"
                        rules={[{
                            required: true,
                            message: 'Vui l??ng ch???n ???nh m?? t???',
                        },]}
                    >
                        <label htmlFor="add_img" style={{ width: 100, height: 100, border: '1px solid #807a79', display: 'block', cursor: 'pointer' }}>
                            <input id='add_img' style={{ display: 'none' }} type="file" onChange={(e: any) => handleImageChange(e.target.files[0])} />
                            {image && <img

                                src={image.preview}
                                alt="Anh"
                                style={{ width: 100, height: 100, objectFit: 'cover' }}
                            />}
                        </label>

                    </Form.Item>
                    <Form.Item
                        {...formTailLayout}
                        name="size"
                        label="K??ch th?????c s???n ph???m"
                        rules={[{
                            required: true,
                            message: 'Vui l??ng ch???n k??ch th?????c s???n ph???m',
                        },]}
                        hasFeedback
                    >
                        <Checkbox.Group>
                            <Row>
                                <Col>
                                    <Checkbox value="1" style={{ lineHeight: '32px' }}>
                                        Size M
                                    </Checkbox>
                                </Col>
                                <Col>
                                    <Checkbox value="2" style={{ lineHeight: '32px' }}>
                                        Size L
                                    </Checkbox>
                                </Col>
                            </Row>
                        </Checkbox.Group>
                    </Form.Item>
                    <Form.Item
                        {...formTailLayout}
                        name="hot"
                        label="S???n ph???m n???i b???t"
                    >
                        <Radio.Group defaultValue={false}>
                            <Radio value={true}>C??</Radio>
                            <Radio value={false}>Kh??ng</Radio>
                        </Radio.Group>

                    </Form.Item>
                    <Button
                        style={{ width: '200px', marginTop: '16px' }}
                        type="primary"
                        htmlType="submit"
                        disabled={confirmLoading}
                    >
                        Th??m
                    </Button>

                </Form>

            </>
        </div>

    )
}
export default AddProducts




