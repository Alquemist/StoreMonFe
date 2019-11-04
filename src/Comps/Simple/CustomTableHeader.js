import React from 'react';
import Button from 'react-bootstrap/Button';


const CustomHeader = (props) => {
    if (props.label===props.orderBy.column) {
        const label = props.orderBy.direction? `${props.label}⮛ `:`${props.label} ⮙`
        const onClickCallback = () => {props.setOrderBy({...props.orderBy, direction: !props.orderBy.direction})};
        return(
            <Button variant="light" size='sm' onClick={()=>onClickCallback()} style={{width:'100%', height: '100%'}}>{label}</Button>
        )
    } else {
        const label = props.label
        const onClickCallback = (columnName) => {props.setOrderBy({column: columnName, direction: true})};
        return(
            <Button variant="light"  size='sm' onClick={()=>onClickCallback(props.label)} style={{width:'100%', height: '100%'}}>{label}</Button>
        )
    }
};

export default CustomHeader;