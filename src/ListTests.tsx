import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Avatar, Row, List, Button } from 'antd';
import { useNavigate   } from "react-router-dom";
import { backendUrl } from './Global';
interface listOfTestsInterface {
    name:string,
    id:number,
    email:string
}
const ListTests = () => {

  const navigate  = useNavigate();

  const [listOfTests, setListOfTests]=useState<listOfTestsInterface[]>([])
  useEffect(() => {
    getAllTests()
  },[]);

  const getAllTests=async()=>{
    let response = await fetch(backendUrl + "/test?access_token="+localStorage.getItem("access_token") )
    if(response.ok){
      let data = await response.json()
      setListOfTests(data)
    }
  }
  const handleDelete =async (id:number) => {

    let response = await fetch(backendUrl + '/test?testId='+id+"&access_token="+localStorage.getItem("access_token"), {
      method: 'DELETE'
    })
    if(response.ok){
        getAllTests()
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
                title={<a href="https://ant.design">{item.name}</a>}
                description={item.email}
                />
                <Button  danger style={{marginRight:10}} onClick={()=>{handleDelete(item.id)}}>Delete</Button>
                <Button onClick={()=>{navigate("/test"+"/"+item.email+"/"+item.name+"/"+item.id)}}>Aprobar el examen</Button>
            </List.Item>

            )}
        />

    </Row>
  );
};

export default ListTests;
