import React, {useState} from 'react';
import Alert from 'react-bootstrap/Alert';
import Carousel from 'react-bootstrap/Carousel';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import {FormFieldWithPrefix, InputWithAsyncAutocomplete} from './CustomForms'
import {newAxios, getNalogList} from '../../Misc/MyAxios';
import {getDates} from '../../Misc/Functions';
import {itemSearcHandler, itemTransformData} from '../../Misc/AsyncHandlers'

const FilterMenuCarouesel = (props) => {
    const [dPast, dNow] = getDates(1)
    const [activeIndex, setIndex] = useState(1)
    const [showFilterMany, toggleFilterMany] = useState(false)
    const [params, setParams] = useState({dates: [dPast, dNow]})

    const onFindCallback = (params) => {
        getNalogList(props.token, params)
		.then( response => {response.data.naloziList.length? props.updateNaloziList(response.data.naloziList): props.updateNaloziList([])})
		.catch(error => console.log(error))
    };

    const onInputFieldChange = (newParams) => {
        console.log(newParams)
        newParams.od && setParams(oldParams => {
            const params = {dates: [newParams.od, oldParams.dates[1]]};
            onFindCallback(params);
            return params
        })
        newParams.do && setParams(oldParams => {
            const params = {dates: [oldParams.dates[0], newParams.do]};
            onFindCallback(params)
            return params
        })
    };

    const SearchByDate = (
        <Row>
            <Col>
                <FormFieldWithPrefix
                    prefix="Od"
                    id="od"
                    defaultValue={dPast}
                    type="date"
                    onChange={onInputFieldChange}
                />
            </Col>
            <Col>
                <FormFieldWithPrefix
                    prefix="Do"
                    id="do"
                    defaultValue={dNow}
                    type="date"
                    onChange={onInputFieldChange}
                />
            </Col>
        </Row>
    );

    //console.log(params, activeIndex)

    return (
        <Alert variant="secondary" as={Col} style={{marginBottom:0, paddingTop:6, paddingBottom: 10,}}>
            { showFilterMany?
            <>
            <Carousel as={Row} activeIndex={activeIndex} controls={false} interval={null} indicators={false} onSelect={()=>{}}>
                <Carousel.Item>
                    <InputWithAsyncAutocomplete style={{}}
                        prefix="Naziv"
                        placeholder="pretraga po nazivu ili invBr"
                        onSearchHandler={(param, setOptions, setIsLoading)=>itemSearcHandler(newAxios(props.token), param, setOptions, setIsLoading)}
                        onSelection={item => onFindCallback({item: itemTransformData(item[0]).invBr})} 
                    />
                </Carousel.Item>
                <Carousel.Item>
                    {SearchByDate}
                </Carousel.Item>
            </Carousel>
            <Row > {/*className="justify-content-md-end"*/}
                <Col>
                    <Button variant="outline-secondary" size="sm" className="float-left" onClick={()=>{toggleFilterMany(!showFilterMany)}}>⮙ Filtar</Button>
                </Col>
                <Col className="float-right">
                    <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={()=>{if (activeIndex===0) {setIndex(1); onFindCallback(params)} else {setIndex(0)} }}
                        >
                        {'>>'}
                    </Button>
                </Col>
            </Row>
            </>:
            <Col md='6' style={{paddingLeft: 0}}>
                <Button variant="outline-secondary" size="sm" onClick={()=>toggleFilterMany(!showFilterMany)}>⮛ Filtar</Button>
            </Col>
            }
        </Alert>
    )
};

export default FilterMenuCarouesel;