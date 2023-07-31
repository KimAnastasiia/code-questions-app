import React, { useEffect, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { useNavigate   } from "react-router-dom";
import { backendUrl } from './Global';
import { Button } from 'antd';

function App() {
  
  let [userInfo, setUseInfo]=useState({
    email:"",
    password:""
  })

  let onchange=(e:any, name:string)=>{
    setUseInfo({
      ...userInfo,
      [name]: e.target.value
      })
  }
  
  let onClicklogin=async()=>{
    let dataToSent={
      ...userInfo
    }
    let response = await fetch (backendUrl+"/public/users/verification",{
    
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          email : dataToSent.email,
          password: dataToSent.password
      })
    })

    if(response.ok){
        let data = await response.json()
        
        if(!data.apiKey){
            if(data.messege === "Incorrect password"){
                console.log(data.messege)
            }
        }
        if(data.apiKey){
            localStorage.setItem('apiKey', data.apiKey);
            localStorage.setItem('email', data.email);
            localStorage.setItem('id', data.id);
            console.log(localStorage.getItem('apiKey'))
        }
    }


}
  return (
    <div>
      
    <input onChange={e=>{onchange(e, "email")}}></input>
    <input  onChange={e=>{onchange(e, "password")}}></input>
    <button onClick={onClicklogin}>Sign in </button>
    <button>You dont have an account yet? </button>
    <Button type="primary">Primary Button</Button>
    </div>
  );
}
export default App;
