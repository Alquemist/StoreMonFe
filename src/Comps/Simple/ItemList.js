import React from 'react';
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'

const itemList = (props) => {
    //console.log(props.item)
    if (props.item.dimenzije) {props.item.dimenzije = JSON.stringify(props.item.dimenzije)};
    const tblHeaders = Object.keys(props.item).map((title, idx) => {return props.item[title]? <th key={idx}>{title}</th>: null});
    const tblFields = Object.keys(props.item).map((val, idx) => {
        return props.item[val]
        ?<td key={idx} style={{padding: '5px'}}>
            {props.item[val]}
        </td>
        :null
    });

    return (
        <Table responsive striped bordered hover style={{margin:0}}>
            <tbody>
                <tr>
                    {tblHeaders}
                    {props.buttonList&&props.buttonList.map((buttonProps, idx) => {return <th key={idx}>{buttonProps.buttonLabel}</th>})}
                </tr>
                <tr>
                    {tblFields}
                    {props.buttonList&&props.buttonList.map((buttonProps, idx) => {return(
                        <td key={idx} style={{padding:'5px'}}>
                            <Button variant={buttonProps.buttonVariant} size="sm" onClick={buttonProps.buttonCallBack}>{buttonProps.buttonLabel}</Button>
                        </td>
                    )})}
                </tr>
            </tbody>
        </Table>  
    )
};

export default itemList;