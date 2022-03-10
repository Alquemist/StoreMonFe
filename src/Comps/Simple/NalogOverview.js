import React, {useState} from 'react';
import Table from 'react-bootstrap/Table'
import Dropdown from 'react-bootstrap/Dropdown';
import CustomHeader from './CustomTableHeader';

import {sorter} from '../../Misc/Functions'

const NalogOverview = (props) => {
  
    const [orderBy, setOrderBy] = useState({column: "Datum", direction: true}) //false=asc -> ⯅  tru=desc -> ⯆

    const headerLabels = ["Naziv", "Datum", "Količina", "Status"]

    const CustomDropDown = (myProps) => {
        //console.log(props.nalog)
        const statusDict = props.statusDict
        //console.log(statusDict)
        return(
            <Dropdown>
                <Dropdown.Toggle variant="outline-secondary" style={{width:'100%', height: '100%', fontSize: '12px'}}>{statusDict[myProps.nalog.status]}</Dropdown.Toggle>
                <Dropdown.Menu>
                    {Object.keys(statusDict).map((statusIdx)=> {
                        //console.log(status, idx)
                        //console.log(status, (idx>=myProps.nalog.status)? idx+1: idx)
                        return((myProps.nalog.status !== statusIdx)?
                            <Dropdown.Item key={statusIdx} style={{fontSize: '12px'}}
                                onSelect={(newStatus) => props.onNalogStatusChange(newStatus, myProps.nalogIdx)}
                                eventKey={statusIdx} //statusList.findIndex(statusFromList => {return statusFromList===status})
                                disabled={statusIdx<myProps.nalog.status}
                                >
                                {statusDict[statusIdx]}
                            </Dropdown.Item>:
                            null
                            )
                        })
                    }
                </Dropdown.Menu>
            </Dropdown>)
    };


    const getOrderByKey = (k) => {
        if (["Naziv", "Datum", "Status"].includes(k)) {
            return k.toLowerCase()
        } else {
            return "kolicina"
        }
    };

    const style = {
		position: 'relative',
		//height: '50vh',
		overflowY: 'auto',
		fontSize: '12px',
		}

    //console.log(state)
    return (
        <div style={style}>
        <Table responsive striped bordered hover size="sm" >
            <thead>
                <tr>
                    {headerLabels.map((label, key) => {
                        return (
                            <th key={key}>
                                <CustomHeader label={label} orderBy={orderBy} setOrderBy={setOrderBy}/>
                            </th>
                        )}
                    )}
                </tr>
            </thead>
            
            <tbody>
                 {sorter(props.naloziList, getOrderByKey(orderBy.column), orderBy.direction).map((nalog, key) => {
                    return (
                        <tr key={key}>
                            <td>{nalog.naziv}</td>
                            <td>{nalog.datum}</td>
                            <td>{nalog.kolicina}</td>
                            <td>{<CustomDropDown nalog={nalog} nalogIdx={key}/>}</td>
                        </tr>
                 )})} 
            </tbody>
        </Table>        
    </div>
    )};

export default NalogOverview;