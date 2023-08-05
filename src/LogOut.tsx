import React, { useEffect, useState } from 'react';
import { backendUrl } from './Global';
import { GoogleLogin } from '@react-oauth/google';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Alert, Form, Input, Row } from 'antd';
import { useNavigate   } from "react-router-dom";
import { useGoogleLogin } from '@react-oauth/google';
const LogOut = () => {

  const navigate  = useNavigate();
  
    const logOut=()=>{

        localStorage.removeItem('access_token');
        navigate("/")
    }
    
  return (
  <Row align="middle" justify="center" style = {{ minHeight: '100vh', backgroundColor:"#EDEEF0"}}>
   
    <Form
      name="normal_login"
      className="login-form"
      initialValues={{ remember: true }}
      onFinish={logOut}
      style={{ minWidth:300, backgroundColor:"white", padding:20, borderRadius:"20px" }}
    > 
      <Form.Item>
        <h2>¿De verdad quieres salir de tu cuenta?</h2>
      </Form.Item>

      <Form.Item style={{justifyContent:"center", alignItems:"center", display:"flex"}}>
        <Button type="primary" htmlType="submit" className="login-form-button">
          Si
        </Button>
      </Form.Item>

    </Form>
  </Row>
      );
};

export default LogOut;
