import { Route, Routes, Link } from "react-router-dom"
import Login from "./Login";
import React, { useEffect, useState } from 'react';
import CheckEmailForRestorePassword from "./CheckEmailForRestorePassword";
import RestorePassword from "./RestorePassword";
import {  Menu, notification } from 'antd';
import type { NotificationPlacement } from 'antd/es/notification/interface'
import Registration from "./Registration";
import CreateTest from "./CreateTest";
import MenuFunction from "./Menu";
import ListTests from "./ListTests";
import Test from "./Test";
import Results from "./Results";
import BeforeTakingTheTest from "./BeforeTakingTheTest";
import ResultsList from "./ResultsList";
import AnswersStatistic from "./AnswersStatistic";
import UploadTest from "./UploadTest";
import EditTests from "./EditTests";
import { useNavigate   } from "react-router-dom";
export interface ResultsInterface {
  questionNumber:number,
  answer:boolean,
  userAnswer:string
}
export type NotificationType = 'success' | 'info' | 'warning' | 'error';
function App() {

  const [api, contextHolder] = notification.useNotification();
  const navigate  = useNavigate();
  let [goOut, setGoOut]=useState<boolean>(false)
  useEffect (() => {
    const currentUrl = window.location.href;
    if(localStorage.getItem("access_token") ){

    }else{
      if(currentUrl!="http://localhost:3000" && !currentUrl.startsWith("http://localhost:3000/test/") ){
        //navigate("/")
      }
    }
  }, [])

  const openNotification = (placement: NotificationPlacement, text:string, type:NotificationType) => {
    api[type]({
      message: `Notification`,
      description:text,
      placement,
    });
  };

  return (
    <>
    {contextHolder}
    {localStorage.getItem("access_token") && <MenuFunction setGoOut={() => setGoOut(false)}/>}
    <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/checkEmail" element={<CheckEmailForRestorePassword/>}/>  
        <Route path="/registration" element={<Registration  openNotification={openNotification}/>}/> 
        <Route path="/changePassword/:email" element={<RestorePassword openNotification={openNotification}/>}/>  
      {localStorage.getItem("access_token") && <Route path="/createTest" element={<CreateTest openNotification={openNotification}/>}/>  }
      {localStorage.getItem("access_token") &&  <Route path="/myTests" element={<ListTests openNotification={openNotification}/>}/>  }
      {localStorage.getItem("access_token") &&  <Route path="/allResultsOfTest/:testId" element={<ResultsList/>}/>  }
      {localStorage.getItem("access_token") &&  <Route path="/answersStatistic/:testId" element={<AnswersStatistic/>}/>  }
      {localStorage.getItem("access_token") && <Route path="/uploadTest" element={<UploadTest openNotification={openNotification}/>}/>  }
      <Route path="/test/:email/:name/:id" element={<Test/>}/>
      <Route path="/test/results/:email/:name/:id" element={<Results/>}/>
      <Route path="/test/pass/:email/:name/:id" element={<BeforeTakingTheTest/>}/>
      <Route path="/test/edit/:id" element={<EditTests openNotification={openNotification}/>}/>
    </Routes>
    </>

  );
}

export default App;
