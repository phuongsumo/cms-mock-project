import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Space, Input, Spin, message, Modal } from 'antd';
import styles from './Users.module.css'
import { ExclamationCircleOutlined } from '@ant-design/icons';

const api = 'https://6227fddb9fd6174ca81830f6.mockapi.io/tea-shop/users';

interface RootObject {
    username: string;
    password: string;
    email: string;
    phone: string;
    fullName: string;
    age: string;
    avatar: string;
    address: string;
    cart: any[];
    orders: any[];
    id: string;
    key: string;
}

const Users = () => {
    const [data, setData] = useState<RootObject[]>([]);
    const [list, setList] = useState<RootObject[]>([]);
    const [spin, setSpin] = useState<boolean>(true);
    const [reRender, setReRender] = useState<string>('');

    const { Column } = Table;
    const { confirm } = Modal;

    useEffect(() => {
        axios.get(api)
            .then((response) => {
                setData(response.data)
                setList(response.data)
                setSpin(false)
            })
    }, [reRender])

    data.map((user, i) => {
        user.key = user.id
        data[i] = user;
    })

    function showConfirmDelete(id: string) {
        confirm({
            title: 'Bạn chắc chắn muốn xóa tài khoản này?',
            icon: <ExclamationCircleOutlined />,
            content: 'Tài khoản sẽ bị xóa vĩnh viễn',
            onOk() {
                if (id === '1') {
                    message.error('Không thể xóa tài khoản này!')
                } else {
                    axios.delete(`${api}/${id}`)
                        .then(response => {
                            setReRender(id)
                            message.success('Xóa tài khoản thành công')
                        })
                }
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }


    const onChangeInput = (value: string) => {
        let users = data.filter(user => {
            return user.username.toLowerCase().includes(value.toLowerCase())
        })
        setList(users);
    }

    return (
        <div style={{ minHeight: '100vh' }}>
            <Input
                placeholder="Tìm kiếm tài khoản..."
                allowClear
                size="large"
                onChange={(e) => onChangeInput(e.target.value)}
            />
            {spin ? <Spin className={styles.spin} /> :
                <Table
                    bordered
                    dataSource={list}
                    scroll={{ x: 300 }}
                >
                    <Column title="Tên đăng nhập" dataIndex="username" key="username" />
                    <Column title="Mật khẩu" dataIndex="password" key="password" />
                    <Column title="Tên" dataIndex="fullName" key="username" />
                    <Column title="Địa chỉ" dataIndex="address" key="address" />
                    <Column title="Email" dataIndex="email" key="email" />
                    <Column title="Số điện thoại" dataIndex="phone" key="phone" />
                    <Column
                        title="Action"
                        key="action"
                        render={(text, record: any) => (
                            <Space size="middle">
                                <a onClick={() => showConfirmDelete(record.id)}>Xóa</a>
                            </Space>
                        )}
                    />
                </Table>}
        </div>
    )
}

export default Users