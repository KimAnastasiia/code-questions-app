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
export type NotificationType = 'success' | 'info' | 'warning' | 'error';

interface CreateTestProps {
  openNotification: (placement: NotificationPlacement, text: string, type: NotificationType) => void,
}

const CreateTest: React.FC<CreateTestProps> = ({ openNotification }) => {

  const navigate = useNavigate();
  const { TextArea } = Input;
  const [testName, setTestName] = useState<string>("")
  const [errorFile, setErrorFile] = useState<boolean>(false)
  const [question, setQuestion] = useState<string>("")
  const [answer1, setAnswer1] = useState<string>("")
  const [answer2, setAnswer2] = useState<string>("")
  const [answer3, setAnswer3] = useState<string>("")
  const [answer4, setAnswer4] = useState<string>("")
  const [rightAnswer, setRightAnswer] = useState<string>("")
  const [code, setCode] = useState<string>("")
  let nextIndex = useRef<number>(0)
  const createdTest = useRef<test[]>([])

  let save = (index: number) => {
    const newTest = {
      question: question,
      code: code,
      answer1: answer1,
      answer2: answer2,
      answer3: answer3,
      answer4: answer4,
      rightAnswer: rightAnswer,
      nameOfTest: testName,
      index: index
    };
    createdTest.current = [...createdTest.current, newTest]
    setAnswer1("")
    setAnswer2("")
    setAnswer3("")
    setAnswer4("")
    setQuestion("")
    setRightAnswer("")
    setCode("")
    console.log(createTest)
  }
  useEffect(() => {
    setErrorFile(false)
  }, [testName])

  const onChange = (e: any) => {
    setTestName(e.currentTarget.value)
  }

  const createTest = async (id: number) => {
    let testToSent = createdTest.current
    let response = await fetch(backendUrl + "/createdTests?access_token=" + localStorage.getItem('access_token') + "&testId=" + id, {

      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testToSent)
    })

  }

  let addTest = async () => {

    let response = await fetch(backendUrl + "/test/createdTest?access_token=" + localStorage.getItem("access_token") + "&testName=" + testName, {
      method: 'POST'
    })
    if (response.ok) {
      let data = await response.json()
      createTest(data.insertId)
      openNotification("top", "Prueba creada con éxito", "success")
    } else {
      openNotification("top", "Prueba no creada ", "error")
    }
  }


  const deleteQuestionFromList = (indexToDelete: number) => {
    let newListOfTests = createdTest.current.filter((test) => test.index != indexToDelete)
    createdTest.current = newListOfTests
  }
  const addNewQuestion = () => {

    if (nextIndex.current != 0) {
      save(nextIndex.current)
    }

    nextIndex.current = nextIndex.current + 1
  }
  const onChangeCode = React.useCallback((value: any, viewUpdate: any) => {
    setCode(value)
  }, []);
  return (
    <Row align="middle" justify="center" style={{ minHeight: '100vh', backgroundColor: "#EDEEF0" }}>

      <Form
        initialValues={{ remember: true }}

        style={{ backgroundColor: "white", padding: 20, borderRadius: "20px" }}
      >
        <Form.Item style={{ justifyContent: "center", alignItems: "center", display: "flex" }}>
          <h2>Crea tu prueba</h2>
        </Form.Item>
        {errorFile && <Alert message="Por favor agregue el archivo y el nombre del archivo" type="error" showIcon style={{ marginBottom: 20 }} />}
        <Form.Item
          rules={[{ required: true, message: 'Please input name of test!' }]}
          label="Nombre de la prueba "
          labelCol={{ span: 24 }}
        >
          <Input value={testName} prefix={<FormOutlined />} placeholder="Nombre de la prueba" onChange={(e) => { onChange(e) }} />
        </Form.Item>
        <Form.List name="pregunta">

          {(fields, { add, remove }) => (
            <>
              {fields.map((field) => (
                <Space key={field.key} align="baseline" style={{ display: "block", borderBottom: '2px solid red', marginBottom: 20 }}>


                  <Form.Item
                    {...field}
                    label="pregunta "
                    name={[field.name, 'pregunta']}
                    rules={[{ required: true, message: 'Desaparecida pregunta' }]}
                    style={{ minWidth: 600, marginTop: 20 }}
                    labelCol={{ span: 24 }}
                  >
                    <TextArea onChange={(e) => { setQuestion(e.currentTarget.value) }} />
                  </Form.Item>
                  <Form.Item
                    {...field}
                    label="code "
                    name={[field.name, 'code']}
                    rules={[{ required: true, message: 'Desaparecida codigo' }]}
                    style={{ minWidth: 600, marginTop: 20 }}
                    labelCol={{ span: 24 }}
                  >

                    <CodeMirror
                      value={code}
                      extensions={[javascript({ jsx: true })]}
                      onChange={onChangeCode}
                      editable={true}
                    />
                  </Form.Item>
                  <Form.Item
                    {...field}
                    label={"la respuesta A de la pregunta " + (field.key + 1)}
                    name={[field.name, 'respuesta1']}
                    rules={[{ required: true, message: 'Desaparecida respuesta' }]}
                    style={{ width: 500 }}
                    labelCol={{ span: 24 }}
                  >
                    <Input onChange={(e) => { setAnswer1(e.currentTarget.value) }}></Input>
                  </Form.Item>
                  <Form.Item
                    {...field}
                    label={"la respuesta B de la pregunta " + (field.key + 1)}
                    name={[field.name, 'respuesta2']}
                    rules={[{ required: true, message: 'Desaparecida respuesta' }]}
                    style={{ width: 500 }}
                    labelCol={{ span: 24 }}
                  >
                    <Input onChange={(e) => { setAnswer2(e.currentTarget.value) }}></Input>
                  </Form.Item>
                  <Form.Item
                    {...field}
                    label={"la respuesta C de la pregunta " + (field.key + 1)}
                    name={[field.name, 'respuesta3']}
                    rules={[{ required: true, message: 'Desaparecida respuesta' }]}
                    style={{ width: 500 }}
                    labelCol={{ span: 24 }}
                  >
                    <Input onChange={(e) => { setAnswer3(e.currentTarget.value) }}></Input>
                  </Form.Item>
                  <Form.Item
                    {...field}
                    label={"la respuesta E de la pregunta " + (field.key + 1)}
                    name={[field.name, 'respuesta4']}
                    rules={[{ required: true, message: 'Desaparecida respuesta' }]}
                    style={{ width: 500 }}
                    labelCol={{ span: 24 }}
                  >
                    <Input onChange={(e) => { setAnswer4(e.currentTarget.value) }}></Input>
                  </Form.Item>

                  <Form.Item
                    {...field}
                    label="respuesta de verda "
                    name={[field.name, 'respuesta']}
                    rules={[{ required: true, message: 'Desaparecida respuesta' }]}
                    style={{ marginRight: 20, fontWeight: 'bold' }}
                    labelCol={{ span: 24 }}
                  >
                    <Select
                      onChange={(e) => { setRightAnswer(e) }}
                      options={[
                        { value: "A", label: "A" },
                        { value: "B", label: "B" },
                        { value: "C", label: "C" },
                        { value: "D", label: "D", },
                      ]}
                    />
                  </Form.Item>

                  <Button danger onClick={() => {
                    deleteQuestionFromList(field.key + 1);
                    remove(field.name)
                  }} style={{ margin: 20 }}> <DeleteOutlined />Borrar la pregunta</Button>

                </Space>
              ))}

              <Form.Item>
                <Button style={{ marginTop: 20 }} type="dashed" onClick={() => {
                  addNewQuestion();
                  add()
                }
                } block icon={<PlusOutlined />}>
                  Añadir pregunta
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item style={{ width: "100%" }}>
          <Button style={{ width: "100%" }} type="primary" onClick={() => { addNewQuestion(); addTest() }}>
            Crear la prueba
          </Button>
        </Form.Item>

      </Form>
    </Row>
  );
};

export default CreateTest;
