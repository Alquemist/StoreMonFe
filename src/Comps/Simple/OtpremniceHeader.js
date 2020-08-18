import React from 'react';
import {InputWithAutocomplete, FormFieldWithPrefix, TexBoxtWithPrefix} from './CustomForms';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

const otpremnicaHeader = (props) => {

    console.log(props.hdrData)
    //console.log(props.hdrData.mjesto && [props.hdrData.mjesto])

    return (
        <Row className='no-gutters'>
            <Col style={{paddingRight:'5px'}}>
                <InputWithAutocomplete
                    isInvalid={props.fieldValidations.mjestoInvalid}
                    id='mjesto'
                    prefix='Mjesto'
                    placeholder='mjesto'   
                    onChange={props.onChange}
                    options={props.hdrData.mjesta}
                    selected={props.hdrData.mjesto? [props.hdrData.mjesto]: undefined}
                />
                <Form validated={props.fieldValidations.validated}>
                    <FormFieldWithPrefix
                        required
                        type="text"
                        id='docBr'
                        prefix='Doc br'
                        placeholder='br. otpremnice'
                        value={props.hdrData.docBr}
                        onChange={props.onChange}
                    />
                    <FormFieldWithPrefix
                        required
                        type="date"
                        id='datum'
                        prefix='Datum'
                        value={props.hdrData.datum}
                        onChange={props.onChange}
                    />
                </Form>
                <InputWithAutocomplete
                    isInvalid={props.fieldValidations.primaocInvalid}
                    id='primaoc'
                    prefix='Primaoc'
                    placeholder='primaoc'
                    onChange={props.onChange}
                    options={props.hdrData.primaoci}
                    selected={props.hdrData.primaoc? [props.hdrData.primaoc]: undefined}
                />
            </Col>
               
            <Col style={{paddingLeft:'5px'}}>
                <InputWithAutocomplete
                    id='mjestoPrijema'
                    prefix='Mjesto pr'
                    placeholder='mjesto prijema'
                    onChange={props.onChange}
                    options={props.hdrData.mjestaPrijema}
                    selected={props.hdrData.mjestoPrijema? [props.hdrData.mjestoPrijema]: undefined}
                />

                <InputWithAutocomplete
                    id='nacinPlacanja'
                    prefix='Plaćanje'
                    placeholder='način plaćanja'
                    onChange={props.onChange}
                    options={props.hdrData.naciniPlacanja}
                    selected={props.hdrData.nacinPlacanja? [props.hdrData.nacinPlacanja]: undefined}
                />
                <TexBoxtWithPrefix
                    id='napomena'
                    prefix='Napomena'
                    value={props.hdrData.napomena}
                    onChange={props.onChange}
                />
            </Col>
        </Row>
    )
};

export default otpremnicaHeader