import React, { useEffect, useState } from 'react';
import type { NotificationPlacement } from 'antd/es/notification/interface'
import { Avatar, Row, List, Button } from 'antd';
import { useNavigate   } from "react-router-dom";
import { backendUrl } from './Global';
import { AreaChartOutlined, DeleteOutlined } from '@ant-design/icons';
interface listOfTestsInterface {
    name:string,
    id:number,
    email:string
}
export type NotificationType = 'success' | 'info' | 'warning' | 'error';
interface ListTestsProps {
  openNotification:(placement: NotificationPlacement, text:string,  type:NotificationType) => void,
}
const ListTests  :React.FC<ListTestsProps> = ({openNotification})=> {

  const navigate  = useNavigate();

  const [listOfTests, setListOfTests]=useState<listOfTestsInterface[]>([])
  useEffect(() => {
    getAllTests()
  },[]);

  const getAllTests=async()=>{
    let response = await fetch(backendUrl + "/test?access_token="+localStorage.getItem("access_token") )
    if(response.ok){
      let data = await response.json()
      data= data.sort((a: { id: number; }, b: { id: number; },)=>b.id-a.id)
      setListOfTests(data)
    }
  }
  const handleDelete = async (id: number) => {

    let response = await fetch(backendUrl + '/createdTests?testId=' + id + "&access_token=" + localStorage.getItem("access_token"), {
      method: 'DELETE'
    })
    if (response.ok) {
      handleDeleteResultsOfTest(id)
    }else{
      openNotification("top", "Ocurrió un error al eliminar las preguntas de la prueba", "error")
    }


  };
  const handleDeleteResultsOfTest = async (id: number) => {

    let response = await fetch(backendUrl + '/testresults?testId=' + id + "&access_token=" + localStorage.getItem("access_token"), {
      method: 'DELETE'
    })
    if (response.ok) {
      handleDeleteFromTest(id)
    }else{
      openNotification("top", "Ocurrió un error al eliminar los resultados de la prueba", "error")
    }

  };
  const handleDeleteFromTest =async (id:number) => {

    let response = await fetch(backendUrl + '/test?testId='+id+"&access_token="+localStorage.getItem("access_token"), {
      method: 'DELETE'
    })
    if(response.ok){
        getAllTests()
        openNotification("top", "Prueba eliminada con éxito", "success")
    }else{
      openNotification("top", "Se produjo un error al eliminar la prueba", "error")
    }
    
  };
  return  (
    <Row align="top" justify="center" style = {{ minHeight: '100vh', backgroundColor:"#EDEEF0", paddingTop:40}}>

        <List
            dataSource={listOfTests}
            style={{padding:30, width:"50%",backgroundColor:"white"}}

            renderItem={(item) => (

            <List.Item key={item.email}>
                <List.Item.Meta
                title={item.name}
                description={item.email}
                />
                <Button  danger style={{marginRight:10}} onClick={()=>{handleDelete(item.id)}}><DeleteOutlined/>Delete</Button>
                <Button onClick={()=>{navigate("/test/pass"+"/"+item.email+"/"+item.name+"/"+item.id)}}>Aprobar el examen</Button>
                <Button onClick={()=>{navigate("/allResultsOfTest/"+item.id)}} style={{marginLeft:10}} >Resultats</Button>
                <Button onClick={()=>{navigate("/answersStatistic/"+item.id)}} style={{marginLeft:10}} ><AreaChartOutlined />Statistic</Button>
            </List.Item>

            )}
        />

    </Row>
  );
};

export default ListTests;
