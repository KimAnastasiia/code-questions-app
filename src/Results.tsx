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
export interface AnswersInterface {
  questionNumber:number,
  answerText:string
}
export interface ResultsProps {
    results:ResultsInterface[]
  }
const Results:React.FC<ResultsProps>=()=>{
    const navigate  = useNavigate();
    const {email} = useParams()
    const {name} = useParams()
    const {id} = useParams()
    const[rightAnswers, setRightAnswers]= useState<string>("")
    
    const[questions,setQuestions] = useState<quastion[]>([])
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
    let response = await fetch(backendUrl+`/question/${email}/${name}/${id}/`)
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
        navigate("/test"+"/"+email+"/"+name+"/"+id)
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
               
                        <p>{(i+1) + question.questionText}</p>

                        <CodeMirror
                        value={question.code}
                        extensions={[javascript({ jsx: true })]}
                        onChange={onChange}
                        editable={false}
                        />
                    
                        <Radio.Group onChange={(e)=>{onChange2(e, (i+1))}} style={{marginTop:40, marginBottom:40}} value={result.userAnswer}>
                    
                            <Space direction="vertical">
                                <Radio value={"A"}>{question.optionA}</Radio>
                                <Radio value={"B"}>{question.optionB}</Radio>
                                <Radio value={"C"}>{question.optionC}</Radio>
                                <Radio value={"D"}>{question.optionD}</Radio>
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
export default Results;
