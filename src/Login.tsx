import React, { useEffect, useState } from 'react';
import { backendUrl } from './Global';
import { GoogleLogin } from '@react-oauth/google';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Alert, Form, Input, Row } from 'antd';
import { useNavigate   } from "react-router-dom";
import { useGoogleLogin } from '@react-oauth/google';
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

  const login = useGoogleLogin({onSuccess: tokenResponse =>{

     console.log(tokenResponse)
     localStorage.setItem('access_token',tokenResponse.access_token);
     setTimeout(()=>{
      navigate("/createTest")
     }, 1000)
    },
  });
    
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
      
      <Form.Item>
        <Button style={{width:"100%"}} onClick={() => login()}>  Sign in with Google 🚀</Button>
      </Form.Item>
    </Form>
  </Row>
      );
};

export default Login;
