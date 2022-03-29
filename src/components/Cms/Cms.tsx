import React, { useRef, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
    AppstoreOutlined,
    ShopOutlined,
    TeamOutlined,
    UserOutlined,
    MenuOutlined,
    CloseCircleOutlined,
} from '@ant-design/icons';
import { AdminComp, Orders, Products, Users } from '../index.js';
import logoImg from './Logo.png'
import styles from './Cms.module.css';


const { Header, Content, Footer, Sider } = Layout;

const Cms: React.FC<{ setLogin: Function }> = ({ setLogin }) => {
    const [change, setChange] = useState<boolean>(true);
    const menuRef = useRef<any>();

    const handleMenuClick = () => {
        setChange(!change)
        if (change) {
            menuRef.current.style = 'display: block'
        } else {
            menuRef.current.style = 'display: none'
        }
    }

    return (
        <Layout hasSider>
            <Sider
                ref={menuRef}
                className={styles.menu}
                style={{
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                }}
            >
                <div className={styles.logo}>
                    <img src={logoImg} alt="logo" className={styles.logo_img} />
                </div>
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['admin']}>
                    <Menu.Item key="admin" icon={<UserOutlined />}>
                        <Link to="/">
                            Admin
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="orders" icon={<AppstoreOutlined />}>
                        <Link to="/orders">
                            Đơn hàng
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="users" icon={<TeamOutlined />}>
                        <Link to="/users">
                            Người dùng
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="products" icon={<ShopOutlined />}>
                        <Link to="/products">
                            Sản phẩm
                        </Link>
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout className={styles.site_layout}>
                <Header className={`site-layout-background ${styles.header}`} style={{ padding: 0 }}>
                    {change ? <MenuOutlined className={styles.menu_icon} onClick={handleMenuClick} /> :
                        <CloseCircleOutlined className={styles.menu_icon} onClick={handleMenuClick} />}
                </Header>
                <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
                    <div className="site-layout-background" style={{ padding: 24, textAlign: 'center' }}>
                        <Routes>
                            <Route path="/" element={<AdminComp setLogin={setLogin} />} />
                            <Route path="/orders" element={<Orders />} />
                            <Route path="/users" element={<Users />} />
                            <Route path="/products" element={<Products />} />
                        </Routes>
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    Nhóm 3 - Nhóm Câu đơ
                </Footer>
            </Layout>
        </Layout>
    )
}

export default Cms