import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Avatar, Row, List, Button } from 'antd';
import { useNavigate   } from "react-router-dom";
import { backendUrl } from './Global';

interface ListTestsFromDBInterface {
    name:string,
    email:string,
    id:number
}
const ListTestsFromDB = () => {

  const navigate  = useNavigate();

  const [listOfTests, setListOfTests]=useState<ListTestsFromDBInterface[]>([])

  useEffect(() => {
    getAllTests()
  },[]);

  const getAllTests=async()=>{
    let response = await fetch(backendUrl + "/test/created?access_token="+localStorage.getItem("access_token") )
    if(response.ok){
      let data = await response.json()
      setListOfTests(data)
    }
  }

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
               <Button onClick={()=>{navigate("/testCreated/pass/"+item.email+"/"+item.name+"/"+item.id)}}>Aprobar el examen</Button>
            </List.Item>

            )}
        />

    </Row>
  );
};

export default ListTestsFromDB;
