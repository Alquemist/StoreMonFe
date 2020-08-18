import React, {useState, useEffect} from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

import {FormFieldWithPrefix, FormFieldWithDropdownSuffix} from './CustomForms'
import {toNum, invBrValidation} from '../../Misc/Functions'
import {doesInvExists} from '../../Misc/MyAxios'

let rerender = {
    JMOdnos: 1,
    invBr: 1,
};

const ItemReporter = (props) => {
    
    const requiredFields = ['naziv', 'invBr', 'JMUlaz', 'JMIzlaz', 'JMOdnos']
    const states = [{buttonTag: 'Izmjeni', formDisabled: true}, {buttonTag: 'Završi', formDisabled: false}]
    const [validationData, setValidationData]  = useState({odnosInvalid: false, invBrInvalid: false, invBrInvalidMessage: undefined})
    const [state, setState] = useState(props.item.new? states[1]: states[0])
    const [validated, setValidated] = useState(false)
    
    const ddItems = state.formDisabled? []: [
        {option: 'repro', label: 'repro'},
        {option: 'proizvod', label: 'proizvod'}
       ]
    
    useEffect(() => {props.item.new? setState(states[1]): setState(states[0])}, [props.item.new])

    const editButtonEffect = (odnosInvalid, invBrInvalid, invBrInvalidMessage) => {
        console.log(invBrInvalid, invBrInvalidMessage)
        setValidated(true)
        setValidationData({...validationData, odnosInvalid: odnosInvalid, invBrInvalid: invBrInvalid, invBrInvalidMessage: invBrInvalidMessage})
        const JMOdnos = odnosInvalid? '': props.item.JMOdnos
        odnosInvalid&& rerender.JMOdnos ++
        const invBr = invBrInvalid? '': props.item.invBr
        invBrInvalid && rerender.invBr ++
        console.log(JMOdnos, invBr)
        props.updateItem({JMOdnos: JMOdnos, invBr: invBr})
        requiredFields.every(field => {return Boolean(props.item[field])})
        && !odnosInvalid
        && !invBrInvalid
        && (()=>{setState(states[0]); props.toggleSacuvaj(false)})()
    };
    
    const editButtonCallback = () => {
        if (state.formDisabled) {
            setState(states[1])
            props.updateItem({edit: true})
        } else {
            let JMOdnos = toNum(String(props.item.JMOdnos))? toNum(String(props.item.JMOdnos)): undefined
            JMOdnos = JMOdnos>0? JMOdnos: undefined
            if (props.item.invBr) {
                if (props.invBrEdited) {
                    doesInvExists(props.item.invBr, props.token).then(response => {
                        const [invBrInvalid, invBrInvalidMessage] = invBrValidation(props.item.invBr, response.data)
                        editButtonEffect(!Boolean(JMOdnos), invBrInvalid, invBrInvalidMessage)
                    })
                } else {
                    const [invBrInvalid, invBrInvalidMessage] = invBrValidation(props.item.invBr, false)
                    editButtonEffect(!Boolean(JMOdnos), invBrInvalid, invBrInvalidMessage)
                }
                
            } else {
                const invBrInvalid = true 
                const invBrInvalidMessage = 'Polje je obavezno!'
                editButtonEffect(!Boolean(JMOdnos), invBrInvalid, invBrInvalidMessage)
            }
            
        }
    };

    //console.log(rerender)
    console.log(props.item)
    
    return (
        <Row>
            <Form as={Col} md={6} validated={validated}>
                <FormFieldWithDropdownSuffix
                    disabled={state.formDisabled}
                    required
                    type='text'
                    prefix='Naziv'
                    id='naziv'
                    value={props.item.naziv}
                    onChange={props.updateItem}
                    ddLabel={props.item.tip}
                    ddItems={ddItems}
                    onSelectDD={selection => props.updateItem({tip: ddItems[selection].label})}
                />
                <FormFieldWithPrefix key={rerender.invBr}
                    disabled={state.formDisabled}
                    isInvalid={validationData.invBrInvalid}
                    required
                    type='number'
                    prefix='Inv. br.'
                    id='invBr'
                    placeholder='Inventurni Broj'
                    invalidMessage={validationData.invBrInvalidMessage}
                    //defaultValue={props.item.invBr}
                    value={props.item.invBr}
                    onChange={(newData)=>{props.setInvEdited(); props.updateItem(newData)}}
                />
                <FormFieldWithPrefix postfixStyle={{color:'red'}}
                    disabled
                    prefix='Na stanju:'
                    value={props.item.kolicina}
                    //onChange={props.updateItem}
                    //prefixSize='4'
                />
            </Form>

            <Form as={Col} md={6} validated={validated} style={{paddingLeft: '8px'}}>
                <FormFieldWithPrefix
                    disabled={state.formDisabled}
                    required
                    type='text'
                    prefix='JM izlazno'
                    id='JMIzlaz'
                    placeholder='Mjera izlazna'
                    prefixSize='6'
                    value={props.item.JMIzlaz}
                    onChange={props.updateItem}
                />
                <FormFieldWithPrefix
                    disabled={state.formDisabled}
                    required
                    type='text'
                    prefix='JM ulazno'
                    id='JMUlaz'
                    placeholder='Mjera ulazna'
                    prefixSize='6'
                    value={props.item.JMUlaz}
                    onChange={props.updateItem}
                />
                <FormFieldWithPrefix key={rerender.JMOdnos}
                    disabled={state.formDisabled}
                    required
                    type='tekst'
                    prefix='JM odnos'
                    id='JMOdnos'
                    prefixSize='6'
                    isInvalid={validationData.odnosInvalid}
                    placeholder='JM izlaz/ulaz'
                    invalidMessage={'Unesi validan odnos mjera'}
                    value={props.item.JMOdnos}
                    onChange={props.updateItem}
                />

            
                <Row>
                    <Col>
                        <Button variant="outline-dark" onClick={editButtonCallback}>{state.buttonTag}</Button>
                    </Col>
                    <Col>
                        <Button  variant="outline-danger" onClick={props.deleteItemCallback}>Obriši</Button>
                    </Col>
                </Row>
            </Form>
        </Row>
    )
};

export default ItemReporter