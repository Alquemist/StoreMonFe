import React, {useState} from 'react'
import {connect} from 'react-redux'

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Alert from 'react-bootstrap/Alert';

import ItemList from '../Simple/ItemList';
import {InputWithAsyncAutocomplete, FormFieldWithPrefix, DropdownForm} from '../Simple/CustomForms'
import {getLastInvBr, saveSpecs, getSpecs, newAxios} from '../../Misc/MyAxios'
import {toNum, filterData} from '../../Misc/Functions'
import {itemSearcHandler, itemTransformData} from '../../Misc/AsyncHandlers';

const SpecProizvodnje = (props) => {

    const specsDefault = {materijal: undefined, dimenzije: [], JM: ' ', kolicina: undefined, ostatak: undefined, ukupanUtrosak: undefined, napomena: undefined, new: true,}
    const validationDefault = {validated: false, proizvodInvalid: undefined, materijalInvalid: undefined, utrosakInvalid: undefined}
    const [validationData, setValidationData] = useState(validationDefault)
    const [item, setItem] = useState({})
    const [specs, setSpecs] = useState(specsDefault)
    const [specList, setSpecList] = useState([])
    const [delSpecs, setDelSpecs] = useState([])

    const itemSuffix = item.id? `${item.kolicina} [${item.JMIzlaz}]`: '0 [/]'
    let matSuffix

    const onProizvodSelection = (selectedItem) => {
        if (selectedItem.new) {
            getLastInvBr(props.token).then( response => {
                props.itemToStore({...selectedItem, invBr: response.data+1})
                props.history.push('/')
            })
        } else {
            getSpecs(props.token, selectedItem.id)
            .then(response=>{
                setSpecList([...response.data])
                setItem({...selectedItem})
                Object.keys(selectedItem).length? setValidationData({...validationData, proizvodInvalid: false}): setValidationData({...validationData, proizvodInvalid: true})
            }).catch(error => console.log(error))
            
        };
    };

    const onMaterijalSelection = (selectedItem) => {
        if (selectedItem.new) {
            getLastInvBr(props.token).then( response => {
                props.itemToStore({...selectedItem, invBr: response.data+1})
                props.history.push('/')
            })
        } else {
            setSpecs({...specs, materijal: selectedItem.naziv, materijalId: selectedItem.id, JM: selectedItem.JMIzlaz})
            matSuffix = selectedItem.id? `${selectedItem.kolicina} [${selectedItem.JMIzlaz}]`: '0 [/]'
            Object.keys(selectedItem).length? setValidationData({...validationData, materijalInvalid: false}): setValidationData({...validationData, materijalInvalid: true})
        };
    };

    const onDodajCallBack = () => {
        let utrosak
        if (typeof(specs.ukupanUtrosak)==='number') {
             utrosak = specs.ukupanUtrosak;
        } else {
            utrosak = toNum(utrosak);
        };
        const utrosakInvalid = utrosak? false: true
        const materijalInvalid = specs.materijal? false: true
        const proizvodInvalid = Object.keys(item).length? false: true

        if (!utrosakInvalid&&!materijalInvalid&&!proizvodInvalid) {
            setSpecList(oldSpecList => {oldSpecList.push({...specs, ukupanUtrosak: utrosak}); return([...oldSpecList])})
            setSpecs(specsDefault)
            setValidationData(validationDefault)
        } else {
            setValidationData({validated:true, proizvodInvalid: proizvodInvalid, materijalInvalid: materijalInvalid, utrosakInvalid: utrosakInvalid})
        }
    };

    const onSaveCallback = () => {
        saveSpecs(props.token, {itemId: item.id, specs: specList.filter(spec=> spec.new), delSpecs: delSpecs})
        .then(() => {
            setDelSpecs([]);
            setSpecList(oldSpecList=>{
                const newSpecList = []
                oldSpecList.forEach(spec=>{newSpecList.push((filterData(spec, ['new'])))})
                return(newSpecList)
            })
        }).catch( err => {
            console.log(err);
            return
        })
    };

    const deleteCallBack = (spec, idx) => {
        setSpecList(oldSpecList => {oldSpecList.splice(idx, 1); return [...oldSpecList]});
        !spec.new && setDelSpecs(oldState => {oldState.push(spec.id); return ([...oldState])})
    };

    //console.log(validationData)
    return (
        <>  
            <Alert variant="secondary">
                <Row>
                    <Col md={6}>
                        <InputWithAsyncAutocomplete
                            asyncInvalid={validationData.proizvodInvalid}
                            prefix="Proizvod:"
                            placeholder="Izaberi proizvod"
                            suffix={itemSuffix}
                            isInvalid={validationData.proizvodInvalid}
                            onSearchHandler={(param, setOptions, setIsLoading)=>itemSearcHandler(newAxios(props.token), param, setOptions, setIsLoading)}
                            onSelection={selectedItem=>onProizvodSelection(itemTransformData(selectedItem[0]))}
                            itemToStore={props.itemToStore}
                        />
                    </Col>
                    <Col>
                        <Button variant='secondary'
                        onClick={onSaveCallback}
                        disabled={!(specList.some(spec=>{return spec.new}) || delSpecs.length)}
                        >Sačuvaj</Button>
                    </Col>
                </Row>
            </Alert>
            <Row key={specList.length}>
                <Col>
                    <InputWithAsyncAutocomplete
                        asyncInvalid={validationData.materijalInvalid}
                        prefix="Materijal"
                        placeholder="izaberi materijal"
                        suffix={matSuffix}
                        onSearchHandler={(param, setOptions, setIsLoading)=>itemSearcHandler(newAxios(props.token), param, setOptions, setIsLoading)}
                        onSelection={materijal => onMaterijalSelection(itemTransformData(materijal[0]))}
                        itemToStore={props.itemToStore}
                    />
                    <Form validated={validationData.validated}>
                        <DropdownForm
                            options={['1D', '2D', '3D' ]}
                            id='dimenzije'
                            prefix=''
                            onChange={(value, idx) => setSpecs((oldSpecs) => {oldSpecs.dimenzije[idx]=value; return {...oldSpecs}})}
                        />
                        <FormFieldWithPrefix
                            prefix='Količina'
                            id='kolicina'
                            placeholder='kolicina [kom]'
                            type='number'
                            onChange={newData => setSpecs({...specs, ...newData})}
                        />
                        <FormFieldWithPrefix
                            prefix='Ostatak'
                            id='ostatak'
                            placeholder='ostatak'
                            type='number'
                            onChange={newData => setSpecs({...specs, ...newData})}
                        />
                    </Form>
                </Col>
                <Col>
                    <FormFieldWithPrefix
                        prefix={`Utrošak [${specs.JM}]`}
                        id='ukupanUtrosak'
                        placeholder='ukupan utrošak'
                        type='number'
                        required
                        isInvalid={validationData.utrosakInvalid}
                        onChange={newData => setSpecs({...specs, ...newData})}
                    />
                    <InputGroup style={{flex: 1}}>
                        <InputGroup.Prepend>
                            <InputGroup.Text>Napomena</InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control as="textarea" onChange={event => setSpecs({...specs, napomena:event.target.value})}/>
                    </InputGroup>
                    <Button variant="secondary" onClick={onDodajCallBack}>Dodaj</Button>
                </Col>
            </Row>
            {specList.map((spec, idx) => {
                const itemButtons = [{buttonLabel: "Obriši", buttonCallBack: ()=>deleteCallBack(spec,idx), buttonVariant: "outline-danger"}]
                return (
                    <ItemList key={idx}
                        item={filterData(spec, ['materijalId', 'new', 'id'])}
                        buttonList={itemButtons}
                    />
                )
            }
            )}
        </>
    )
};

const mapStateToProps = (fromRedux) => {
    return {token: fromRedux.userData.token,}
};

const mapDispatchToProps = dispatch => {
    return {
        itemToStore: (item) => dispatch({type: 'ITEM_UPDATE', item: item}),
    };
   };
   
export default connect(mapStateToProps, mapDispatchToProps)(SpecProizvodnje)