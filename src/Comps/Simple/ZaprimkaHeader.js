import React from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {InputWithAutocomplete, FormFieldWithPrefix} from './CustomForms';

const zaprimkaHeader = (props) => {
    console.log(props.hdrState)

    const onChangeCallback = (params) => {
        const id = Object.keys(params)[0]
        const val = Object.values(params)[0]
        let fieldValid
        if (val) {
            fieldValid = (props.fieldValidations[id]===false)? true: props.fieldValidations[id]
        }
        else {
            fieldValid = undefined
        }
        let newState = {...props.fieldValidations}
        newState[id] = fieldValid
        props.hdrStateUpdate(params)
        props.setFieldValidations(newState)
    };

    return (
        <Row>
            <Col>
                <InputWithAutocomplete
                    valid={props.fieldValidations.mjesto}
                    id='mjesto'
                    prefix='Mjesto'
                    placeholder='mjesto'   
                    onChange={onChangeCallback}
                    options={props.hdrState.mjesta}
                    selected={props.hdrState.mjesto? [props.hdrState.mjesto]: undefined}
                />
                <Form validated={props.validated}>
                    <FormFieldWithPrefix
                        required
                        type="text"
                        id='docBr'
                        prefix='Br. primke'
                        placeholder='br. primke'
                        value={props.hdrState.docBr}
                        onChange={props.hdrStateUpdate}
                    
                    />
                    <FormFieldWithPrefix
                        required
                        type="date"
                        id='datum'
                        prefix='Datum'
                        value={props.datum}
                        onChange={props.hdrStateUpdate}
                    />
                </Form>
                
                
                <InputWithAutocomplete
                    valid={props.fieldValidations.dobavljac}
                    id='dobavljac'
                    prefix='Dobavljač'
                    placeholder='dobavljač'
                    onChange={onChangeCallback}
                    options={props.hdrState.dobavljaci}
                    selected={props.hdrState.dobavljac? [props.hdrState.dobavljac]: undefined}
                />

                <InputWithAutocomplete
                    id='placanje'
                    prefix='Plaćanje'
                    placeholder='način plaćanja'
                    onChange={props.hdrStateUpdate}
                    options={props.hdrState.placanja}
                    selected={props.hdrState.placanje? [props.hdrState.placanje]: undefined}
                    />
                
            </Col>
            <Col style={{height: 'vh', display: 'flex',	}}>
                <InputGroup style={{flex: 1}}>
                    <InputGroup.Prepend>
                        <InputGroup.Text>Napomena</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control as="textarea" onChange={(event)=>props.hdrStateUpdate({napomena:event.target.value})}/>
                </InputGroup>
            </Col>            
        </Row>
        
    )
};

export default zaprimkaHeader;