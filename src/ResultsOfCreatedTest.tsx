import React, { useEffect, useState,useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { backendUrl } from './Global';
import { useParams } from 'react-router-dom';
import quastion from './Models/quastion';
import { useNavigate   } from "react-router-dom";
import type { RadioChangeEvent } from 'antd';
import { Input, Radio, Space, } from 'antd';
import { Button, Alert, Form, Statistic  } from 'antd';
import { async } from 'q';
import { ResultsInterface } from "./App"
import test from './Models/test';
export interface AnswersInterface {
  questionNumber:number,
  answerText:string
}
const ResultsOfCreatedTest:React.FC<{}>=()=>{
    const navigate  = useNavigate();
    const {email} = useParams()
    const {nameOfTest} = useParams()
    const {id} = useParams()
    const[rightAnswers, setRightAnswers]= useState<string>("")
    
    const[questions,setQuestions] = useState<test[]>([])
    const [answer, setAnswer] = useState<AnswersInterface[]>([])
    let [results, setResults]=useState<ResultsInterface[]>([])
   useEffect (() => {
    fechData();
    const storedResults = localStorage.getItem('listOfResults');

    if (storedResults) {
      const parsedResults = JSON.parse(storedResults) 
      setResults(parsedResults);
    }

    const storeMark = localStorage.getItem('mark');

    if (storeMark) {
      const parsedResults = storeMark
      setRightAnswers(parsedResults);
    }
  }, [])

  let fechData = async () => {
    let response = await fetch(backendUrl+`/questionDB/${id}/`)
    if (response.ok){
      let data = await response.json();
      setQuestions(data);
    }
  }

  const onChange = React.useCallback((value : any, viewUpdate : any) => {
    //console.log('value:', value);
  }, []);

  

  const onChange2 = (e: RadioChangeEvent, questionNumber:number) => {

    let prevAns= [...answer]
    prevAns = prevAns.filter((answer)=>answer.questionNumber!=questionNumber)
    
    setAnswer([
      ...prevAns,
      {
        questionNumber:questionNumber,
        answerText:e.target.value
      }
    ]);
  };

    let onClickIntentarOtraVez=()=>{
        localStorage.removeItem('listOfResults');
        localStorage.removeItem('mark');
        navigate("/testCreated/pass"+"/"+email+"/"+nameOfTest+"/"+id)
    }
    
  return (

    <>
    <div style={{display:"flex", justifyContent:"center"}}>
        <Statistic title="Tu resultado" value={rightAnswers} />
    </div>
    {results.map((result )=>{

        return questions.map((question, i )=>{

            if(result.questionNumber==(i+1)){

                return(
                    <div style={{backgroundColor:"white", padding:40}}>
               
                        <p>{(i+1) + question.question}</p>

                        <CodeMirror
                        value={question.code}
                        extensions={[javascript({ jsx: true })]}
                        onChange={onChange}
                        editable={false}
                        />
                    
                        <Radio.Group onChange={(e)=>{onChange2(e, (i+1))}} style={{marginTop:40, marginBottom:40}} value={result.userAnswer}>
                    
                            <Space direction="vertical">
                                <Radio value={1}>{question.answer1}</Radio>
                                <Radio value={2}>{question.answer2}</Radio>
                                <Radio value={3}>{question.answer3}</Radio>
                                <Radio value={4}>{question.answer4}</Radio>
                            </Space>
                    
                        </Radio.Group>
                        {result.answer==false? <Alert message="Equivocado" type="error" showIcon />:<Alert message="Bien" type="success" showIcon />}
                    </div> 
                )
            }
        })
    }
    )}
    <div style={{display:"flex", justifyContent:"center"}}>
        <Button style={{width:"50%", marginBottom:30}} type='primary' onClick={()=>{onClickIntentarOtraVez()}}>Intentar otra vez</Button>
    </div>
  </>
 
  );
}
export default ResultsOfCreatedTest;
