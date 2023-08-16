import React, { useEffect, useState } from 'react';
import { Input, Radio, Space, } from 'antd';
import { Button, Alert, Form, Row } from 'antd';
import { useNavigate   } from "react-router-dom";
import { useParams } from 'react-router-dom';
import { backendUrl } from './Global';
import { useGoogleLogin } from '@react-oauth/google';
const BeforeTakingTheTestCreated:React.FC<{}>=()=>{
  const {email} = useParams()
  const {nameOfTest} = useParams()
  const {id} = useParams()
  const navigate  = useNavigate();
  const [alert, setAlert]=useState<boolean>(false)
  useEffect(() => {
    localStorage.removeItem('access_user_token');
  },[]);

  const login = useGoogleLogin({onSuccess: tokenResponse =>{
    checkUser(tokenResponse.access_token)
  }});

 const checkUser=async(access_user_token:string)=>{
  localStorage.setItem('access_user_token',access_user_token);
  let response = await fetch(backendUrl + "/question?access_user_token="+access_user_token )
  if(response.ok){
    navigate("/testFromDB/"+email+"/"+nameOfTest+"/"+id)
  }else{
    setAlert(true)
  }
}
  return (
  <Row align="middle" justify="center" style = {{ minHeight: '94.7vh', backgroundColor:"#EDEEF0"}}>
    <Form
      initialValues={{ residence: ['zhejiang', 'hangzhou', 'xihu'], prefix: '86' }}
      style={{ minWidth: 500, backgroundColor:"white", padding:50  }}
      scrollToFirstError
    >
{ alert&&<Alert
      message="Error"
      description="El inicio de sesión de google no es válido"
      type="error"
      showIcon
    />}
    <Form.Item >
      <Button style={{width:"100%", marginTop:20}} type='primary' onClick={() => login()}>  Sign in with Google 🚀</Button>
    </Form.Item>

    <Form.Item >
      <Button onClick={()=>{navigate("/testFromDB/"+email+"/"+nameOfTest+"/"+id)}} style={{width:"100%"}}>Aprobar el examen sin correo</Button>
    </Form.Item>

    </Form>
  </Row>
 
  );
}
export default BeforeTakingTheTestCreated;