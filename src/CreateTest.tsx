import React, { useEffect, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Upload, Alert, Form, Input, Row } from 'antd';
import { useNavigate   } from "react-router-dom";
import type { NotificationPlacement } from 'antd/es/notification/interface'
import type { UploadProps } from 'antd';
import { backendUrl } from './Global';
import { LockOutlined, FormOutlined } from '@ant-design/icons';
export type NotificationType = 'success' | 'info' | 'warning' | 'error';
interface CreateTestProps {
    openNotification:(placement: NotificationPlacement, text:string,  type:NotificationType) => void,
}

const CreateTest :React.FC<CreateTestProps> = ({openNotification}) =>{

    const navigate  = useNavigate();
    const [myFile, setMyFile]=useState<any>()
    const [testName, setTestName]=useState<string>("")
    const [errorFile, setErrorFile]=useState<boolean>(false)

    useEffect(() => {
     setErrorFile(false)
    },[testName])

    const props: UploadProps = {
        name: 'file',
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        headers: {
          authorization: 'authorization-text',
        },
        onChange(info) {
          if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
          }
          if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
            setMyFile(info.file.originFileObj)
          } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
          }
      
        },
      };

    let addTest=async()=>{
      let locSt = localStorage.getItem("access_token") 

      if(myFile!=undefined && myFile!=null &&  locSt!=undefined && testName!=undefined && testName!=""){

        setErrorFile(false)
        const formData = new FormData();
        formData.append('myFileTest', myFile);
        formData.append('testName', testName);
        formData.append('access_token', locSt );
          let response = await fetch (backendUrl+"/test?access_token="+ localStorage.getItem("access_token") ,{
              method: 'POST',
              body:formData
          })
          if(response.ok){
            openNotification("top", "Prueba creada con éxito", "success")
            setMyFile(null)
            setTestName("")
          }else{
              openNotification("top", "Prueba no creada ", "error")
          }
      }else{
        setErrorFile(true)
      }

    }
    const onChange=(e:any)=>{
      setTestName(e.currentTarget.value)
    }
  return (
    <Row align="middle" justify="center" style = {{ minHeight: '100vh', backgroundColor:"#EDEEF0"}}>

    <Form
      initialValues={{ remember: true }}
      onFinish={addTest}
      style={{ minWidth:300, backgroundColor:"white", padding:20, borderRadius:"20px" }}
        > 
        <Form.Item style={{justifyContent:"center", alignItems:"center", display:"flex"}}>
            <h2>Crea tu prueba</h2>
        </Form.Item>
        {errorFile && <Alert message="Por favor agregue el archivo y el nombre del archivo" type="error" showIcon style={{marginBottom:20}}/>}
        <Form.Item
            rules={[{ required: true, message: 'Please input name of test!' }]}
        >
            <Input value={testName} prefix={<FormOutlined />} placeholder="Nombre de la prueba" onChange={(e)=>{onChange(e)}}/>
        </Form.Item>
        <Form.Item rules={[{ required: true, message: 'Please input test!' }]} style={{justifyContent:"center", alignItems:"center", display:"flex"}}>
            <Upload {...props}  >
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
        </Form.Item>

        <Form.Item style={{justifyContent:"center", alignItems:"center", display:"flex"}}>
            <Button type="primary" htmlType="submit" >
                Crear
            </Button>
        </Form.Item>

      
    </Form>
    </Row>
    );
};

export default CreateTest;
