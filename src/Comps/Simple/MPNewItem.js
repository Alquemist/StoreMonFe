import React, {useState, useEffect} from 'react';
import {InputWithAsyncAutocomplete, FormFieldWithPrefix, FormFieldWithDropdownSuffix, RadiosWithPrefix} from './CustomForms';
import {itemSearcHandler, itemTransformData} from '../../Misc/AsyncHandlers';
import { newAxios } from '../../Misc/settings';
import {POSAxiosGet} from '../../Misc/MyAxios'
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';



const MPItemList = (props) => {
    //console.log(props.MPItem.item)
    const token = props.token
    const MPItem = props.MPItem
    const korekcijaOsnove = {0: 'Ukupno', 1: 'Gotovinsko', 2: 'Žiralno'}
    const korekcijaTipovi = {0: '%', 1: 'KM'}
    const defaultTip = 0
    const defaultValidationData = {formValidated: false, itemInvalid: undefined}
    const poIzlaznojJMOptions = MPItem.item.id? [{0:  MPItem.item.JMIzlaz}, {1: `${MPItem.item.JMUlaz} = ${MPItem.item.JMOdnos}[${MPItem.item.JMIzlaz}]`}]: []

    const [osnov, setOsnov] = useState({umanjenje: 1, uvecanje: 1});
    const [tip, setTip] = useState(defaultTip);
    const [validationData, setValidationData] = useState({...defaultValidationData});
    const [umanjenje, setUmanjenje] = useState(0)
    const [uvecanje, setUvecanje] = useState(0)

    useEffect(
        () => {
            if (MPItem.item.id) {
                const korekcija = getKorekcija()
                const kolicina = MPItem.poIzlaznojJM? MPItem.otprKolicina: MPItem.otprKolicina*MPItem.item.JMOdnos
                const konacnoG = (MPItem.item.gotovinaMP+korekcija.g)*kolicina
                const konacnoZ = (MPItem.item.ziralMP+korekcija.z)*kolicina
                props.updateMPItem({...MPItem, konacnoG: konacnoG, konacnoZ: konacnoZ})
            }
        }, [tip, umanjenje, uvecanje, MPItem.item.id, osnov]
    );

    const validateItem = () => {
        const itemInvalid = !Boolean(MPItem.item.id)
        setValidationData({formValidated:true, itemInvalid:itemInvalid})
        return(MPItem.otprKolicina&&!itemInvalid)
    };

    const getKorekcija = () => {
        let korekcija1 = {g:0, z:0};
        let korekcija2 = {g:0, z:0};
        switch (Number(osnov.umanjenje)) {
            case 0: korekcija1 = tip? {g: umanjenje/2, z: umanjenje/2}: {g: MPItem.item.gotovinaMP * umanjenje/100, z: MPItem.item.ziralMP * umanjenje/100}; break
            case 1: korekcija1 = tip? {g: umanjenje, z: 0}: {g: MPItem.item.gotovinaMP * umanjenje/100, z: 0}; break
            case 2: korekcija1 = tip? {g: 0, z: umanjenje}: {g: 0, z: MPItem.item.ziralMP * umanjenje/100}; break
            default: console.log(osnov.uvecanje)
        }
        switch (Number(osnov.uvecanje)) {
            case 0: korekcija2 = tip? {g: uvecanje/2, z: uvecanje/2}: {g: MPItem.item.gotovinaMP * uvecanje/100, z: MPItem.item.ziralMP * uvecanje/100}; break
            case 1: korekcija2 = tip? {g: uvecanje, z: 0}: {g: MPItem.item.gotovinaMP * uvecanje/100, z: 0}; break
            case 2: korekcija2 = tip? {g: 0, z: uvecanje}: {g: 0, z: MPItem.item.ziralMP * uvecanje/100}; break
            default: console.log(osnov.umanjenje)
        }
       return ({g: -korekcija1.g+korekcija2.g, z: -korekcija1.z+korekcija2.z})
    };

    return (
        <div>
        <Alert variant="secondary">
            <Row>
                <Col style={{paddingLeft: '0px'}}>
                    <InputWithAsyncAutocomplete key={MPItem.item.id}
                        selected={Object.keys(MPItem.item).length? [MPItem.item]: undefined}
                        asyncInvalid={validationData.itemInvalid}
                        asyncValid={typeof(validationData.itemInvalid)==='undefined'? undefined: !validationData.itemInvalid}
                        placeholder="naziv"
                        prefix="Naziv"
                        onSearchHandler={(param, setOptions, setIsLoading)=>itemSearcHandler(newAxios(token), param, setOptions, setIsLoading)}
                        onSelection={data=> props.updateMPItem({...MPItem, item: itemTransformData(data[0])})}
                    />
                    <Form validated={validationData.formValidated}>
                        <FormFieldWithDropdownSuffix
                            required
                            type='number'
                            id='otprKolicina'
                            prefix='Količina'
                            placeholder='količina'
                            value={MPItem.otprKolicina}
                            ddId='poIzlaznojJM'
                            onChange={data => props.updateMPItem({...MPItem, ...data})}
                            ddLabel={MPItem.item.id? MPItem.item.poIzlaznojJM? MPItem.item.JMIzlaz: MPItem.item.JMUlaz: undefined}
                            ddItems={MPItem.item.id? poIzlaznojJMOptions: []}
                            onSelectDD={data => console.log(data)}//props.updateMPItem({...MPItem, ...data})
                            ddValidVariant={"outline-secondary"}
                            suffixSize='4'
                        />
                        <Row>
                            <Col>
                                <FormFieldWithPrefix
                                    disabled
                                    prefix='Gotovina'
                                    placeholder=' '
                                    prefixSize='6'
                                    value={MPItem.konacnoG}
                                />
                            </Col>

                            <Col style={{paddingLeft: '3px'}}>
                                <FormFieldWithPrefix
                                    disabled
                                    prefix='Žiral'
                                    placeholder=' '
                                    prefixSize='6'
                                    value={MPItem.konacnoZ}
                                />
                            </Col>
                        </Row>
                        <FormFieldWithPrefix key={MPItem.ukupno && MPItem.ukupno}
                            prefix = 'Ukupno'
                            value={MPItem.ukupno && MPItem.ukupno.toString()}
                            disabled
                        />
                    </Form>
                </Col>
                <Col>
                    <RadiosWithPrefix
                        prefix='Korekcija'
                        id='tip'
                        onChange={data=>setTip(Number(data.tip))}
                        options={korekcijaTipovi}
                        defaultChecked={`${defaultTip}`}
                        prefixSize='6'
                    />
                    <FormFieldWithDropdownSuffix
                        type='number'
                        prefix='Uvećanje'
                        id='uvecanje'
                        //value={uvecanje}
                        onChange={data=>setUvecanje(Number(data.uvecanje))}
                        ddId='uvecanje'
                        ddLabel={korekcijaOsnove[osnov.uvecanje]}
                        ddItems={Object.entries(korekcijaOsnove).map(entry => { return {[entry[0]]:entry[1]} })}
                        onSelectDD={data=>setOsnov({...osnov, ...data})}
                        ddValidVariant={"outline-secondary"}
                        suffixSize='4'
                    />
                    <FormFieldWithDropdownSuffix
                        type='number'  
                        prefix='Popust'
                        id='popust'
                        //value={popust}
                        onChange={data=>setUmanjenje(Number(data.popust))}
                        ddId='umanjenje'
                        ddLabel={korekcijaOsnove[osnov.umanjenje]}
                        ddItems={Object.entries(korekcijaOsnove).map(entry => { return {[entry[0]]:entry[1]} })}
                        onSelectDD={data=>setOsnov({...osnov, ...data})}
                        ddValidVariant={"outline-secondary"}
                        suffixSize='4'
                    />
                    <Row>
                        <Col className="float-right">
                            {!props.addButtonDisabled &&
                                <Button variant="outline-dark" size='sm'
                                    onClick={()=>{
                                        console.log(validateItem())
                                        if (validateItem()) {
                                            console.log('dodajem')
                                            props.onDodajCallBack(MPItem)
                                        }
                                    }}
                                    >Dodaj
                                </Button>}
                        </Col>
                        <Col className="float-left">
                            {/* {props.customButton} */}
                            <Button onClick={()=>POSAxiosGet().then(response=>console.log(response)).catch(err=>console.log(err))}>POS</Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Alert> 
    </div>
    )
};

export default MPItemList;