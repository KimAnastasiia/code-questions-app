import React, { useEffect, useState } from 'react';
import { backendUrl } from './Global';
import { GoogleLogin } from '@react-oauth/google';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Alert, Form, Input, Row } from 'antd';
import { useNavigate   } from "react-router-dom";
import type { NotificationPlacement } from 'antd/es/notification/interface'
export type NotificationType = 'success' | 'info' | 'warning' | 'error';
interface RegistrationProps {
    openNotification:(placement: NotificationPlacement, text:string,  type:NotificationType) => void,
  }
const Registration :React.FC<RegistrationProps> = ({openNotification}) =>{
    const navigate  = useNavigate();

    let [userInfo, setUseInfo]=useState({
        email:"",
        passwordOne:"",
        passwordTwo:""
        })

    let [wrongDataAlert, setWrongDataAlert]=useState({
        emailInUse:false,
        emailFormat:false,
        passwordOne:false,
        passwordTwo:false
    })

    useEffect(() => {
        setWrongDataAlert({
       ...wrongDataAlert, 
       emailInUse:false,
       emailFormat:false,
        })
    },[userInfo.email])
    
    useEffect(() => {
        setWrongDataAlert({
       ...wrongDataAlert, 
       passwordTwo:false
        })
    },[userInfo.passwordTwo])
    
    
    let onBlurEmail=()=>{

        if( userInfo.email!=""){
          const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
          if(!re.test(String(userInfo.email).toLowerCase())){
            setWrongDataAlert({
                ...wrongDataAlert, 
                emailFormat:true
            })
          }else{
            setWrongDataAlert({
                ...wrongDataAlert, 
                emailFormat:false
            })
            checkEmail()
        
          }
        }
       
    }
    const onBlurPaswordTwo=()=>{
        if(userInfo.passwordOne!=userInfo.passwordTwo){
            setWrongDataAlert({
                ...wrongDataAlert, 
                passwordTwo:true
            })
        }else{
            setWrongDataAlert({
                ...wrongDataAlert, 
                passwordTwo:false
            })
        }

    }
    const checkEmail=async()=>{
        if(userInfo.email!=""){

        let response=await fetch(backendUrl + "/public/users?email="+userInfo.email)
        if(response.ok){
            let data = await response.json()
            if(data.message=="user exist"){
            setWrongDataAlert({
            ...wrongDataAlert, 
            emailInUse:true
            })
            }else{
            setWrongDataAlert({
            ...wrongDataAlert, 
            emailInUse:false
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
    if(name=="passwordOne"){

        if(userInfo.passwordOne.length<6){
            setWrongDataAlert({
                ...wrongDataAlert, 
                passwordOne:true
                })
        }else{ 
            setWrongDataAlert({
            ...wrongDataAlert, 
            passwordOne:false
            })
        } 
    }
  }
  const createAccount=async()=>{
    onBlurPaswordTwo()
    if(wrongDataAlert.emailFormat==false&&wrongDataAlert.emailInUse==false&&wrongDataAlert.passwordOne==false&&wrongDataAlert.passwordTwo==false){
        let response = await fetch(backendUrl + '/public/users', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    email:userInfo.email,
                    password:userInfo.passwordTwo,
                }
            )
        })
        if(response.ok){
            let data = await response.json()
            if(data.apiKey){
                localStorage.setItem('apiKey', data.apiKey);
                localStorage.setItem('email', data.email);
                localStorage.setItem('id', data.id);
                console.log(localStorage.getItem('apiKey'))
            }
        }else{
            openNotification("top", "Cuenta no creada", "error")
      }
    }    
  }
    
  return (
  <Row align="middle" justify="center" style = {{ minHeight: '100vh', backgroundColor:"#EDEEF0"}}>
   
    <Form
      initialValues={{ remember: true }}
      onFinish={createAccount}
      style={{ minWidth:300, backgroundColor:"white", padding:20, borderRadius:"20px" }}
    > 
      <Form.Item>
        <h2>Crea tu cuenta</h2>
      </Form.Item>
     {wrongDataAlert.emailInUse && <Alert message="Correo electrónico ya en uso" type="error" showIcon style={{marginBottom:20}}/>}
     {wrongDataAlert.emailFormat && <Alert message="Email incorrecto" type="error" showIcon style={{marginBottom:20}}/>}
      <Form.Item
        name="email"
        rules={[{ required: true, message: 'Please input your Email!' }]}
      >
        <Input onBlur={onBlurEmail} prefix={<UserOutlined className="site-form-item-icon" />} onChange={(e)=>{onChange(e, "email")}} placeholder="Email" />
      </Form.Item>
      {wrongDataAlert.passwordOne && <Alert message="Contraseña esta muy corta" type="error" showIcon style={{marginBottom:20}}/>}
      <Form.Item
        name="password one"
        rules={[{ required: true, message: 'Please input your Password!' }]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
          onChange={(e)=>{onChange(e, "passwordOne")}} 
        />
      </Form.Item>
      {wrongDataAlert.passwordTwo && <Alert message="Contraseña no coincide" type="error" showIcon style={{marginBottom:20}}/>}
      <Form.Item
        name="password two "
        rules={[{ required: true, message: 'Please input your Password!' }]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
          onChange={(e)=>{onChange(e, "passwordTwo")}} 
          onBlur={onBlurPaswordTwo}
        />
      </Form.Item>
      <Form.Item style={{justifyContent:"center", alignItems:"center", display:"flex"}}>
        <Button type="primary" htmlType="submit" className="login-form-button">
            Registracion
        </Button>
      </Form.Item>

      <Form.Item style={{justifyContent:"center", alignItems:"center", display:"flex"}}>
        <Button type="default" onClick={()=>{navigate("/")}} >
            Ya tengo cuenta
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

export default Registration;
