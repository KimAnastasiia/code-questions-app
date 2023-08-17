import React, { useState } from 'react';
import { AppstoreOutlined, CloudServerOutlined, UploadOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu , Button} from 'antd';
import {LogoutOutlined, FormOutlined, ContainerOutlined, CheckOutlined} from '@ant-design/icons';

const items: MenuProps['items'] = [
  {
    label:  <a href="/createTest" >
    Crear prueba
    </a>,
    key:'createTest',
    icon: <FormOutlined />,
  },
  {
    label:  <a href="/uploadTest" >
    Subir prueba
    </a>,
    key:'uploadTest',
    icon: <UploadOutlined />,
  },
  {
    label:  <a href="/myTests" >
       Todas las pruebas
    </a>,
    key:'allTests',
    icon:<ContainerOutlined />,
  },
  {
    label:  
    <a href="/logOut" rel="noopener noreferrer">
        Cerrar sesión
    </a>,
    key: 'out',
    icon: <LogoutOutlined />,
  },
];


const MenuFunction :React.FC = () =>{

    const [current, setCurrent] = useState('mail');

    const onClick: MenuProps['onClick'] = (e) => {
      console.log('click ', e);
      setCurrent(e.key);
    };

  return <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" style={{display:"flex", justifyContent:"center", width:"60%"}} items={items} />
};

export default MenuFunction;
