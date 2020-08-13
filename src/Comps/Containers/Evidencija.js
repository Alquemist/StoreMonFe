import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';

import {CreateAxiosMethods} from '../../Misc/MyAxios';
import {areSame, filterData} from '../../Misc/Functions';
import {ConfirmDelete} from '../Simple/Modals';

import ItemReport from '../Simple/ItemReport';
import AttrEditor from '../Simple/AttrEditor';
import SearchButt from '../Simple/SearchButt';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const Evidencija = (props) => {
    //console.log(props)
    const myAxiosMethods = CreateAxiosMethods(props.token)
    const initState = {
        newAttribs: [],
        attribToEdit: {},
        deletedAttribs: [],
        item: {},
        sacuvajDisabled: true,
    };
    
    const [state, setState] = useState(initState);
    const [modalActive, setModal] = useState(false);

    useEffect (() => {
        setState({
            ...state,
            newAttribs: [...props.attribs],
            attribToEdit: {new: true, naziv: '', tip: 'txt', vrijednost: ''},
            item: props.item,
            attribToEditIdx: props.attribs.length,
            sacuvajDisabled: !(Object.keys(state.item).length>0 && !props.item.new),
            invBrEdited: false,
        })
            },[props.attribs])

    const partialStateUpdate = (forUpdate) => {
        setState((oldState) => {
            return {...oldState, ...forUpdate}
        })
    };

    const deleteItemCallback = () => {
        if (state.item.new) {
            setState({...state, item: {}, newAttribs: []})
        }
        else {
            myAxiosMethods.deleteItem(state.item.id)
            .then((response) =>{
                if (response.status === 200) {
                    setState({...state, item: {}, newAttribs: [], sacuvajDisabled: true});
                    setModal(false);
                }
            })
        };
    };

    const dodajCallback = (attrib, attrIdx) => {
        console.log('dodaj', attrib);
        //ako se dodaje novi attr (!attrib.edit) i ako je isti kao postojeći onda alert ako ne onda setState
        ((!attrib.edit) && state.newAttribs.some((oldAttrib) => areSame({...attrib, id:0}, {...oldAttrib, id:0})))?
        alert('Već postoji'):
        setState((oldState) => {

            attrib.edit? //ako je promijenjen postojeći
            oldState.newAttribs[attrIdx] = attrib:
            oldState.newAttribs.unshift(attrib) //ako ne dodaj novi
            return {...oldState,
                newAttribs: oldState.newAttribs,
                attribToEdit: {new: true, naziv: '', tip: 'txt', vrijednost: ''},
                attribToEditIdx: oldState.newAttribs.length,
                sacuvajDisabled: false
            }
        })
    };

    const editCallback = (attrIdx) => {
        console.log('edit', attrIdx, )
        //const attribs = this.state.newAttribs.filter((oldAttrib) => {return (oldAttrib.id !== attribToEdit.id)})
        setState((oldState) => {
            return {
                ...oldState,
                attribToEditIdx: attrIdx,
                attribToEdit: {
                    ...oldState.newAttribs[attrIdx],
                    edit: true,
                },
            }
        })
    };

    const obrisiCallback = (attrIdx) => {
        setState((oldState) => {
            const deletedAtrib =  oldState.newAttribs[attrIdx]
            const deletedAttribs = deletedAtrib.new? oldState.deletedAttribs: oldState.deletedAttribs.concat([deletedAtrib.id])
            oldState.newAttribs.splice(attrIdx,1)
            return {
                ...oldState,
                newAttribs: [...oldState.newAttribs],
                attribToEdit:{new: true, naziv: '', tip: 'txt', vrijednost: ''}, 
                attribToEditIdx: oldState.newAttribs.length,
                deletedAttribs: deletedAttribs,
                sacuvajDisabled: false,
            }
        })
    };

    const saveButtonCallback = () => {

        const newAttribs = []
        const editedAttribs = []

        state.newAttribs.forEach((attrib) => {
            if (attrib.new) {newAttribs.push(filterData(attrib, ['new', 'edit']))}
            if (attrib.edit && !attrib.new) {editedAttribs.push(filterData(attrib, ['new', 'edit']))}
        });

        (newAttribs.length !== 0 || state.item.new) && myAxiosMethods.addAndLink(newAttribs, state.item).then(
            (response) => setState((oldState) => {
            return {
                ...oldState,
                item: {...oldState.item, id:response.data, new: false},
                saveButtonDisabled: true,
            }
        }));
        Promise.all(
            [(editedAttribs.length !== 0) && myAxiosMethods.updateAttribs(editedAttribs)],
            [(state.deletedAttribs.length !==0) && myAxiosMethods.deleteAttribs(state.deletedAttribs)],
            [(state.item.edit && !state.item.new) && myAxiosMethods.updateItem({...filterData(state.item, ['edit']),JMOdnos: parseFloat(state.item.JMOdnos)})]
        ).then(()=>{setState({...state, sacuvajDisabled: true})})
        .catch((error) => {console.log('Evidencija: saveButtonCallBack:',error)})
    };

    // zaprimkaFetch('/primka/getData/', props.token)
    // .then(data=>console.log(data))
    // .catch(err=>console.log(err))
    return (
        modalActive?
        <ConfirmDelete
            onNazad={()=>setModal(false)}
            onDelete={deleteItemCallback}
        />
        :<div>
            <Alert variant="secondary" style={{marginBottom: '8px'}}>
                <Form.Group as={Row}>
                    <Col md="4">
                        <SearchButt itemToStore={props.itemToStore} attribsToStore={props.attribsToStore} token={props.token}/>
                    </Col>
                    <Col>
                        <Button md="2" variant="outline-dark" disabled={state.sacuvajDisabled} onClick={() => saveButtonCallback(state.item)}>Sačuvaj</Button>
                    </Col>
                </Form.Group>
            </Alert>

            {Object.keys(state.item).length>0 &&
            <>
                <ItemReport key={props.item.naziv}
                    token={props.token}
                    item={state.item}
                    updateItem={newData => partialStateUpdate({item:{...state.item, ...newData}})}
                    invBrEdited={state.invBrEdited}
                    setInvEdited={()=> {!state.invBrEdited && setState({...state, invBrEdited: true})}}
                    // onItemChange={onItemChange}
                    deleteItemCallback={()=>setModal(true)}
                    toggleSacuvaj={buttonDisabled=>partialStateUpdate({sacuvajDisabled: buttonDisabled})}
                />
                
                <AttrEditor
                    attribs={state.newAttribs}
                    dodajCallback={dodajCallback}
                    editCallback={editCallback}
                    obrisiCallback={obrisiCallback}
                    newAttribs={state.newAttribs}
                    attribToEdit={state.attribToEdit}
                    attribToEditIdx={state.attribToEditIdx}
                />
            </> }
        </div>
    )

};

const mapStateToProps = (fromRedux) => {
    return {item: fromRedux.savedData.item, attribs: fromRedux.savedData.attribs, token: fromRedux.userData.token,}
};

const mapDispatchToProps = dispatch => {
 return {
     selectionToStore: (item, attribs) => dispatch({type: 'ITEM_SELECTION', item: item, attribs: attribs}),
     attribsToStore: (attribs) => dispatch({type: 'ATTR_UPDATE', attribs: attribs}),
     itemToStore: (item) => dispatch({type: 'ITEM_UPDATE', item: item}),
 };
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Evidencija));