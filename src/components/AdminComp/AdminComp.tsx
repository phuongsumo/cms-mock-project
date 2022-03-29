import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { accountState, initialValues } from '../RecoilProvider/RecoilProvider';
import { Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import styles from './AdminComp.module.css'
import ChangePassword from './ChangePassword';

const Admin: React.FC<{ setLogin: Function }> = ({ setLogin }) => {
  const [account, setAcount] = useRecoilState(accountState);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const handleLogout = (setLogin: Function) => {
    let result = window.confirm('Bạn chắc chắn muốn đăng xuất?')
    if (result) {
      localStorage.setItem('account', JSON.stringify(initialValues));
      setAcount(initialValues);
      setLogin(false);
    }
  }

  const showModal = () => {
    setIsModalVisible(true);
  };



  return (
    <>
      <h1 className={styles.title}>Admin</h1>
      <Button className={styles.button} type="primary" shape="round" size={'large'} onClick={() => showModal()}>
        Đổi mật khẩu
      </Button>
      <ChangePassword isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} />
      <Button className={styles.button} type="primary" shape="round" size={'large'} onClick={() => handleLogout(setLogin)}>
        <LogoutOutlined />Đăng xuất
      </Button>
    </>
  )
}

export default Admin