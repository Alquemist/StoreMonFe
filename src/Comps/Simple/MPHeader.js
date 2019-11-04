import React from 'react';
import {FormFieldWithPrefix, FormFieldWithDropdownSuffix} from './CustomForms';

import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

const MPHeader = (props) => {

    console.log(props.hdrData)
    // console.log(props.hdrData.naciniPlacanja.ostatak[props.hdrData.nacinPlacanjaOstatak])
    
    return (
        <Form as={Row} validated={props.fieldValidations.validated}>
            <Col>
                <Row>
                    <Col>
                        <FormFieldWithPrefix
                            disabled
                            required
                            prefix='Kasa Id'
                            placeholder='Br kase'
                            value={props.hdrData.kasaId}
                            prefixSize='6'
                        />
                    </Col>

                    <Col style={{paddingLeft: '3px',}}>
                        <FormFieldWithPrefix
                            disabled
                            required
                            prefix='Mjesto'
                            value={props.hdrData.mjesto}
                            prefixSize='6'
                        />
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <FormFieldWithPrefix
                            disabled
                            required
                            prefix='Račun br'
                            value={props.hdrData.docBr}
                            prefixSize='6'
                        />
                    </Col>

                    <Col style={{paddingLeft: '3px',}}>
                        <FormFieldWithPrefix
                            disabled
                            required
                            prefix='Datum'
                            value={props.hdrData.datum}
                            prefixSize='6'
                            fontSize='14px'
                        />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormFieldWithPrefix
                            disabled
                            required
                            prefix='Kasir'
                            value={`${props.hdrData.userData.ime} ${props.hdrData.userData.prezime}`}
                            prefixSize='6'
                        />
                    </Col>
                </Row>
            </Col>
               
            <Col style={{paddingLeft: '3px',}}>
                <FormFieldWithDropdownSuffix
                    id='odmah'
                    prefix='Odmah'
                    value={props.hdrData.odmah}
                    type='number'
                    onChange={props.onChange}
                    prefixSize={4}
                    ddId='nacinPlacanjaOdmah'
                    ddLabel={props.hdrData.naciniPlacanja.odmah[props.hdrData.nacinPlacanjaOdmah]}
                    ddItems={Object.entries(props.hdrData.naciniPlacanja.odmah).map(entry => { return {[entry[0]]:entry[1]} })} //{key1:value1,...} => [{key1:value1}, ...]
                    onSelectDD={props.onChange}
                    ddValidVariant={"outline-secondary"}
                    //ddInvalidVariant={'outline-danger'}
                    suffixSize={4}
                />
                <FormFieldWithDropdownSuffix
                    id='ostatak'
                    prefix='Ostatak'
                    value={props.hdrData.ostatak}
                    type='number'
                    onChange={props.onChange}
                    prefixSize={4}
                    ddId='nacinPlacanjaOstatak'
                    ddLabel={props.hdrData.naciniPlacanja.ostatak[props.hdrData.nacinPlacanjaOstatak]}
                    ddItems={Object.entries(props.hdrData.naciniPlacanja.ostatak).map(entry => { return {[entry[0]]:entry[1]} })} //{key1:value1,...} => [{key1:value1}, ...]
                    onSelectDD={props.onChange}
                    ddValidVariant={"outline-secondary"}
                    ddInvalidVariant={'outline-danger'}
                    suffixSize={4}
                />
                <FormFieldWithPrefix
                    disabled
                    prefix='Ukupno'
                    placeholder=' '
                    value={props.hdrData.odmah+props.hdrData.ostatak}
                    prefixSize='4'
                />
            </Col>
            
           
            {/* <Col style={{height: 'vh', display: 'flex',	}}>
                <InputGroup style={{flex: 1}}>
                    <InputGroup.Prepend>
                        <InputGroup.Text>Napomena</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control as="textarea" onChange={(event)=>props.hdrStateUpdate({napomena:event.target.value})}/>
                </InputGroup>
            </Col>             */}
        </Form>
    )
};

export default MPHeader