import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import OtpremnicaHeader from '../Simple/VPHeader';
import NewItem from '../Simple/VPNewItem';
import ItemList from '../Simple/ItemList';
import {otpremnicaAxios} from '../../Misc/MyAxios'
import {getDates, filterData} from '../../Misc/Functions'

const Otpremnice = (props) => {

    const hdrDataDefault = {
        mjesto: '',
        mjesta: [],
        datum: getDates(1)[1],
        docBr: '',
        primaoc: '',
        primaoci: [],
        mjestoPrijema: '',
        mjestaPrijema: [],
        nacinPlacanja: '',
        naciniPlacanja: [],
    };

    const defOtpremnica = {
        item: {},
        otprKolicina: '',
        poIzlaznojJM: undefined,
        osnovnaCijena: '',
        trosak: '',
        rabat: '', 
        ukupno: 0,
    };

    const [otpremnica, updateOtpremnica] = useState(defOtpremnica);
    const [hdrData, hdrUpdate] = useState(hdrDataDefault);
    const [otpremniceList, setOtpremnice] = useState([])
    const [headerValidation, setHeaderValidation] = useState({})
    const [zavrseno, toggleZavrseno] = useState(false)
    
    const myAxios = otpremnicaAxios(props.token)
    //console.log(myAxios)

    useEffect(() =>{
        myAxios.getData()
        .then(response => hdrUpdate(oldState=>{
            return {
            ...oldState, ...response.data} }))
        .catch(error => console.log(error))
    } ,[]);

    const validateHeader = () => {
        const mjestoInvalid = !hdrData.mjesto
        const primaocInvalid = !hdrData.primaoc
        setHeaderValidation({validated: true, mjestoInvalid: mjestoInvalid, primaocInvalid: primaocInvalid})
        return Boolean(hdrData.mjesto&&hdrData.docBr&&hdrData.datum&&hdrData.primaoc)
    };

    const onSaveCallBack = () => {
        if (validateHeader()) {
            myAxios.saveData(filterData(hdrData, ['mjesta', 'primaoci', 'mjestaPrijema', 'naciniPlacanja']), otpremniceList)
            .then(() => {
                updateOtpremnica(defOtpremnica);
                setOtpremnice([]);
                toggleZavrseno(false)
            })
            .catch(error=> {
                if (error.response) {
                    alert(error.response.data);
                    console.log(error.response);
                } else {
                    console.log('saveData request error:', error)
                }
            })
        }
    };

    const customButton = () => {
        return (
            zavrseno?
            <Button variant='outline-danger' onClick={onSaveCallBack} size='sm'>Otpremi</Button>:
            <Button variant='outline-dark' onClick={() => {otpremniceList.length&&toggleZavrseno(true)}} size='sm'>Završeno</Button>
        )
    };

    const izmjeniCallBack = (idx) => {
        setOtpremnice(oldState => {
            updateOtpremnica([...oldState.splice(idx, 1)][0]);
            return [...oldState]})
        };
    
    const deleteCallBack = (idx) => {setOtpremnice((oldItems)=>{oldItems.splice(idx, 1); return [...oldItems]})};

    const buttonStyle = {height:'30px', width:'30px', padding:0};
    const alertStyle= {marginBottom:0, paddingBottom:'4px', paddingTop:'4px'}

    //console.log(otpremnica)
    return (
        <>
            {zavrseno?
            <Alert as={Row} variant='secondary' style={alertStyle}>
                <Col md={{ span: 2, offset: 10 }}>
                    <Button variant='outline-dark' size='sm' onClick={()=>toggleZavrseno(false)} style={buttonStyle}>⮛</Button>
                </Col>
            </Alert>:
            <OtpremnicaHeader
                hdrData={hdrData}
                onChange={data => {hdrUpdate( oldState => {return {...oldState, ...data}} )}} //hdrUpdate
                fieldValidations={headerValidation}
            />}
            <NewItem
                otpremnica={otpremnica}
                updateOtpremnica={updateOtpremnica}
                customButton={customButton()}
                onAddCallBack={()=>{
                    setOtpremnice(oldState => {oldState.push(otpremnica); return([...oldState])})
                    updateOtpremnica(defOtpremnica)
                }}
            />

            {otpremniceList.map((otpremnica, idx)=>{
                const item = {
                    naziv: otpremnica.item.naziv,
                    invBr: otpremnica.item.invBr,
                    kolicina: otpremnica.otprKolicina,
                    JM: otpremnica.poIzlaznojJM? `[${otpremnica.item.JMIzlaz}]`: `[${otpremnica.item.JMUlaz}]`,
                    OsnCijena: otpremnica.osnovnaCijena,
                    trosak: otpremnica.trosak,
                    rabat: otpremnica.rabat,
                    ukupno: otpremnica.ukupno,
                };
                const itemListButtons = [
                    {buttonLabel: 'Izmijeni', buttonVariant: 'outline-dark', buttonCallBack: idx => izmjeniCallBack(idx)},
                    {buttonLabel: 'Obriši', buttonVariant: 'outline-danger', buttonCallBack: idx => deleteCallBack(idx)}
                ]
                return( item.invBr?
                    <ItemList key={idx}
                        item={item}
                        buttonList={itemListButtons}
                    />:
                null
                )
            })}
        </>
    )
};

const mapStateToProps = (fromRedux) => {
    return {token: fromRedux.userData.token}
};

export default connect(mapStateToProps)(Otpremnice);