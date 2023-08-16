import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Avatar, Row, List, Button } from 'antd';
import { useNavigate   } from "react-router-dom";
import { backendUrl } from './Global';

interface ListTestsFromDBInterface {
    nameOfTest:string,
    email:string
}
const ListTestsFromDB = () => {

  const navigate  = useNavigate();

  const [listOfTests, setListOfTests]=useState<ListTestsFromDBInterface[]>([])

  useEffect(() => {
    getAllTests()
  },[]);

  const getAllTests=async()=>{
    let response = await fetch(backendUrl + "/createdTests?access_token="+localStorage.getItem("access_token") )
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
                title={item.nameOfTest}
                description={item.email}
                />
               <Button onClick={()=>{navigate("/testFromDB"+"/"+item.email+"/"+item.nameOfTest)}}>Aprobar el examen</Button>
            </List.Item>

            )}
        />

    </Row>
  );
};

export default ListTestsFromDB;
