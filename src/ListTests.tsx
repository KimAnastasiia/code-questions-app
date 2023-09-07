import React, { ChangeEvent, useEffect, useState,useRef } from 'react';
import type { NotificationPlacement } from 'antd/es/notification/interface'
import { Input, Row, List, Button, Table,Space  } from 'antd';
import { useNavigate   } from "react-router-dom";
import { backendUrl } from './Global';
import { AreaChartOutlined, DeleteOutlined, ProfileOutlined,CheckCircleOutlined,EditOutlined,SearchOutlined  } from '@ant-design/icons';
import type { ColumnType, ColumnsType } from 'antd/es/table';
import Highlighter from 'react-highlight-words';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import type { InputRef } from 'antd';
interface listOfTestsInterface {
    name:string,
    id:number,
    email:string
}
export type NotificationType = 'success' | 'info' | 'warning' | 'error';
interface ListTestsProps {
  openNotification:(placement: NotificationPlacement, text:string,  type:NotificationType) => void,
}
const ListTests  :React.FC<ListTestsProps> = ({openNotification})=> {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const navigate  = useNavigate();
  const [listOfTests, setListOfTests]=useState<listOfTestsInterface[]>([])
  const searchInput = useRef<InputRef>(null);

  useEffect(() => {
    getAllTests()
  },[]);

  const getAllTests=async()=>{
    let response = await fetch(backendUrl + "/test?access_token="+localStorage.getItem("access_token") )
    if(response.ok){
      let data = await response.json()
      data= data.sort((a: { id: number; }, b: { id: number; },)=>b.id-a.id)
      setListOfTests(data)
    }else{
      openNotification("top", "Se produjo un error al solicitar una lista de pruebas", "error")
    }
  }
  const handleDelete = async (id: number) => {

    let response = await fetch(backendUrl + '/questions/private?testId=' + id + "&access_token=" + localStorage.getItem("access_token"), {
      method: 'DELETE'
    })
    if (response.ok) {
      handleDeleteResultsOfTest(id)
    }else{
      openNotification("top", "Ocurrió un error al eliminar las preguntas de la prueba", "error")
    }


  };
  const handleDeleteResultsOfTest = async (id: number) => {

    let response = await fetch(backendUrl + '/testresults?testId=' + id + "&access_token=" + localStorage.getItem("access_token"), {
      method: 'DELETE'
    })
    if (response.ok) {
      handleDeleteFromTest(id)
    }else{
      openNotification("top", "Ocurrió un error al eliminar los resultados de la prueba", "error")
    }

  };
  const handleDeleteFromTest =async (id:number) => {

    let response = await fetch(backendUrl + '/test?testId='+id+"&access_token="+localStorage.getItem("access_token"), {
      method: 'DELETE'
    })
    if(response.ok){
        getAllTests()
        openNotification("top", "Prueba eliminada con éxito", "success")
    }else{
      openNotification("top", "Se produjo un error al eliminar la prueba", "error")
    }
    
  };
  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };
  type DataIndex = keyof listOfTestsInterface;
  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<listOfTestsInterface> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });
  const columns: ColumnsType<listOfTestsInterface> = [
    {
     
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
      ...getColumnSearchProps('name')
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      render: (item) =>(
        <>
        <Button onClick={()=>{navigate("/test/pass/"+item.email+"/"+item.name+"/"+item.id)}} style={{margin:10}}><CheckCircleOutlined />Aprobar el examen</Button>
        <Button onClick={()=>{navigate("/test/edit/"+item.id)}} style={{margin:10}}><EditOutlined />Editar prueba</Button>
        <Button onClick={()=>{navigate("/allResultsOfTest/"+item.id)}} style={{margin:10}} ><ProfileOutlined />Resultats</Button>
        <Button onClick={()=>{navigate("/answersStatistic/"+item.id)}} style={{margin:10}} ><AreaChartOutlined />Statistic</Button>
        <Button  danger style={{margin:10}}onClick={()=>{handleDelete(item.id)}}><DeleteOutlined/>Delete</Button>
      </>
      ),
    },
  ]
  return <Table style={{padding:60}} columns={columns} dataSource={listOfTests} />;
};

export default ListTests;
