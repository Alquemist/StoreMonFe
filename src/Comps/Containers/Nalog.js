import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';

import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';

import ItemList from '../Simple/ItemList';
import NalogOverview from '../Simple/NalogOverview';
import {ChangeNalogStatusModal} from '../Simple/Modals'
import FilterMenuCarouesel from '../Simple/FilterMenuCarouesel'
import {InputWithAsyncAutocomplete, FormFieldWithPrefix, TexBoxtWithPrefix} from '../Simple/CustomForms';
import {getLastInvBr, saveNalog, getSpecs, getNalogList, updateNalogStatus} from '../../Misc/MyAxios';
import {filterData, getDates, incrementDocBr} from '../../Misc/Functions';
import {itemSearcHandler, itemTransformData} from '../../Misc/AsyncHandlers';
import { newAxios } from '../../Misc/MyAxios';

//import { stringify } from 'querystring';

const Nalozi = (props) => {
	const [dPastISOString, dNowISOString] = getDates(1)
	const headerDefault = {docBr: '', datum: new Date().toJSON().slice(0,10), kolicina: '', napomena: '', status: 0};
	const [nalog, setNalog] = useState(headerDefault);
	const [validationData, setValidation] = useState({formValidated: false, itemInvalid:false});
	const [item, setItem] = useState({});
	const [specList, setSpecList] = useState([])
	const [naloziList, setNaloziList] = useState([])
	const [showModal, toggleModal] = useState(false)
	const [nalogUpdateData, setNalogUpdateData] = useState({nalogIdx:'', newState:''})
	const [statusDict, setStatusDict] = useState({})

	const onItemSelection = (selectedItem) => {
		console.log(selectedItem)
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
				Object.keys(selectedItem).length? setValidation({...validationData, itemInvalid: false}): setValidation({...validationData, itemInvalid: true})
			}).catch(error => console.log(error))
		};
	};

	useEffect(()=>{
		getNalogList(props.token, {dates: [dPastISOString, dNowISOString]})
		.then(response => {
			setStatusDict(response.data.statusDict);
			setNaloziList(response.data.naloziList);
			setNalog({...nalog, docBr: incrementDocBr(response.data.docBr)})
		})
		.catch(error => console.log(error))
		}, []);


	const saveCallBack = () => {
		const itemValid = Boolean(Object.keys(item).length)
		const formValid = Object.keys(nalog).some(key => key==='napomena'||!Boolean(nalog[key]))
		
		if (itemValid&&formValid) {
			saveNalog(props.token, item.id, nalog)
			.then((response)=>{
				setNalog({...headerDefault, docBr: incrementDocBr(nalog.docBr)})
				setItem({})
				setNaloziList(oldList=>{oldList.push({...nalog, id:response.data, naziv: item.naziv}); return([...oldList])})
				setValidation({formValidated: false, itemInvalid:false})
			})
			.catch(error => {
				if (error.response) {
					alert(error.response.data);
					console.log(error.response);
				} else {
					console.log('saveNalog request error:', error)
				}
			})
			return
		}
		setValidation({formValidated: true, itemInvalid:!itemValid})
	};

	const onModalSave = () => {
		console.log(nalogUpdateData.nalogIdx, nalogUpdateData.newStatus)
		updateNalogStatus({...naloziList[nalogUpdateData.nalogIdx], status: nalogUpdateData.newStatus}, props.token)
		.then(()=>{
			setNaloziList(oldList => {
				oldList[nalogUpdateData.nalogIdx].status = nalogUpdateData.newStatus
				return([...oldList])
			});
			setNalog({...nalog, docBr: incrementDocBr(nalog.docBr)})
			toggleModal(false)
		})
		.catch(error => console.log(error))
	};

	const onNalogStatusChange = (newStatus, nalogIdx) => {
		console.log(newStatus, nalogIdx)
		setNalogUpdateData({nalogIdx: nalogIdx, newStatus: newStatus})
		toggleModal(true)
	};

	const buttonList = [{buttonLabel: "Izmjeni", buttonCallBack: ()=>{}, buttonVariant: "outline-dark"},];
	console.log(specList.length? '70vh': '100vh')
	return (
		<>
		<ChangeNalogStatusModal show={showModal} onCloseCallback={()=>toggleModal(false)} onSaveCallback={onModalSave}/>
			<Row className='no-gutters' styles={{height: '100vh', display: 'flex'}}>
				<Col md={6} style={{padding: '0 6px 6px 0'}}>
					<Form validated={validationData.formValidated}>
						<FormFieldWithPrefix
							prefix="Doc br."
							id="docBr"
							type="text"
							required
							value={nalog.docBr}
							onChange={newData => setNalog({...nalog, ...newData})}
						/>
						<FormFieldWithPrefix
							prefix="Datum"
							id="datum"
							type="date"
							required
							value={nalog.datum}
							onChange={newData => setNalog({...nalog, ...newData})}
						/>
					</Form>
						<InputWithAsyncAutocomplete key={item.id}
							asyncInvalid={validationData.itemInvalid}
							prefix="Proizvod"
							placeholder="izaberi proizvod"
							selected={item.naziv? [item.naziv]: []}
							suffix={item.id? `${item.kolicina} [${item.JMIzlaz}]`: '0 [/]'}
							onSearchHandler={(param, setOptions, setIsLoading)=>itemSearcHandler(newAxios(props.token), param, setOptions, setIsLoading)}
							onSelection={item => onItemSelection(itemTransformData(item[0]))}
						/>
					<Form validated={validationData.formValidated}>
						<FormFieldWithPrefix
							prefix="Kolicina"
							id="kolicina"
							type="number"
							required
							value={nalog.kolicina}
							onChange={newData => setNalog({...nalog, ...newData})}
						/>
						<TexBoxtWithPrefix
							id='napomena'
							prefix='Napomena'
							value={nalog.napomena}
							onChange={newData => setNalog({...nalog, ...newData})}
						/>
					</Form>
					<Button variant="outline-dark" onClick={saveCallBack}>Sačuvaj</Button>
				</Col>
				<Col md={6} style={{maxHeight: specList.length? '70vh': '100vh', overflowY:'auto'}}>
					<FilterMenuCarouesel
						updateNaloziList={setNaloziList}
						token={props.token}
					/>
					{naloziList.length>0 &&
					<NalogOverview
						naloziList={naloziList}
						statusDict={statusDict}
						onNalogStatusChange={onNalogStatusChange}
						onChoseColumn={data => console.log(data)}/> }
				</Col>
			</Row>
			{specList.length?
				specList.map((spec, idx) => {
					//console.log(idx)
					return (
						<div style={{paddingTop: '8px'}}>
							<ItemList key={idx}
								item={filterData(spec, ['materijalId', 'new', 'id'])}
								buttonList={buttonList}
							/>
						</div>
						
					)
				}
			)
			:null}
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
   
export default connect(mapStateToProps, mapDispatchToProps)(Nalozi)