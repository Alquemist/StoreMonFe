import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux'

import ZaprimkaHeader from '../Simple/ZaprimkaHeader';
import NewItem from '../Simple/ZaprimkaNewItem';
import ItemList from '../Simple/ItemList';

import {zaprimkaAxios, getLastInvBr} from '../../Misc/MyAxios';
import {filterData} from '../../Misc/Functions'

let itemIds = []

const Zaprimka = (props) => {

    const defaultItemState = {id:'', zapKolicina: '', vrijednost: '', trosak:'', rabat:'', ukupno:0, poUlaznojJM: undefined}
    const [items, setItems] = useState([]); //lista zaprimljenih stavki
    const [item, setItem] = useState({...defaultItemState}); //item Obj. iz forme
   
    const defaultHdrState = {
        mjesta: [],
        mjesto: '',
        dobavljaci: [],
        dobavljac:'',
        placanja: [],
        placanje: '',
        napomena: '',
        docBr:'',
        datum: new Date().toJSON().slice(0,10),//.split('-').reverse().join('.'),
        hdrValidated: false,
    };

    const [hdrState, hdrStateUpdate] = useState(defaultHdrState);
    const [validationData, setValidationData] = useState({formValidated: false, nazivInvalid: undefined, poUlaznojJMInvalid: undefined})
    const [fieldValidations, setFieldValidations] = useState({mjesto: undefined, dobavljac: undefined})

    const myAxios = zaprimkaAxios(props.token)

    useEffect(() => {
        myAxios.getData()
        .then((response)=>{
            hdrStateUpdate({
                ...hdrState,
                ...response.data,
                mjesta: response.data.mjesta.length? response.data.mjesta: [],
                mjesto: response.data.mjesta.length? response.data.mjesta[response.data.mjesta.length-1]: '',
                dobavljaci: response.data.dobavljaci.length? response.data.dobavljaci: [],
                dobavljac: response.data.dobavljaci.length? response.data.dobavljaci[response.data.dobavljaci.length-1]: '',
                placanja: response.data.placanja.length? response.data.placanja: [],
                placanje: response.data.placanja.length? response.data.placanja[response.data.placanja.length-1]: '',
                docBr: response.data.docBr? response.data.docBr: '',
             })
        })},[])

    const onItemSelection = (selectedItem) => { //CallBack za izbor u dropdown menu za NewItem komponentu
        console.log(selectedItem)
        if (selectedItem.new) {
            getLastInvBr(props.token).then( response => {
                console.log({...selectedItem, invBr: response.data+1})
				props.itemToStore({...selectedItem, invBr: response.data+1})
				props.history.push('/')
			})
        } else {
            Object.keys(selectedItem).length? setItem({...item, ...selectedItem}): setItem(defaultItemState);
            let nazivInvalid
            if  (validationData.nazivInvalid===true && selectedItem.invBr) {
                nazivInvalid = false
            }
            setValidationData({...validationData, nazivInvalid: nazivInvalid})
        }
    };
        

    const addItemCallBack = (item) => {
        const newItems = [...items];
        let nazivInvalid = true;

        if (item.invBr) {
            nazivInvalid = false
            if (!itemIds.includes(item.id)) {
                if (item.zapKolicina && item.vrijednost && typeof item.poUlaznojJM !== 'undefined') {
                    itemIds.push(item.id)
                    newItems.push(item)
                    setItem({...defaultItemState})
                    setItems(newItems);
                    setValidationData({formValidated: false, nazivInvalid: undefined, poUlaznojJMInvalid: undefined})
                    return
                } else {
                    setValidationData({formValidated: true, nazivInvalid: false, poUlaznojJMInvalid: typeof item.poUlaznojJM==='undefined'})
                }
            }
            else {
                alert('Zaprimate dva puta istu stavku!')
                setItem({id:0, poUlaznojJM:true})
            };
        };
        setValidationData({formValidated: true, nazivInvalid: nazivInvalid, poUlaznojJMInvalid: typeof item.poUlaznojJM==='undefined'})
        console.log(items)
    };

    const onSaveCallback = () => {
        console.log(Boolean(hdrState.mjesto), Boolean(hdrState.dobavljac), hdrState.docBr.length)
        if (Boolean(hdrState.mjesto) && Boolean(hdrState.dobavljac) && hdrState.docBr.length) {
            console.log('axing')
            myAxios.postHeaderData({
                header: {
                    mjesto: hdrState.mjesto,
                    docBr: hdrState.docBr,
                    datum: hdrState.datum, 
                    dobavljac: hdrState.dobavljac,
                    nacinPlacanja: hdrState.placanje,
                    napomena: hdrState.napomena
                },
                items: items
            })
            .then(() => {
                    itemIds = []
                    setItems([])
                    setItem({...defaultItemState})
                    hdrStateUpdate(defaultHdrState)
                    setValidationData({formValidated: false, nazivInvalid: undefined})
                    setFieldValidations({mjesto: undefined, dobavljac: undefined})
                })
            .catch(error => console.log(error))
        }
        else {
            setFieldValidations({mjesto: Boolean(hdrState.mjesto), dobavljac: Boolean(hdrState.dobavljac)})
            hdrStateUpdate({
                ...hdrState,
                hdrValidated: true
            })
        }
    };

    const izmijeniCallBack = (idx) =>{
        setItems(oldItems => {
            setItem([...oldItems.splice(idx, 1)][0]);
            itemIds.splice(idx,1)
            return [...oldItems]})
        setValidationData({formValidated: false, nazivInvalid: undefined})
    };

    const deleteCallBack = (idx) => {setItems((oldItems)=>{oldItems.splice(idx, 1); itemIds.splice(idx,1); return [...oldItems]})};

    //console.log(hdrState)
    console.log(item.id)
    //console.log(fieldValidations)
    return (
        <>
            <ZaprimkaHeader
                hdrStateUpdate={updObj => hdrStateUpdate({...hdrState, ...updObj})}
                hdrState={hdrState}
                validated={hdrState.hdrValidated}
                fieldValidations={fieldValidations}
                setFieldValidations={setFieldValidations}
                datum={hdrState.datum}
            />
             <NewItem
                addItemCallBack={addItemCallBack}
                onSelection={onItemSelection}
                item={item}
                setItem={(newData)=>setItem({...item, ...newData})}
                validationData={validationData}
                saveButtonDisabled={!items.length}
                onSaveCallback={onSaveCallback}
                token={props.token}
            />
            {items.map((item, idx)=>{
                const itemButtons = [
                    {buttonLabel:"Izmjeni", buttonVariant: "outline-dark", buttonCallBack: idx=>izmijeniCallBack(idx)},
                    {buttonLabel:"Obriši", buttonVariant: "outline-danger", buttonCallBack: idx=>deleteCallBack(idx)}
                ]
                return( item.invBr?
                    <ItemList key={idx}
                        item={{naziv:'', invBr:'', zapKolicina:'', vrijednost:'', ukupno:'', JMlaz:'', JMIzlaz:'', JMOdnos:'', ...filterData(item, ['id','poUlaznojJM', 'kolicina'])}}
                        buttonList={itemButtons}
                    />:
                null
                )
            })}
        </>
    )
};

const mapStateToProps = (fromRedux) => {
    return {item: fromRedux.savedData.item, token: fromRedux.token}
};

const mapDispatchToProps = dispatch => {
 return {
     itemToStore: (item) => dispatch({type: 'ITEM_UPDATE', item: item}),
 };
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Zaprimka))