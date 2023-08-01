import { Route, Routes, Link } from "react-router-dom"
import Login from "./Login";
import CheckEmailForRestorePassword from "./CheckEmailForRestorePassword";
import RestorePassword from "./RestorePassword";
import {  notification } from 'antd';
import type { NotificationPlacement } from 'antd/es/notification/interface'
import Registration from "./Registration";

export type NotificationType = 'success' | 'info' | 'warning' | 'error';
function App() {
  const [api, contextHolder] = notification.useNotification();

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
    <Routes>
        <Route path="/" element={<Login/>}/>  
        <Route path="/checkEmail" element={<CheckEmailForRestorePassword/>}/>  
        <Route path="/registration" element={<Registration  openNotification={openNotification}/>}/> 
        <Route path="/changePassword/:email" element={<RestorePassword openNotification={openNotification}/>}/>  
      </Routes>
    </>

  );
}

export default App;
