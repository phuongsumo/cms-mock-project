import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Space, Input } from 'antd';

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
    const [reRender, setReRender] = useState<string>('');

    const { Column } = Table;

    useEffect(() => {
        axios.get(api)
            .then((response) => {
                setData(response.data)
                setList(response.data)
            })
    }, [reRender])

    data.map((user, i) => {
        user.key = user.id
        data[i] = user;
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
        let users = data.filter(user => {
            return user.username.includes(value)
        })
        setList(users);
    }

    return (
        <>
            <Input
                placeholder="Tìm kiếm tài khoản..."
                allowClear
                size="large"
                onChange={(e) => onChangeInput(e.target.value)}
            />
            <Table dataSource={list}>
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
                            <a onClick={() => handleDelete(record.id)}>Xóa</a>
                        </Space>
                    )}
                />
            </Table>
        </>
    )
}

export default Users