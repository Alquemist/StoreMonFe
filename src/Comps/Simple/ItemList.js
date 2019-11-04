import React from 'react';
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'

const itemList = (props) => {
    //console.log(props.item)
    if (props.item.dimenzije) {props.item.dimenzije = JSON.stringify(props.item.dimenzije)};
    const tblHeaders = Object.keys(props.item).map((title, idx) => {return props.item[title]? <th key={idx}>{title}</th>: null})
    const tblFields = Object.keys(props.item).map((val, idx) => {return props.item[val]? <td key={idx}>{props.item[val]}</td>: null})

    return (
        <Table responsive striped bordered hover>
            <tbody>
                <tr>
                    {tblHeaders}
                    {props.buttonList&&props.buttonList.map((buttonProps, idx) => {return <th key={idx}>{buttonProps.buttonLabel}</th>})}
                </tr>
                <tr>
                    {tblFields}
                    {props.buttonList&&props.buttonList.map((buttonProps, idx) => {return(
                        <td key={idx}>
                            <Button variant={buttonProps.buttonVariant} onClick={buttonProps.buttonCallBack}>{buttonProps.buttonLabel}</Button>
                        </td>
                    )})}
                </tr>
            </tbody>
        </Table>  
    )
};

export default itemList;