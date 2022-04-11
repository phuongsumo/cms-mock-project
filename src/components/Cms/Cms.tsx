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

    // Set default key nav bar
    const selectKeys = () => {
        let url = window.location.pathname;
        switch (url) {
            case '/':
                return '1'
            case '/orders':
                return '2'
            case '/users':
                return '3'
            case '/products':
                return '4'
            default:
                break;
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
                <Menu theme="dark" mode="inline" defaultSelectedKeys={[`${selectKeys()}`]}>
                    <Menu.Item key="1" icon={<UserOutlined />}>
                        <Link to="/">
                            Admin
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="2" icon={<AppstoreOutlined />}>
                        <Link to="/orders">
                            Đơn hàng
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="3" icon={<TeamOutlined />}>
                        <Link to="/users">
                            Người dùng
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="4" icon={<ShopOutlined />}>
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
                    Tocotoco
                </Footer>
            </Layout>
        </Layout>
    )
}

export default Cms