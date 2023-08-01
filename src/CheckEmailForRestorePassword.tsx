import React, { useEffect, useState } from 'react';
import { backendUrl } from './Global';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Alert, Form, Input, Row } from 'antd';
import { useNavigate   } from "react-router-dom";
const CheckEmailForRestorePassword = () => {

  let [email, setEmail]=useState<string>("")
  let [emailAlert, setEmailAlert]=useState<boolean>(false)
  const navigate  = useNavigate();

  useEffect(() => {
    setEmailAlert(false)
  },[email])

  const checkEmail=async()=>{

    if(email!=""){
        let response=await fetch(backendUrl + "/public/users?email="+email)
        if(response.ok){
        let data = await response.json()
        if(data.message!="user exist"){
            setEmailAlert(true)
        }else{
            setEmailAlert(false)
        }
        }
    }
  }

  let onChange=(e:any)=>{
    setEmail(e.target.value)
  }
    

  const goToChangePassword=()=>{
    checkEmail()
    if(emailAlert==false){
        navigate("/changePassword/"+email)
    }
  }  
  return (
  <Row align="middle" justify="center" style = {{ minHeight: '100vh', backgroundColor:"#EDEEF0"}}>
   
    <Form
      initialValues={{ remember: true }}
      onFinish={goToChangePassword}
      style={{ minWidth:300, backgroundColor:"white", padding:20, borderRadius:"20px" }}
    > 
        <Form.Item>
            <h2>Escriba su correo electrónico al que se vinculó su cuenta</h2>
        </Form.Item>

        {emailAlert && <Alert message="Correo electrónico no existe" type="error" showIcon style={{marginBottom:20}}/>}
     
        <Form.Item
        name="email"
        rules={[{ required: true, message: 'Please input your Email!' }]}
        >
            <Input onBlur={checkEmail} prefix={<UserOutlined className="site-form-item-icon" />} onChange={(e)=>{onChange(e)}} placeholder="Email" />
        </Form.Item>
     
        <Form.Item style={{justifyContent:"center", alignItems:"center", display:"flex"}}>
            <Button type="primary" htmlType="submit" className="login-form-button"  disabled={emailAlert}>
                Próxima
            </Button>
        </Form.Item>

    </Form>
  </Row>
      );
};

export default CheckEmailForRestorePassword;
