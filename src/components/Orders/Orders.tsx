import { useState, useEffect } from 'react';
import { Table, Space, Spin, Checkbox, Select, Form, Input, Button } from 'antd';
import axios from 'axios';
import styles from './Orders.module.css'
import Details from './DetailsModal/Details';

const { Column, ColumnGroup } = Table;
const { Option } = Select;

interface RootObject {
    key: string;
    username: string;
    phone: string;
    address: string;
    orders: any[];
    totalPrice: string;
    paid: boolean;
    status: string;
    id: string;
}

const initialValues = {
    key: '',
    username: '',
    phone: '',
    address: '',
    orders: [],
    totalPrice: '',
    paid: true,
    status: '',
    id: ''
}

const api = 'https://6243085ab6734894c15a1d8e.mockapi.io/tea-shop/orders';
const apiUser = 'https://6227fddb9fd6174ca81830f6.mockapi.io/tea-shop/users';
const Orders = () => {
    const [data, setData] = useState<RootObject[]>([]);
    const [details, setDetails] = useState<boolean>(false);
    const [spin, setSpin] = useState<boolean>(true);
    const [record, setRecord] = useState<RootObject>(initialValues);
    const [reRender, setReRender] = useState<any>()
    const [disabledCheckBox, setDisabledCheckBox] = useState<boolean>(false);
    const [disabledSelect, setDisabledSelect] = useState<boolean>(false);

    const [form] = Form.useForm();

    useEffect(() => {
        axios.get(api)
            .then(response => {
                setData(response.data.reverse())
                setSpin(false)
            })
            .catch(error => console.log(error))
    }, [reRender])

    data.map((order, i) => {
        order.key = order.id
        data[i] = order;
    })

    const handleDetails = (record: RootObject) => {
        setDetails(true);
        setRecord(record);
    }

    const handleFilterPaid = (value: any, record: any) => {
        return record.paid === value
    }

    const handleFilterStatus = (value: any, record: any) => {
        return record.status === value
    }

    const handleChangePaid = (value: any) => {
        setDisabledCheckBox(true)
        const paidStatus = value.paid

        // Up date paid status on Orders API
        axios.put(`${api}/${value.id}`, { ...value, paid: !paidStatus })
            .then(response => {
                setReRender(response.data)
                setDisabledCheckBox(false)
            })
            .catch(error => console.log(error))

        // Up date paid status on Users API
        axios.get(apiUser)
            .then(response => {
                const data = response.data;
                // Search user 
                const user = data.find((user: any) => user.username === value.username);
                if (user) {
                    // Search this order of user
                    const order = user.orders.find((order: any) => order.time === value.time);
                    let indexOrder = user.orders.indexOf(order);
                    // Update paid status
                    user.orders[indexOrder] = { ...value, paid: !paidStatus }
                    // Put to api
                    axios.put(`${apiUser}/${user.id}`, user)
                }
            })
    }

    const handleChangeStatus = (value: string, record: any) => {
        setDisabledSelect(true)
        // Up date status on Orders API
        axios.put(`${api}/${record.id}`, { ...record, status: value })
            .then(response => {
                setReRender(response.data)
                setDisabledSelect(false)
            })
            .catch(error => console.log(error))

        // Up date status on Users API
        axios.get(apiUser)
            .then(response => {
                const data = response.data;
                // Search user 
                const user = data.find((user: any) => user.username === record.username);
                if (user) {
                    // Search this order of user
                    const order = user.orders.find((order: any) => order.time === record.time);
                    let indexOrder = user.orders.indexOf(order);
                    // Update paid status
                    user.orders[indexOrder] = { ...record, status: value }
                    // Put to api
                    axios.put(`${apiUser}/${user.id}`, user)
                }
            })
    }

    const layout = {
        labelCol: { span: 3 },
        wrapperCol: { span: 16 },
    };
    const tailLayout = {
        wrapperCol: { offset: 3, span: 16 },
    };

    const onFinish = async (values: any) => {
        setSpin(true)
        await axios.get(api)
            .then((res: any) => {
                const searchItem = res.data.filter((order: any) => (
                    order.fullName.toLowerCase().includes(values.fullName ? values.fullName.toLowerCase() : '') &&
                    order.address.toLowerCase().includes(values.address ? values.address.toLowerCase() : '') &&
                    order.phone.includes(values.phone ? values.phone : '')
                ))
                setData(searchItem.reverse())
                setSpin(false)
            })
    };

    const onReset = async () => {
        form.resetFields();
        setSpin(true)
        await axios.get(api)
            .then((res: any) => {
                setData(res.data.reverse())
                setSpin(false)
            })
    };

    return (
        <div style={{ minHeight: '100vh' }}>
            <Details details={details} setDetails={setDetails} record={record} />
            <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
                <Form.Item name="fullName" label="Ng?????i ?????t">
                    <Input />
                </Form.Item>
                <Form.Item name="address" label="?????a ch???">
                    <Input />
                </Form.Item>
                <Form.Item name="phone" label="S??? ??i???n tho???i">
                    <Input />
                </Form.Item>

                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit" style={{ marginRight: '16px' }}>
                        T??m ki???m
                    </Button>
                    <Button htmlType="button" onClick={onReset}>
                        Reset
                    </Button>
                </Form.Item>
            </Form>
            {spin ? <Spin /> :
                <Table
                    bordered
                    dataSource={data}
                    scroll={{ x: 250 }}
                    pagination={{ position: ['topLeft', 'bottomRight'] }}
                >
                    <ColumnGroup title="Th??ng tin ????n h??ng">
                        <Column title="Ng?????i ?????t" dataIndex="fullName" key="fullName" />
                        <Column title="?????a ch???" dataIndex="address" key="address" />
                        <Column title="S??? ??i???n tho???i" dataIndex="phone" key="phone" />
                        <Column
                            title="????n h??ng"
                            key="orders"
                            render={(text, record: any) => (
                                <Space size="middle">
                                    <Button type="primary" onClick={() => handleDetails(record)}>Chi ti???t</Button>
                                </Space>
                            )}
                        />
                    </ColumnGroup>

                    <ColumnGroup title="Tr???ng th??i ????n h??ng">
                        <Column
                            title="Thanh to??n"
                            key="paid"
                            filters={[
                                {
                                    text: '???? thanh to??n',
                                    value: true
                                },
                                {
                                    text: 'Ch??a thanh to??n',
                                    value: false
                                }
                            ]}
                            onFilter={(value, record) => handleFilterPaid(value, record)}
                            render={(text, record: any) => (
                                <Space size="middle">
                                    {record.paid ? <p className={styles.success}>???? thanh to??n</p> : <p className={styles.un_success}>Ch??a thanh to??n</p>}
                                    <Checkbox disabled={disabledCheckBox} defaultChecked={record.paid} onChange={() => handleChangePaid(record)}></Checkbox>
                                </Space>
                            )}
                        />
                        <Column
                            title="Giao h??ng"
                            key="status"
                            filters={[
                                {
                                    text: 'Ch??? x??c nh???n',
                                    value: '1'
                                },
                                {
                                    text: '??ang giao h??ng',
                                    value: '2'
                                },
                                {
                                    text: '???? giao h??ng',
                                    value: '3'
                                }
                            ]}
                            onFilter={(value, record) => handleFilterStatus(value, record)}
                            render={(text, record: any) => (
                                <Space size="middle">
                                    {record.status === '1' ? <p className={styles.un_success}>Ch??? x??c nh???n</p> :
                                        record.status === '2' ? <p className={styles.wait}>??ang giao h??ng</p> :
                                            record.status === '3' ? <p className={styles.success}>???? giao h??ng</p> : ''
                                    }
                                    <Select disabled={disabledSelect} defaultValue={record.status} onChange={(e) => handleChangeStatus(e, record)}>
                                        <Option value="1">Ch??? x??c nh???n</Option>
                                        <Option value="2">??ang giao h??ng</Option>
                                        <Option value="3">???? giao h??ng</Option>
                                    </Select>
                                </Space>
                            )}
                        />
                    </ColumnGroup>
                </Table>}
        </div>
    )
}

export default Orders