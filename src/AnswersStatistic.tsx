import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Avatar, Row, List, Button } from 'antd';
import { useNavigate   } from "react-router-dom";
import { backendUrl } from './Global';
import { useParams } from 'react-router-dom';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { TableRowSelection } from 'antd/es/table/interface';
import moment from 'moment';

  
const AnswersStatistic = () => {
  
  const {testId} = useParams()
  const navigate  = useNavigate();

  const [listOfResults, setListOfResults]=useState<any>()

  useEffect (() => {
    getAllResultsOfTheTest();
  }, [])

  let getAllResultsOfTheTest = async () => {
    let response = await fetch(backendUrl+`/testresults?access_token=${localStorage.getItem("access_token")}&testId=${testId}`)
    if (response.ok){
      let data = await response.json();


      let numberOfAnswers= data[0].answers.split(',')



      let newAr= data.map((el:any)=>{
        el.answers=el.answers.split(',')
        return el.answers
      })
      const resultArray: any[] = []; 

      newAr.forEach((subArray: any[]) => {
        const resultObject: Record<string, any> = {};
            
        subArray.forEach((value: any, index: number) => {
          resultObject[`pregunta${index + 1}`] = value;
        });
            
        resultArray.push(resultObject);
      })
     let summaryList: any = []
     
     resultArray.forEach((el)=>{

      for(let i = 0; i < numberOfAnswers.length; i++ ){

        let foundElement = summaryList.find((e:any)=>e.id=="pregunta"+(i+1))

        if(foundElement==null){
          summaryList.push({
            id: "pregunta"+(i+1),
            A: 0,
            B: 0,
            C: 0,
            D: 0
          })
        }

        foundElement = summaryList.find((e:any)=>e.id=="pregunta"+(i+1))
        foundElement[el["pregunta"+(i+1)]] ++;
      }
     })
     console.log(summaryList)
     setListOfResults(summaryList)
    }
  }
  const columns: ColumnsType<{}> = [
    {
      title: "id",
      dataIndex:  "id",
      rowScope: 'row',
    },
    {
      title: "A",
      dataIndex: 'A',
    },
    {
      title: "B",
      dataIndex: 'B',
    },
    {
      title: "C",
      dataIndex: 'C',
    },
    {
      title: "D",
      dataIndex: 'D',
    },
  ]
  return  (<Table columns={columns} dataSource={listOfResults} style={{margin:50}}/>)
};

export default AnswersStatistic;
