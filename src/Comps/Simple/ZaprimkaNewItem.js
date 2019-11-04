import React from 'react';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {InputWithAsyncAutocomplete, FormFieldWithPrefix, FormFieldWithDropdownSuffix} from './CustomForms';
import {itemSearcHandler, itemTransformData} from '../../Misc/AsyncHandlers'
import { newAxios } from '../../Misc/settings';

const newItem = (props) => {
    //console.log(props.item)
    //console.log(props.item.naziv? [props.item.naziv]: '')
    const ddLabel = (typeof props.item.poUlaznojJM === 'undefined')? '[JM] ': props.item.poUlaznojJM? props.item.JMUlaz: props.item.JMIzlaz

    const recalculateAndSetItem = (newData) => {
        const newState = {...props.item, ...newData}
        const trosak = newState.trosak? Number(newState.trosak): 0
        const rabat = newState.rabat? Number(newState.rabat): 0
        const vrijednost = newState.vrijednost? Number(newState.vrijednost): 0
        props.setItem({...newData, ukupno: vrijednost+trosak-rabat})
    };

    return (
        <div>
            <Alert variant="secondary">
                <Row>
                    <Col style={{paddingLeft: '0px'}}>
                        <InputWithAsyncAutocomplete //key={props.item.id}
                            selected={props.item.naziv? [props.item.naziv]: []}
                            asyncInvalid={props.validationData.nazivInvalid}
                            asyncValid={typeof(props.validationData.nazivInvalid)==='undefined'? undefined: !props.validationData.nazivInvalid}
                            placeholder="naziv"
                            prefix="naziv"
                            suffix={props.item.id? `${props.item.kolicina} [${props.item.JMIzlaz}]`: '0 [/]'}
                            onSearchHandler={(param, setOptions, setIsLoading)=>itemSearcHandler(newAxios(props.token), param, setOptions, setIsLoading)}
                            onSelection={data=>props.onSelection(itemTransformData(data[0]))}
                        />
                        <Form validated={props.validationData.formValidated}>
                            <FormFieldWithDropdownSuffix
                                required
                                type='number'
                                prefix='količina'
                                id='zapKolicina'
                                placeholder='zaprimljena količina'
                                value={props.item.zapKolicina}
                                onChange={props.setItem}
                                ddLabel={ddLabel}
                                ddItems={props.item.id? [{option: 'JMUlaz', label: `${props.item.JMUlaz} = ${props.item.JMOdnos}[${props.item.JMIzlaz}]`}, {option: 'JMIzlaz', label: props.item.JMIzlaz}]: []}
                                ddInvalid={props.validationData.poUlaznojJMInvalid}
                                onSelectDD={selection => props.setItem({poUlaznojJM: selection==='JMUlaz'})}
                            />
                            <FormFieldWithPrefix
                                required
                                type='number'
                                prefix = 'cijena'
                                id='vrijednost'
                                value={props.item.vrijednost}
                                placeholder='Fakturna cijena'
                                onChange={recalculateAndSetItem}
                            />
                        </Form>
                    </Col>
                    <Col>
                        <FormFieldWithPrefix
                            prefix = 'trošak'
                            id='trosak'
                            value={props.item.trosak}
                            onChange={recalculateAndSetItem}
                        />
                        <FormFieldWithPrefix
                            prefix = 'rabat'
                            id='rabat'
                            value={props.item.rabat}
                            onChange={recalculateAndSetItem}
                        /> 
                        <FormFieldWithPrefix
                            prefix = 'ukupno'
                            value={props.item.ukupno}
                            disabled
                        />
                        <Row>
                            <Col className="float-right">
                                <Button md="2" variant="outline-danger" onClick={props.onSaveCallback} disabled={props.saveButtonDisabled}>Sačuvaj</Button>
                            </Col>
                            <Col className="float-left">
                                <Button variant="outline-secondary" onClick={()=>props.addItemCallBack({...props.item})} className="floatRight">Dodaj</Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Alert> 
        </div>
    )
};

export default newItem;
