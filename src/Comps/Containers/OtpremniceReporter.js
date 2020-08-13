import React, {useState, useEffect} from 'react';
import {itemSearcHandler, itemTransformData} from '../../Misc/AsyncHandlers'
import Alert from 'react-bootstrap/Alert'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { newAxios } from '../../Misc/settings';
import { otpremnicaAxios } from '../../Misc/MyAxios';
import {InputWithAsyncAutocomplete, FormFieldWithPrefix} from '../Simple/CustomForms'
import { getDates, sorter } from '../../Misc/Functions';
import ItemList from '../Simple/ItemList'
import ObjectListTable from '../Simple/ObjectListTable';
import {connect} from 'react-redux';

const OtpremniceReporter = (props) => {

    const token = props.token
    const [criteria, setCriteria] = useState({dates: getDates(1), item: ''});
    const [otpremniceHdrs, setOtpremniceHdrs] = useState([])
    const [otpremnice, setOtpremnice] = useState([])
    const [orderBy, setOrderBy] = useState({column: "datum", direction: true}) //false=asc -> ⯅  tru=desc -> ⯆

    const headerLabels = ['datum', 'docBr', 'mjesto', 'primaoc', 'mjestoPrijema', 'nacinPlacanja', 'napomena']

    useEffect(() => {
        otpremnicaAxios(token).getOtpremnice(criteria)
        .then(response => setOtpremniceHdrs(response.data))
        .catch(error=>console.log(error))
    },[criteria])

    const detaljiCallBack = (id) => {
        otpremnicaAxios(props.token).getOtpremniceDetails(id)
        .then(response=>{setOtpremnice(response.data)})
        .catch(err=>console.log(err))
    };
    //console.log(otpremnice)
    return(
        <>
        <Alert variant="secondary">
            <Row>
                <Col>
                    <InputWithAsyncAutocomplete
                        placeholder="naziv ili inv br"
                        prefix="naziv"
                        onSearchHandler={(param, setOptions, setIsLoading)=>itemSearcHandler(newAxios(token), param, setOptions, setIsLoading)}
                        onSelection={data => setCriteria({...criteria, item: itemTransformData(data[0]).id})}
                    />
                </Col>
                <Col>
                    <Row>
                        <Col>
                            <FormFieldWithPrefix
                                prefix="Od"
                                id="od"
                                defaultValue={criteria.dates[0]}
                                type="date"
                                onChange={data => setCriteria(oldState =>{return {...criteria, dates: [data.od, oldState.dates[1]]}})}
                            />
                        </Col>
                        <Col>
                            <FormFieldWithPrefix
                                prefix="Do"
                                id="do"
                                defaultValue={criteria.dates[1]}
                                type="date"
                                onChange={data => setCriteria(oldState =>{return {...criteria, dates: [oldState.dates[0], data.do]}})}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
            {otpremnice.length?
            <>
            {otpremnice.map((otpremnica, key)=>{return(
                <ItemList key={key}
                    item={otpremnica}
                    //buttonList={[{buttonLabel: "X", buttonVariant: "outline-dark", buttonCallBack: ()=>setOtpremnice([])}]}
                />
            )})}
            <Row className="justify-content-md-end">
                <Col md="2">
                    <Button variant="outline-dark" onClick={()=>setOtpremnice([])}>X</Button>
                </Col>
            </Row>
                
            </>: null}
        </Alert>
        {ObjectListTable.length?
            <ObjectListTable
                headerLabels={headerLabels}
                objectList={otpremniceHdrs}
                defaultOrderBy={{}}
                orderBy={orderBy}
                setOrderBy={setOrderBy}
                commonHdrLabel='*'
                commonElement={(idx) =>{return <Button variant='outline-secondary' onClick={()=>detaljiCallBack(otpremniceHdrs[idx].id)}>Detalji</Button>}}
            />: null
        }
        </>
    )
};

const mapStateToProps = (fromRedux) => {
    return {token: fromRedux.userData.token}
};

export default connect(mapStateToProps)(OtpremniceReporter);