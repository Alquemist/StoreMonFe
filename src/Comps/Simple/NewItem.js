import React, {useState} from 'react';

import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {InputWithAsyncAutocomplete, FormFieldWithPrefix, FormFieldWithDropdownSuffix} from './CustomForms';
import {itemSearcHandler, itemTransformData} from '../../Misc/AsyncHandlers'
import { newAxios } from '../../Misc/MyAxios';

const NewItem = (props) => {
    const token = props.token;
    const otpremnica = props.otpremnica
    const ddLabel = (typeof otpremnica.item.id === 'undefined')? '[JM] ': otpremnica.poIzlaznojJM? otpremnica.item.JMIzlaz: otpremnica.item.JMUlaz
    const [validationData, setValidationData] = useState({})

    const validateItem = () => {
        const validationData = {
            itemInvalid: !otpremnica.item.id,
            formValidated: true,
            JMNotSelected: typeof otpremnica.poIzlaznojJM === 'undefined',
            everythingValid: [
                otpremnica.item.id && typeof otpremnica.poIzlaznojJM !== 'undefined' && otpremnica.otprKolicina && otpremnica.osnovnaCijena
            ].every(elem => {return Boolean(elem)})
        }
        setValidationData(validationData)
        return(validationData.everythingValid)
    };

    const updateUkupno = (data) => {
        const otpremnica = {...props.otpremnica, ...data}
        const trosak = otpremnica.trosak? Number(otpremnica.trosak): 0
        const rabat = otpremnica.rabat? Number(otpremnica.rabat): 0
        const osnovnaCijena = otpremnica.osnovnaCijena? Number(otpremnica.osnovnaCijena): 0
        console.log(data, osnovnaCijena + trosak - rabat)
        return {ukupno: osnovnaCijena + trosak - rabat}
    };

    //console.log(props.otpremnica.poIzlaznojJM, ddLabel)
    //console.log(props.customButton)

    return (
        <div>
            <Alert variant="secondary">
                <Row>
                    <Col style={{paddingLeft: '0px'}}>
                        <InputWithAsyncAutocomplete //key={otpremnica.item.id}
                            selected={Object.keys(otpremnica.item).length? [otpremnica.item]: undefined}
                            asyncInvalid={validationData.itemInvalid}
                            asyncValid={typeof(validationData.itemInvalid)==='undefined'? undefined: !validationData.itemInvalid}
                            placeholder="naziv"
                            prefix="naziv"
                            suffix={otpremnica.item.id? `${otpremnica.item.kolicina} [${otpremnica.item.JMIzlaz}]`: '0 [/]'}
                            onSearchHandler={(param, setOptions, setIsLoading)=>itemSearcHandler(newAxios(token), param, setOptions, setIsLoading)}
                            //onSelection={data=> props.updateOtpremnica({...otpremnica, item: itemTransformData(data[0])})}
                            onSelection={data=> props.onItemSelection(itemTransformData(data[0]))}
                        />
                        <Form validated={validationData.formValidated}>
                            <FormFieldWithDropdownSuffix
                                required
                                type='number'
                                prefix='količina'
                                id='otprKolicina'
                                placeholder='otpremljena količina'
                                value={otpremnica.otprKolicina}
                                onChange={data => props.updateOtpremnica({...otpremnica, ...data})}
                                ddInvalid={validationData.JMNotSelected}
                                ddLabel={ddLabel}
                                ddItems={otpremnica.item.id? [{option: 'JMUlaz', label: `${otpremnica.item.JMUlaz} = ${otpremnica.item.JMOdnos}[${otpremnica.item.JMIzlaz}]`}, {option: 'JMIzlaz', label: otpremnica.item.JMIzlaz}]: []}
                                onSelectDD={data => props.updateOtpremnica({...otpremnica, poIzlaznojJM: data})}
                            />
                            <FormFieldWithPrefix
                                required
                                type='number'
                                prefix='cijena'
                                id='osnovnaCijena'
                                value={otpremnica.osnovnaCijena}
                                placeholder='Osnovna cijena'
                                onChange={data => props.updateOtpremnica({...otpremnica, ...data, ...updateUkupno(data)})}
                            />
                        </Form>
                    </Col>
                    <Col>
                        <FormFieldWithPrefix
                            type='number'
                            prefix = 'trošak'
                            id='trosak'
                            value={otpremnica.trosak}
                            onChange={data => props.updateOtpremnica({...otpremnica, ...data, ...updateUkupno(data)})}
                        />
                        <FormFieldWithPrefix
                            type='number'  
                            prefix = 'rabat'
                            id='rabat'
                            value={otpremnica.rabat}
                            onChange={data => props.updateOtpremnica({...otpremnica, ...data, ...updateUkupno(data)})}
                        /> 
                        <FormFieldWithPrefix key={otpremnica.ukupno && otpremnica.ukupno}
                            prefix = 'ukupno'
                            value={otpremnica.ukupno && otpremnica.ukupno.toString()}
                            disabled
                        />
                        <Row>
                            <Col className="float-right">
                                {!props.addButtonDisabled &&
                                    <Button variant="outline-dark" size='sm'
                                        onClick={()=>{
                                            if (validateItem()) {
                                                props.onAddCallBack()
                                                setValidationData({})
                                            }
                                        }}
                                        >Dodaj
                                    </Button>}
                            </Col>
                            <Col className="float-left">
                                {props.customButton}
                            </Col>
                        </Row>
                        
                    </Col>
                </Row>
            </Alert> 
        </div>
    );
};

export default NewItem;