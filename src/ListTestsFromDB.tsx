import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Avatar, Row, List, Button } from 'antd';
import type { NotificationPlacement } from 'antd/es/notification/interface'
import { useNavigate } from "react-router-dom";
import { backendUrl } from './Global';
export type NotificationType = 'success' | 'info' | 'warning' | 'error';
interface ListTestsFromDBInterface {
  name: string,
  email: string,
  id: number
}

interface ListTestsFromDBProps {
  openNotification:(placement: NotificationPlacement, text:string,  type:NotificationType) => void,
}
const ListTestsFromDB :React.FC<ListTestsFromDBProps> = ({openNotification}) => {

  const navigate = useNavigate();

  const [listOfTests, setListOfTests] = useState<ListTestsFromDBInterface[]>([])

  useEffect(() => {
    getAllTests()
  }, []);

  const getAllTests = async () => {
    let response = await fetch(backendUrl + "/test/created?access_token=" + localStorage.getItem("access_token"))
    if (response.ok) {
      let data = await response.json()
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
      handleDeleteFromTestTest(id)
    }else{
      openNotification("top", "Ocurrió un error al eliminar los resultados de la prueba", "error")
    }

  };
  const handleDeleteFromTestTest =async (id:number) => {

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
  return (
    <Row align="top" justify="center" style={{ minHeight: '100vh', backgroundColor: "#EDEEF0", paddingTop: 40 }}>

      <List
        dataSource={listOfTests}
        style={{ padding: 30, width: "50%", backgroundColor: "white" }}

        renderItem={(item) => (

          <List.Item key={item.email}>
            <List.Item.Meta
              title={item.name}
              description={item.email}
            />
            <Button danger style={{ marginRight: 10 }} onClick={() => { handleDelete(item.id) }}>Delete</Button>
            <Button onClick={() => { navigate("/testCreated/pass/" + item.email + "/" + item.name + "/" + item.id) }}>Aprobar el examen</Button>

          </List.Item>

        )}
      />

    </Row>
  );
};

export default ListTestsFromDB;
