import React from 'react';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import { accountState } from '../RecoilProvider/RecoilProvider';
import { Button, Modal, Form, Input, message } from 'antd';

const api = 'https://6227fddb9fd6174ca81830f6.mockapi.io/tea-shop/users/1';

const ChangePassword: React.FC<{ isModalVisible: boolean, setIsModalVisible: Function }> = ({ isModalVisible, setIsModalVisible }) => {
    const [account, setAccount] = useRecoilState(accountState);
    const [form] = Form.useForm();

    const handleCancel = () => {
        form.resetFields();
        setIsModalVisible(false);
    };

    const onFinish = (values: any) => {
        axios.put(api, { ...account, password: values.newPassword })
            .then((res) => {
                setAccount(res.data);
                localStorage.setItem('account', JSON.stringify(res.data));
                form.resetFields();
                setIsModalVisible(false);
                message.success('Đổi mật khẩu thành công');
            })
            .catch((err) => {
                console.log(err);
                message.error('Có lỗi xảy ra, vui lòng thử lại sau');
            })
    };

    const onFinishFailed = (errorInfo: any) => {
        message.error('Failed:', errorInfo);
    };

    var pwdRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    return (
        <Modal
            title="Đổi mật khẩu"
            visible={isModalVisible}
            onCancel={handleCancel}
            okButtonProps={{ disabled: true, ghost: true }}
        >
            <Form
                form={form}
                name="changePassword"
                labelCol={{ span: 9 }}
                wrapperCol={{ span: 12 }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="Mật khẩu cũ"
                    name="oldPassword"
                    hasFeedback
                    rules={[
                        { required: true, message: 'Vui lòng nhập mật khẩu cũ' },
                        () => ({
                            validator(_, value) {
                                if (!value || account.password === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Mật khẩu xác nhận chưa chính xác'));
                            },
                        })
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Mật khẩu mới"
                    name="newPassword"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập ít nhất 6 ký tự'
                        },
                        {
                            min: 6,
                            message: 'Vui lòng nhập ít nhất 6 ký tự'
                        },
                        {
                            max: 20,
                            message: 'Vui lòng nhập tối đa 20 ký tự'
                        },
                        {
                            pattern: pwdRegex,
                            message: 'Vui lòng nhập tối thiểu một ký tự viết hoa và một ký tự số'
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    name="confirm"
                    label="Nhập lại mật khẩu"
                    dependencies={['newPassword']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập lại mật khẩu mới',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('newPassword') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Mật khẩu xác nhận chưa chính xác'));
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 10, span: 12 }}>
                    <Button type="primary" htmlType="submit">
                        Xác nhận
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default ChangePassword