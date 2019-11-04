import React from 'react';
import Table from 'react-bootstrap/Table'
import CustomHeader from '../Simple/CustomTableHeader';
import {sorter} from '../../Misc/Functions'

const ObjectListTable = (props) => {                         //props = {headerLabels: [], objectList: [{}, {}, ...] defaultOrderBy: {column: str; deirection: Bool} commonHdrLabel: str, commonElement: <html Elem>}

    return (
        <Table responsive striped bordered hover size="sm" >
            <thead>
                <tr>
                    {props.headerLabels.map((label, key) => {
                        return (
                            <th key={key}>
                                <CustomHeader label={label} orderBy={props.orderBy} setOrderBy={props.setOrderBy}/>
                            </th>
                        )}
                    )}
                    <th key={props.headerLabels.length+1}>
                        <CustomHeader label={props.commonHdrLabel} orderBy={props.orderBy} setOrderBy={props.setOrderBy}/>
                    </th>
                </tr>
            </thead>
            <tbody>
                    {sorter(props.objectList, props.orderBy.column, props.orderBy.direction).map((obj, idx) => {
                    return (
                        <tr key={idx}>
                            {props.headerLabels.map((hdrLabel, key) => {
                                return(
                                     <td key={key}>{obj[hdrLabel]}</td>
                                )
                            })}
                            <td key={props.commonHdrLabel}>{props.commonElement(idx)}</td>
                        </tr>
                    )})} 
            </tbody>
        </Table>
    )
};

export default ObjectListTable;