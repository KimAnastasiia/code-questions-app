import React, { useEffect, useState } from 'react';
import { backendUrl } from './Global';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Alert, Form, Input, Row } from 'antd';
import { useParams } from 'react-router-dom';
import type { NotificationPlacement } from 'antd/es/notification/interface'
import { useNavigate   } from "react-router-dom";
export type NotificationType = 'success' | 'info' | 'warning' | 'error';
interface RestorePasswordProps {
  openNotification:(placement: NotificationPlacement, text:string,  type:NotificationType) => void,
}
const RestorePassword:React.FC<RestorePasswordProps> = ({openNotification}) =>{

    const [password, setPassword]=useState({
        passwordOne:"",
        passwordTwo:""
    })
    const navigate  = useNavigate();

    const [passwordError, setPasswordError]=useState<boolean>(false)
    const { email } = useParams();

    useEffect(() => {
        setPasswordError(false)
      },[password.passwordTwo])


    let onChange=(e:any, name:string)=>{

        setPassword({
            ...password,
            [name]: e.target.value
        })
    }

    const onBlurPasswordTwo=()=>{

        if(password.passwordOne!=password.passwordTwo){
            setPasswordError(true)
        }else{
            setPasswordError(false)
        }
    }
    const editPassword =async() => {
        onBlurPasswordTwo()
        let passwordToSent = password.passwordTwo

        if(passwordError==false){
          let response = await  fetch(backendUrl+"/public/users", {
              method: 'PUT',
              headers: {
              'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                email:email,
                password:passwordToSent
              })
          })
          if(response.ok){
            let data = await response.json()
            if(data.message=="done"){
                navigate("/")
                openNotification("top", "Contraseña cambiada con éxito", "success")
            }else{
                openNotification("top", "Contraseña no cambiada", "error")
            }
          }
        }  
    };
    
  return (
  <Row align="middle" justify="center" style = {{ minHeight: '100vh', backgroundColor:"#EDEEF0"}}>
   
    <Form
      name="normal_login"
      className="login-form"
      initialValues={{ remember: true }}
      onFinish={editPassword}
      style={{ minWidth:300, backgroundColor:"white", padding:20, borderRadius:"20px" }}
    > 
      <Form.Item>
        <h2>Cambiar la contraseña</h2>
      </Form.Item>

      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Please input your Password!' }]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
          onChange={(e)=>{onChange(e, "passwordOne")}} 
        />
      </Form.Item>
      {passwordError && <Alert message="Contraseña no coincide" type="error" showIcon style={{marginBottom:20}}/>}
      <Form.Item
        name="password two"
        rules={[{ required: true, message: 'Please input your Password again!' }]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
          onChange={(e)=>{onChange(e, "passwordTwo")}} 
          onBlur={onBlurPasswordTwo}
        />
      </Form.Item>


      <Form.Item style={{justifyContent:"center", alignItems:"center", display:"flex"}}>
        <Button type="primary" htmlType="submit" className="login-form-button">
            Change
        </Button>
      </Form.Item>


    </Form>
  </Row>
    );

}
export default RestorePassword;
