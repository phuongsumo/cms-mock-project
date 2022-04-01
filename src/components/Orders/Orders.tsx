import { useState, useEffect } from 'react';
import { Table, Space, Spin, Checkbox, Select } from 'antd';
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

const Orders = () => {
    const [data, setData] = useState<RootObject[]>([]);
    const [details, setDetails] = useState<boolean>(false);
    const [spin, setSpin] = useState<boolean>(true);
    const [record, setRecord] = useState<RootObject>(initialValues);
    const [reRender, setReRender] = useState<any>()

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
        const paidStatus = value.paid
        axios.put(`${api}/${value.id}`, { ...value, paid: !paidStatus })
            .then(response => {
                setReRender(response.data)
            })
            .catch(error => console.log(error))
    }

    const handleChangeStatus = (value: string, record: any) => {
        console.log(value, record);
        axios.put(`${api}/${record.id}`, { ...record, status: value })
            .then(response => {
                setReRender(response.data)
            })
            .catch(error => console.log(error))
    }

    return (
        <>
            <Details details={details} setDetails={setDetails} record={record} />
            {spin ? <Spin /> : <Table bordered dataSource={data}>
                <ColumnGroup title="Thông tin đơn hàng">
                    <Column title="Người đặt" dataIndex="fullName" key="fullName" />
                    <Column title="Địa chỉ" dataIndex="address" key="address" />
                    <Column title="Số điện thoại" dataIndex="phone" key="phone" />
                    <Column
                        title="Đơn hàng"
                        key="orders"
                        render={(text, record: any) => (
                            <Space size="middle">
                                <a onClick={() => handleDetails(record)}>Chi tiết</a>
                            </Space>
                        )}
                    />
                </ColumnGroup>

                <ColumnGroup title="Trạng thái đơn hàng">
                    <Column
                        title="Thanh toán"
                        key="paid"
                        filters={[
                            {
                                text: 'Đã thanh toán',
                                value: true
                            },
                            {
                                text: 'Chưa thanh toán',
                                value: false
                            }
                        ]}
                        onFilter={(value, record) => handleFilterPaid(value, record)}
                        render={(text, record: any) => (
                            <Space size="middle">
                                {record.paid ? <p className={styles.success}>Đã thanh toán</p> : <p className={styles.un_success}>Chưa thanh toán</p>}
                                <Checkbox defaultChecked={record.paid} onChange={() => handleChangePaid(record)}></Checkbox>
                            </Space>
                        )}
                    />
                    <Column
                        title="Giao hàng"
                        key="status"
                        filters={[
                            {
                                text: 'Chờ xác nhận',
                                value: '1'
                            },
                            {
                                text: 'Đang giao hàng',
                                value: '2'
                            },
                            {
                                text: 'Đã giao hàng',
                                value: '3'
                            }
                        ]}
                        onFilter={(value, record) => handleFilterStatus(value, record)}
                        render={(text, record: any) => (
                            <Space size="middle">
                                {record.status === '1' ? <p className={styles.un_success}>Chờ xác nhận</p> :
                                    record.status === '2' ? <p className={styles.wait}>Đang giao hàng</p> :
                                        record.status === '3' ? <p className={styles.success}>Đã giao hàng</p> : ''
                                }
                                <Select defaultValue={record.status} onChange={(e) => handleChangeStatus(e, record)}>
                                    <Option value="1">Chờ xác nhận</Option>
                                    <Option value="2">Đang giao hàng</Option>
                                    <Option value="3">Đã giao hàng</Option>
                                </Select>
                            </Space>
                        )}
                    />
                </ColumnGroup>
            </Table>}
        </>
    )
}

export default Orders