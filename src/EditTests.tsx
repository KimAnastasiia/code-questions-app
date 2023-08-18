import React, { useEffect, useState, useRef } from 'react';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, message, Select, Alert, Form, Input, Row, Space } from 'antd';
import { useNavigate } from "react-router-dom";
import type { NotificationPlacement } from 'antd/es/notification/interface'
import type { UploadProps } from 'antd';
import { backendUrl } from './Global';
import { LockOutlined, FormOutlined } from '@ant-design/icons';
import { javascript } from '@codemirror/lang-javascript';
import test from './Models/test';
import CodeMirror from '@uiw/react-codemirror';
import { useParams } from 'react-router-dom';
export type NotificationType = 'success' | 'info' | 'warning' | 'error';

interface EditTestsProps {
  openNotification: (placement: NotificationPlacement, text: string, type: NotificationType) => void,
}

const EditTests: React.FC<EditTestsProps> = ({ openNotification }) => {

  const navigate = useNavigate();
  const { id } = useParams()
  const [questions, setQuestions] = useState<test[]>([])
  useEffect(() => {
    getPrevValueOfTest()
  }, [])

  const getPrevValueOfTest = async () => {
    let response = await fetch(backendUrl + `/createdTests/${id}?access_token=`+localStorage.getItem("access_token"))
    if (response.ok) {
      let data = await response.json();
      setQuestions(data);
    }
  }

  return (
    <div></div>
  );
};

export default EditTests;