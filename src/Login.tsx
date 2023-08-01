import React, { useEffect, useState } from 'react';
import { backendUrl } from './Global';
import { GoogleLogin } from '@react-oauth/google';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Alert, Form, Input, Row } from 'antd';
import { useNavigate   } from "react-router-dom";
const Login = () => {
  const navigate  = useNavigate();
  let [userInfo, setUseInfo]=useState({
      email:"",
      password:""
    })
  let [wrongDataAlert, setWrongDataAlert]=useState({
    email:false,
    password:false
  })


  useEffect(() => {
    setWrongDataAlert({
   ...wrongDataAlert, 
    email:false
    })
  },[userInfo.email])

  useEffect(() => {
    setWrongDataAlert({
   ...wrongDataAlert, 
    password:false
    })
  },[userInfo.password])

  const checkEmail=async()=>{
    if(userInfo.email!=""){
      let response=await fetch(backendUrl + "/public/users?email="+userInfo.email)
      if(response.ok){
        let data = await response.json()
        if(data.message!="user exist"){
        setWrongDataAlert({
          ...wrongDataAlert, 
          email:true
          })
        }else{
        setWrongDataAlert({
          ...wrongDataAlert, 
          email:false
          })
        }
      }
    }
  }

  let onChange=(e:any, name:string)=>{
    setUseInfo({
      ...userInfo,
      [name]: e.target.value
      })
  }
    
  let onClicklogin=async()=>{
    let dataToSent={
      ...userInfo
    }
    if(wrongDataAlert.email==false){
      let response = await fetch (backendUrl+"/public/users/verification",{
      
          method: 'POST',
          headers: {
          'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            email : dataToSent.email,
            password: dataToSent.password
        })
      })

      if(response.ok){
          let data = await response.json()
          if(data.apiKey){
              localStorage.setItem('apiKey', data.apiKey);
              localStorage.setItem('email', data.email);
              localStorage.setItem('id', data.id);
              console.log(localStorage.getItem('apiKey'))
          }else{
            setWrongDataAlert({
              ...wrongDataAlert, 
              password:true
              })
          }
      }
    }else{
      checkEmail()
    }

  }

    
  return (
  <Row align="middle" justify="center" style = {{ minHeight: '100vh', backgroundColor:"#EDEEF0"}}>
   
    <Form
      name="normal_login"
      className="login-form"
      initialValues={{ remember: true }}
      onFinish={onClicklogin}
      style={{ minWidth:300, backgroundColor:"white", padding:20, borderRadius:"20px" }}
    > 
      <Form.Item>
        <h2>Aplicación para crear tus propias pruebas</h2>
      </Form.Item>
     {wrongDataAlert.email && <Alert message="Correo electrónico no existe" type="error" showIcon style={{marginBottom:20}}/>}
      <Form.Item
        name="email"
        rules={[{ required: true, message: 'Please input your Email!' }]}
      >
        <Input onBlur={checkEmail} prefix={<UserOutlined className="site-form-item-icon" />} onChange={(e)=>{onChange(e, "email")}} placeholder="Email" />
      </Form.Item>
      {wrongDataAlert.password && <Alert message="Contraseña incorrecta" type="error" showIcon style={{marginBottom:20}}/>}
      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Please input your Password!' }]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
          onChange={(e)=>{onChange(e, "password")}} 
        />
      </Form.Item>

      <Form.Item>
        <a className="login-form-forgot" href="/checkEmail">
          Forgot password
        </a>
      </Form.Item>

      <Form.Item style={{justifyContent:"center", alignItems:"center", display:"flex"}}>
        <Button type="primary" htmlType="submit" className="login-form-button">
          Log in
        </Button>
      </Form.Item>
      <Form.Item style={{justifyContent:"center", alignItems:"center", display:"flex"}}>
        <Button type="default" onClick={()=>{navigate("/registration")}}>
          Registracion
        </Button>
      </Form.Item>
      <Form.Item  style={{justifyContent:"center", alignItems:"center", display:"flex"}}>
      <GoogleLogin
        onSuccess={credentialResponse => {
            console.log(credentialResponse);
        }}
        onError={() => {
            console.log('Login Failed');
        }}
        />
      </Form.Item>
    </Form>
  </Row>
      );
};

export default Login;
