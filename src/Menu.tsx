import React, { useState } from 'react';
import { AppstoreOutlined, CloudServerOutlined, UploadOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu, Modal  } from 'antd';
import { LogoutOutlined, FormOutlined, ContainerOutlined } from '@ant-design/icons';
import { useNavigate   } from "react-router-dom";

const MenuFunction: React.FC = () => {

  const navigate  = useNavigate();
  const [current, setCurrent] = useState('mail');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };
  const showModal = () => {
    setIsModalOpen(true);
  };
  const logOut=()=>{

    localStorage.removeItem('access_token');
    navigate("/")
    handleCancel()
  }
  const items: MenuProps['items'] = [
    {
      label: <a href="/createTest" >
        Crear prueba
      </a>,
      key: 'createTest',
      icon: <FormOutlined />,
    },
    {
      label: <a href="/uploadTest" >
        Subir prueba
      </a>,
      key: 'uploadTest',
      icon: <UploadOutlined />,
    },
    {
      label: <a href="/myTests" >
        Todas las pruebas
      </a>,
      key: 'allTests',
      icon: <ContainerOutlined />,
    },
    {
      label:
        <a  onClick={showModal}  rel="noopener noreferrer">
          Cerrar sesión
        </a>,
      key: 'out',
      icon: <LogoutOutlined />,
    },
  ];
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return <>
    <Modal title="¿Estás seguro de que quieres salir?" okType='danger' open={isModalOpen} onOk={logOut} onCancel={handleCancel}  okText="Si"
        cancelText="No">
    </Modal>
    <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" style={{ display: "flex", justifyContent: "center", width: "60%" }} items={items} />
  </>

};

export default MenuFunction;
