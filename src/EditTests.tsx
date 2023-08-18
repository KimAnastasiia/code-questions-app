import React, { useEffect, useState, useRef } from 'react';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Row, Select, Form, Input, Space } from 'antd';
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
  const { TextArea } = Input;
  const navigate = useNavigate();
  const { id } = useParams()
  const [questions, setQuestions] = useState<test[]>([])
  useEffect(() => {
    getPrevValueOfTest()
  }, [])

  const getPrevValueOfTest = async () => {
    let response = await fetch(backendUrl + `/createdTests/${id}?access_token=` + localStorage.getItem("access_token"))
    if (response.ok) {
      let data = await response.json();
      setQuestions(data);
    }
  }

  return (
    <Row align="middle" justify="center" style={{ minHeight: '100vh', backgroundColor: "#EDEEF0" }}>
      <Space align="baseline" style={{ display: "block",marginBottom: 20, backgroundColor: "white", padding: 30 }}>
        <Form.Item
          rules={[{ required: true, message: 'Please input name of test!' }]}
          label="Nombre de la prueba "
          labelCol={{ span: 24 }}
        >
          <Input value={questions[0]?.nameOfTest} prefix={<FormOutlined />} placeholder="Nombre de la prueba" />
        </Form.Item>
        {questions.map((question, index) =>

          <>
            <Form.Item
              label={"pregunta " + (index + 1)}
              rules={[{ required: true, message: 'Desaparecida pregunta' }]}
              style={{ minWidth: 600, marginTop: 20, fontWeight: 'bold' }}
              labelCol={{ span: 24 }}
            >
              <TextArea value={question.question} />
            </Form.Item>
            <Form.Item
              label="code "
              rules={[{ required: true, message: 'Desaparecida codigo' }]}
              style={{ minWidth: 600, marginTop: 20 }}
              labelCol={{ span: 24 }}
            >

              <CodeMirror
                extensions={[javascript({ jsx: true })]}
                editable={true}
                value={question.code}
              />
            </Form.Item>
            <Form.Item
              label={"la respuesta A de la pregunta " + (index + 1)}
              rules={[{ required: true, message: 'Desaparecida respuesta' }]}
              style={{ width: 500 }}
              labelCol={{ span: 24 }}

            >
              <Input value={question.answer1}></Input>
            </Form.Item>
            <Form.Item
              label={"la respuesta B de la pregunta " + (index + 1)}
              rules={[{ required: true, message: 'Desaparecida respuesta' }]}
              style={{ width: 500 }}
              labelCol={{ span: 24 }}
            >
              <Input value={question.answer2}></Input>
            </Form.Item>
            <Form.Item
              label={"la respuesta C de la pregunta " + (index + 1)}
              rules={[{ required: true, message: 'Desaparecida respuesta' }]}
              style={{ width: 500 }}
              labelCol={{ span: 24 }}
            >
              <Input value={question.answer3}></Input>
            </Form.Item>
            <Form.Item

              label={"la respuesta D de la pregunta " + (index + 1)}

              rules={[{ required: true, message: 'Desaparecida respuesta' }]}
              style={{ width: 500 }}
              labelCol={{ span: 24 }}
            >
              <Input value={question.answer4}></Input>
            </Form.Item>

            <Form.Item

              label="respuesta de verda "

              rules={[{ required: true, message: 'Desaparecida respuesta' }]}
              style={{ marginRight: 20, paddingBottom: 20,  borderBottom: '2px solid red', }}
              labelCol={{ span: 24 }}
            >
              <Select
                defaultValue={question.rightAnswer}
                options={[
                  { value: "A", label: "A" },
                  { value: "B", label: "B" },
                  { value: "C", label: "C" },
                  { value: "D", label: "D", },
                ]}
              />
            </Form.Item>

          </>

        )}
        <Button type='primary' style={{width:"100%"}}>Salvar</Button>
      </Space>
    </Row>
  );
};

export default EditTests;