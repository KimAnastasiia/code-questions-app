import React, { useEffect, useState, useRef } from 'react';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Row, Select, Form, Input, Space, Alert } from 'antd';
import { useNavigate } from "react-router-dom";
import type { NotificationPlacement } from 'antd/es/notification/interface'
import { backendUrl } from './Global';
import { LockOutlined, FormOutlined } from '@ant-design/icons';
import { javascript } from '@codemirror/lang-javascript';
import CodeMirror from '@uiw/react-codemirror';
import { useParams } from 'react-router-dom';
import Question from './Models/Question';
export type NotificationType = 'success' | 'info' | 'warning' | 'error';

interface EditTestsProps {
  openNotification: (placement: NotificationPlacement, text: string, type: NotificationType) => void,
}

const EditTests: React.FC<EditTestsProps> = ({ openNotification }) => {
  const { TextArea } = Input;
  const navigate = useNavigate();
  const { id } = useParams()
  const [questions, setQuestions] = useState<Question[]>([])
  const [name, setName] = useState("")
  const [error, setError]=useState<boolean>(false)

  useEffect(() => {
    getPrevValueOfTest()
    getTestName()
  }, [])

 
  useEffect(() => {
    let question = questions[questions.length-1]
      if(question != null && question.answer1!="" && question.answer2!="" && question.answer3!="" 
        && question.answer4!="" && question.question!="" && question.rightAnswer!=""){
        setError(false)
      }
  }, [questions])


  const getTestName = async () => {
    let response = await fetch(backendUrl + `/test/${id}?access_token=` + localStorage.getItem("access_token"))
    if (response.ok) {
      let data = await response.json()
      setName(data[0].name)
    }
  }
  const getPrevValueOfTest = async () => {
    let response = await fetch(backendUrl + `/questions/private/${id}?access_token=` + localStorage.getItem("access_token"))
    if (response.ok) {
      let data = await response.json();
      setQuestions(data);
    }
  }
  const handleInputChange = (e: any, name: any, numberOfQuestion: number) => {
    let newList: any

    if (name == "code") {
      newList = questions.map((el: any) => {
        if (el.numberOfQuestion == numberOfQuestion) {
          el.code = e
        }
        return el
      })

    } else if (name == "rightAnswer") {
      newList = questions.map((el: any) => {
        if (el.numberOfQuestion == numberOfQuestion) {
          el[name] = e
        }
        return el
      })
    } else {
      newList = questions.map((el: any) => {
        if (el.numberOfQuestion == numberOfQuestion) {
          el[name] = e.currentTarget?.value
        }
        return el
      })
    }

    setQuestions(newList)
  }

  const editTest = async () => {
    let response = await fetch(backendUrl + "/questions/private?access_token=" + localStorage.getItem("access_token"), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(questions)
    })
    if (response.ok) {
      let data = await response.json()
      if (!data.error) {
        openNotification("top", "Prueba editada con éxito", "success")
      } else {
        openNotification("top", "Prueba no editada ", "error")
      }

    } else {
      openNotification("top", "Prueba no editada ", "error")
    }
  }
  const editName = async () => {
    let response = await fetch(backendUrl + `/test/${id}?access_token=` + localStorage.getItem("access_token"), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name
      })
    })
    if (response.ok) {
      let data = await response.json()
      if (!data.error) {
       openNotification("top", "Nombre de la prueba editada con éxito", "success")
      } else {
        openNotification("top", "Nombre de la prueba no editada ", "error")
      }

    } else {
      openNotification("top", "Nombre de la prueba no editada ", "error")
    }
  }
  const deleteQuestion = async (numberOfQuestion: number) => {
    let response = await fetch(backendUrl + `/questions/private/${numberOfQuestion}?testId= ` + id + "&access_token=" + localStorage.getItem("access_token"), {
      method: 'DELETE'
    })
    if (response.ok) {
      openNotification("top", "La pregunta editada con éxito", "success")
     let newQuestions=questions.filter((q)=>q.numberOfQuestion!=numberOfQuestion)
     setQuestions(newQuestions)
    } else {
      openNotification("top", "Ocurrió un error al eliminar las pregunta de la prueba", "error")
    }
   
  }

  const createQuestion = async (save:boolean) => {

    let numberOfNewQuestion=questions[questions.length-1].numberOfQuestion + 1

    let questionForBackend={
      question: "",
      code: "",
      answer1: "",
      answer2: "",
      answer3: "",
      answer4: "",
      rightAnswer: "",
      email:questions[0].email,
      testId:id,
      numberOfQuestion: numberOfNewQuestion
    }
    if (questionForBackend != undefined) {
      let response = await fetch(backendUrl + "/questions/private/addByOne?access_token=" + localStorage.getItem('access_token') + "&testId=" + id, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(questionForBackend)
      })
       if (response.ok) {
        if(save==false){
          setQuestions([...questions,questionForBackend ]) 
        }
      }
    }
  }

  const addNewQuestion = async (save:boolean) => {
  
    setError(true)
    editTest()

    let numberOfNewQuestion=questions[questions.length-1].numberOfQuestion + 1

    let emptyQuestion={
      question: "",
      code: "",
      answer1: "",
      answer2: "",
      answer3: "",
      answer4: "",
      rightAnswer: "",
      numberOfQuestion: numberOfNewQuestion
    }

    setQuestions([...questions, emptyQuestion])

    let question = questions[questions.length-1]

    if(question.answer1!="" && question.answer2!="" 
      && question.answer3!="" && question.answer4!="" && question.question!="" && question.rightAnswer!=""){

      await createQuestion(save)

      if(save==false){
        setError(true)
      }

    }


  }
  return (
    <Row align="middle" justify="center" style={{ backgroundColor: "#EDEEF0" }}>
      <Space align="baseline" style={{ display: "block", marginBottom: 20, backgroundColor: "white", padding: 30 }}>
        <Form.Item
          rules={[{ required: true, message: 'Please input name of test!' }]}
          label="Nombre de la prueba "
          labelCol={{ span: 24 }}
        >
          <Input value={name} onChange={(e) => { setName(e.currentTarget.value) }} prefix={<FormOutlined />} placeholder="Nombre de la prueba" />
        </Form.Item>
        {questions.map((question, index) =>

          <>
            <Form.Item
              label={"pregunta " + (index + 1)}
              rules={[{ required: true, message: 'Desaparecida pregunta' }]}
              style={{ minWidth: 600, marginTop: 20, fontWeight: 'bold' }}
              labelCol={{ span: 24 }}
            >
              <TextArea value={question.question} onChange={(e) => { handleInputChange(e, "question", question.numberOfQuestion) }} />
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
                onChange={(e) => { handleInputChange(e, "code", question.numberOfQuestion) }}
              />
            </Form.Item>
            <Form.Item
              label={"la respuesta A de la pregunta " + (index + 1)}
              rules={[{ required: true, message: 'Desaparecida respuesta' }]}
              style={{ width: 500 }}
              labelCol={{ span: 24 }}

            >
              <Input onChange={(e) => { handleInputChange(e, "answer1", question.numberOfQuestion) }} value={question.answer1}></Input>
            </Form.Item>
            <Form.Item
              label={"la respuesta B de la pregunta " + (index + 1)}
              rules={[{ required: true, message: 'Desaparecida respuesta' }]}
              style={{ width: 500 }}
              labelCol={{ span: 24 }}
            >
              <Input value={question.answer2} onChange={(e) => { handleInputChange(e, "answer2", question.numberOfQuestion) }} ></Input>
            </Form.Item>
            <Form.Item
              label={"la respuesta C de la pregunta " + (index + 1)}
              rules={[{ required: true, message: 'Desaparecida respuesta' }]}
              style={{ width: 500 }}
              labelCol={{ span: 24 }}
            >
              <Input value={question.answer3} onChange={(e) => { handleInputChange(e, "answer3", question.numberOfQuestion) }} ></Input>
            </Form.Item>
            <Form.Item

              label={"la respuesta D de la pregunta " + (index + 1)}

              rules={[{ required: true, message: 'Desaparecida respuesta' }]}
              style={{ width: 500 }}
              labelCol={{ span: 24 }}
            >
              <Input value={question.answer4} onChange={(e) => { handleInputChange(e, "answer4", question.numberOfQuestion) }} ></Input>
            </Form.Item>

            <Form.Item

              label="respuesta de verda "

              rules={[{ required: true, message: 'Desaparecida respuesta' }]}
              style={{ marginRight: 20, paddingBottom: 20, borderBottom: '2px solid red', }}
              labelCol={{ span: 24 }}
            >
              <Select
                onChange={(e) => { handleInputChange(e, "rightAnswer", question.numberOfQuestion) }}
                defaultValue={question.rightAnswer}
                options={[
                  { value: "A", label: "A" },
                  { value: "B", label: "B" },
                  { value: "C", label: "C" },
                  { value: "D", label: "D", },
                ]}
              />
            </Form.Item>
            <Button danger onClick={() => { deleteQuestion(question.numberOfQuestion) }} >Borrar la pregunta</Button>
          </>

        )}
        <Button style={{ marginTop: 20 }} disabled={error} type="dashed" onClick={async () => {
          try{
            await addNewQuestion(false);
          }catch(er){
            console.log(er)
          };
        }
        } block icon={<PlusOutlined />}>
          Añadir pregunta
        </Button>
        <Button type='primary' onClick={() => { editTest(); editName() }} style={{ width: "100%", marginTop: 20 }}>Salvar</Button>
      </Space>
    </Row>
  );
};

export default EditTests