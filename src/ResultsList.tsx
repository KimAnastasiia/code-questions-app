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

interface listOfResultsInterface {
    testId:string,
    result:string,
    email:string,
    date:number,
    answers:string
}

  
  const columns: ColumnsType<listOfResultsInterface> = [
    {
      title: 'resultado',
      dataIndex: 'result',
    },
    {
      title: 'email',
      dataIndex: 'email',
    },
    {
      title: 'respuestas',
      dataIndex: 'answers',
    },
    {
        title: 'fecha',
        dataIndex: 'date',
        render: (date: number) => moment(date).format('YYYY-MM-DD HH:mm:ss')
      },
  ];
  
  
const ResultsList = () => {
    const {testId} = useParams()
    const navigate  = useNavigate();

  const [listOfResults, setListOfResults]=useState<listOfResultsInterface[]>([])

  useEffect (() => {
    getAllResultsOfTheTest();
  }, [])



  let getAllResultsOfTheTest = async () => {
    let response = await fetch(backendUrl+`/testresults?access_token=${localStorage.getItem("access_token")}&testId=${testId}`)
    if (response.ok){
      let data = await response.json();
      setListOfResults(data);
    }
  }

  return  (<Table columns={columns} dataSource={listOfResults} style={{padding:50}}/>)
};

export default ResultsList;
