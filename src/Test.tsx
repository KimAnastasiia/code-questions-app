import React, { useEffect, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { backendUrl } from './Global';
function Test() {
   const[question,setQuestion] = useState({
    questionText:"",
    code: "",
    optionA:"",
    optionB:"",
    optionC:"",
    optionD:""
   })

   useEffect (() => {
    console.log("Hello")
    fechData();
  })

  let fechData = async () => {
    let response = await fetch(backendUrl+ "/question")
    if (response.ok){
      let data = await response.json();
      setQuestion(data);
    }
  }

  const onChange = React.useCallback((value : any, viewUpdate : any) => {
    console.log('value:', value);
  }, []);


  return (
    <div>
      <p>{question.questionText}</p>
      <CodeMirror
        value={question.code}
        height="200px"
        extensions={[javascript({ jsx: true })]}
        onChange={onChange}
        editable={false}
      />
      <p>{question.optionA}</p>
      <p>{question.optionB}</p>
      <p>{question.optionC}</p>
      <p>{question.optionD}</p>
    </div>
  );
}
export default Test;
