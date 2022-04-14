import React from 'react';
import { useRecoilState } from 'recoil';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Checkbox, message } from 'antd';
import styles from './Login.module.css';
import { accountState } from '../RecoilProvider/RecoilProvider';

const Login: React.FC<{ setLogin: Function }> = ({ setLogin }) => {
    const [account, setAcount] = useRecoilState(accountState)

    const navigate = useNavigate();

    const fetchData = async (url: string) => {
        const getData = await axios.get(url);
        const data = await getData.data;
        return data;
    }

    const onFinish = async (values: any) => {
        try {
            const data = await fetchData('https://6227fddb9fd6174ca81830f6.mockapi.io/tea-shop/users/1');
            if (values.username === data.username && values.password === data.password) {
                localStorage.setItem('account', JSON.stringify(data))
                setAcount(data);
                setLogin(true);
                navigate('/')
                message.success('Đăng nhập thành công')
            } else {
                message.error('Tài khoản hoặc mật khẩu không đúng')
            }
        } catch (error) {
            message.error('Đã xảy ra lỗi, vui lòng tải lại trang');
        }

    }

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className={styles.login}>
            <h3 className={styles.login_title}>Đăng nhập</h3>
            <Form
                className={styles.login_form}
                name="basic"
                labelCol={{ span: 0 }}
                wrapperCol={{ span: 12 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="Tài khoản"
                    name="username"
                    rules={[{ required: true, message: 'Vui lòng nhập tên tài khoản' }]}
                    className={styles.form_item}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Mật khẩu"
                    name="password"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
                    className={styles.form_item}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 0, span: 12 }} className={styles.form_item}>
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 6, span: 12 }} className={styles.form_item}>
                    <Button type="primary" htmlType="submit">
                        Đăng nhập
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};


export default Login