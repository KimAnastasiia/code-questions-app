import React, { useEffect, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { backendUrl } from './Global';
import { useParams } from 'react-router-dom';
import type { RadioChangeEvent } from 'antd';
import { Input, Radio, Space, } from 'antd';
import { Button, Alert, Form, Row } from 'antd';
import { useNavigate } from "react-router-dom";
import Question from './Models/Question';

export interface AnswersInterface {
  questionNumber: number,
  answerText: string
}

const Test: React.FC<{}> = () => {

  const [alert, setAlert] = useState<boolean>(false)
  const { email } = useParams()
  const { name } = useParams()
  const { id } = useParams()
  let [index, setIndex] = useState<number>(0)
  const [questions, setQuestions] = useState<Question[]>([])
  const [answer, setAnswer] = useState<AnswersInterface[]>([])
  const [isAnswerSelected, setIsAnswerSelected] = useState(true);

  const navigate = useNavigate();
  useEffect(() => {
    fechData();
  }, [])

  let fechData = async () => {
    let response = await fetch(backendUrl + `/question/${id}/`)
    if (response.ok) {
      let data = await response.json();
      setQuestions(data);
    }
  }

  const onChange = React.useCallback((value: any, viewUpdate: any) => {
  }, []);



  const onChange2 = (e: RadioChangeEvent, questionNumber: number) => {

    let prevAns = [...answer]
    prevAns = prevAns.filter((answer) => answer.questionNumber != questionNumber)

    setAnswer([
      ...prevAns,
      {
        questionNumber: questionNumber,
        answerText: e.target.value
      }
    ]);
    setIsAnswerSelected(false);
  };

  const nextQuastion = async () => {
    setIndex(index + 1)
    console.log(answer)
    setIsAnswerSelected(true);
  }
  const prevQuestion = () => {

    if (index != 0) {
      setIndex(index - 1)
    }
  }
  const onFinish = async () => {
    let response = await fetch(backendUrl + `/question/${id}?access_user_token=` + localStorage.getItem('access_user_token'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(answer)
    })
    if (response.ok) {
      let data = await response.json()
      if (data.listOfMarks) {
        localStorage.setItem('listOfResults', JSON.stringify(data.listOfMarks));
        localStorage.setItem('mark', data.mark);
        navigate("/test/results/" + email + "/" + name + "/" + id)
      }
    } else {
      setAlert(true)

    }
  }
  return (

<>
      {questions.map((question, i) => {
        if (i == index && i < questions.length) {

          return (
            <div style={{ backgroundColor: "white", minHeight: '70vh', padding: 60 }}>
              {alert &&
                <Alert
                  message="Error"
                  description="Ocurrió un error al completar la prueba, vuelva a realizar la prueba"
                  type="error"
                  showIcon
                  style={{ marginBottom: 20 }}
                />}
              <p>{(index + 1) + "/" + questions.length + question.question}</p>

              {question.code.length > 0 &&
                <CodeMirror
                  value={question.code}
                  extensions={[javascript({ jsx: true })]}
                  onChange={onChange}
                  editable={false}
                />}

              <Radio.Group value={answer.find((a) => a.questionNumber == i + 1)?.answerText} onChange={(e) => { onChange2(e, (i + 1)) }} style={{ marginTop: 40, marginBottom: 40 }}>

                <Space direction="vertical">
                  <Radio value={"A"}>A. {question.answer1}</Radio>
                  <Radio value={"B"}>B. {question.answer2}</Radio>
                  <Radio value={"C"}>C. {question.answer3}</Radio>
                  <Radio value={"D"}>D. {question.answer4}</Radio>
                </Space>

              </Radio.Group>


              <Button style={{ width: "100%", display: index + 1 == questions.length ? "none" : "block", marginBottom: 20 }} type='primary' disabled={isAnswerSelected} onClick={nextQuastion}>Próxima pregunta</Button>
              <Button style={{ width: "100%", marginBottom: 20, display: index == (questions.length - 1) ? "block" : "none" }} type='primary' disabled={isAnswerSelected} onClick={onFinish}>Finalizar</Button>
              <Button style={{ width: "100%", display: index == 0 ? "none" : "block" }} onClick={prevQuestion}>Devolver</Button>


            </div>)
        }
      }
      )}
</>



  );
}
export default Test;