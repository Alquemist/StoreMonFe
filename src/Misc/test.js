import React, {useState} from 'react';

const tst = () => {
    const [state, setState] = useState('')
    const [stateList, setStateList] = useState([''])
    console.log('newState: ',state, '   newList: ', stateList.length)
    return(
        <>
        <input onChange={event=>{
            const newValue = event.target.value
            setState(newValue);
            setStateList((oldList)=>{oldList.push(newValue); return [...oldList]})
            }}></input>
        <h1>{state}</h1>
        </>
    )
};

export default tst;