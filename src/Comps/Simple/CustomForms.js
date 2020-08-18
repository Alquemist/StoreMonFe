import React, {useState} from 'react';
import {Typeahead, AsyncTypeahead} from 'react-bootstrap-typeahead';
import InputGroup from 'react-bootstrap/InputGroup';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';

const rowStyle = {
    padding: '0 0 5px 0',
    margin: 0,
}

export const InputWithAutocomplete = (props) => {

    const onChange = (selection) => {
        let selected = {};
        selected[props.id] = props.defaultValue
        //console.log(selection)
        if (selection && selection.customOption) {
            selected[props.id] = selection.label
        };
        if (selection && !selection.customOption) {
            selected[props.id] = selection
        };
        props.onChange(selected)
    };

    return (
        <Row style={rowStyle}>
            {props.prefix &&
            <Col xs='3' style={{paddingRight: 0, paddingLeft: 0}}>
                <InputGroup.Text as={Col}>{props.prefix}</InputGroup.Text>
            </Col>}
            <Col style={{'paddingLeft': 0, 'paddingRight': 0}}>
                <Typeahead
                    allowNew
                    isInvalid={props.isInvalid}
                    isValid={props.isValid}
                    defaultSelected={props.defaultSelected? props.defaultSelected: []}
                    selected={props.selected}
                    onChange={selection => onChange(selection[0])}
                    options={props.options}
                    placeholder={`${props.selected? '': props.placeholder}`}
                    newSelectionPrefix="izaberi:"
                />
            </Col>
        </Row>
      );
};

export const InputWithAsyncAutocomplete = (props) => {
    //console.log(props.asyncInvalid)

    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState([])

    const renderMeny = (option) => (
        <div style={{zIndex:1}}>
          {option.naziv}
          <div>
            <small>invBr: {option.invBr}</small>
          </div>
        </div>
      );

    return (
        <Row style={rowStyle}>
            <Col xs='3' style={{paddingRight: 0, paddingLeft: 0}}>
                <InputGroup.Text as={Col}>{props.prefix}</InputGroup.Text>
            </Col>
            <Col style={{'paddingLeft': 0, 'paddingRight': 0}}>
                <AsyncTypeahead
                    isInvalid={props.asyncInvalid}
                    isValid={props.asyncValid}
                    selected={props.selected}
                    renderMenuItemChildren={renderMeny}
                    newSelectionPrefix="Dodaj u inventar: "
                    placeholder={props.placeholder}
                    filterBy={['naziv', 'invBr']}
                    labelKey='naziv'
                    minLength={1}
                    allowNew
                    useCache={false}
                    isLoading={isLoading}
                    onSearch={(param)=>props.onSearchHandler(param, setOptions, setIsLoading)}
                    options={options}
                    onChange={props.onSelection}
                />
            </Col>
            {
                props.suffix &&
                <InputGroup.Append>
                    <InputGroup.Text>{props.suffix}</InputGroup.Text>
                </InputGroup.Append>
            }
        </Row>
      );
};

export const FormFieldWithPrefix =  (props) => {
    const prefixSize = props.prefixSize? props.prefixSize: "3"
    const placeholder = props.placeholder? props.placeholder: props.prefix
    const invalidMessage = props.invalidMessage? props.invalidMessage: 'Polje je obavezno!'
    const prefixStyle = props.prefixStyle? props.prefixStyle: {}
    const postfixStyle =  props.postfixStyle? props.postfixStyle: {}
    //console.log({fontSize: props.fontSize? props.fontSize: '16px'})
    return (
        <Form.Group as={Row} style={rowStyle}>
            <InputGroup>
                <InputGroup.Prepend as={Col} xs={prefixSize} style={{paddingRight: 0, paddingLeft: 0}}>
                    <InputGroup.Text className={"text-justify"} as={Col} style={{paddingLeft: 4, paddingRight: 4, ...prefixStyle}}>{props.prefix}</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control style={{fontSize: props.fontSize? props.fontSize: '16px', paddingRight:'0px', ...postfixStyle}}
                    required={props.required}
                    type={props.type}
                    id={props.id}
                    defaultValue={props.defaultValue && props.defaultValue}
                    isValid={props.isValid}
                    isInvalid={props.isInvalid}
                    value={props.value}
                    placeholder={placeholder}
                    disabled={props.disabled}
                    onChange={(event)=>props.onChange({[props.id]: props.type==='number'? Number(event.target.value): event.target.value})}
                    >
                </Form.Control>
                <Form.Control.Feedback type="invalid">{invalidMessage}</Form.Control.Feedback>
            </InputGroup>
        </Form.Group>   
    )
};

export const FormFieldWithDropDown = (props) => {
    //console.log(props.ddItems)
    const prefixSize = props.prefixSize? props.prefixSize: '3'
    //const ddButtonVariant = props.ddInvalid? "outline-danger": "outline-secondary"
    return(
        <Form.Group as={Row} style={rowStyle}>
            <InputGroup>
                <InputGroup.Prepend as={Col} xs={prefixSize} style={{paddingRight: 0, paddingLeft: 0}}>
                    <InputGroup.Text className={"textJustify"} as={Col} style={{paddingLeft: 4, paddingRight: 4, textAlign: 'center'}}>{props.prefix}</InputGroup.Text>
                </InputGroup.Prepend>
                <InputGroup.Append as={Col} style={{paddingLeft:'3px', paddingRight:'0px'}}>
                    <Dropdown style={{width:'100%', height: '100%',}}>
                        <Dropdown.Toggle variant={props.ddButtonVariant} style={{width:'100%', height: '100%'}}>{props.ddLabel}</Dropdown.Toggle>
                            <Dropdown.Menu  style={{width:'100%'}} xs={12-prefixSize}>
                                {Object.keys(props.ddItems).map((key) =>{
                                    return(
                                        <Dropdown.Item key={key} onSelect={newStatus => props.onChange({[props.id]: newStatus})} eventKey={key}>{props.ddItems[key]}</Dropdown.Item>
                                )})}
                            </Dropdown.Menu>
                    </Dropdown>
                </InputGroup.Append>
            </InputGroup>
        </Form.Group>
    )
};

export const FormFieldWithDropdownSuffix =  (props) => {
    const placeholder = props.placeholder? props.placeholder: props.prefix
    const prefixSize = props.prefixSize? props.prefixSize: '3'
    const suffixSize = props.suffixSize? props.suffixSize: '3'
    //console.log(props.ddItems)
    //const ddButton = <Button style={{width:'100%', height: '100%', paddingLeft:0, paddingRight:0}}></Button>
    const invalidMessage = props.invalidMessage? props.invalidMessage: 'Polje je obavezno!'
    const ddButtonVariant = props.ddInvalid? props.ddInvalidVariant: props.ddValidVariant
    return (
        <Form.Group as={Row} style={rowStyle}>
            <InputGroup>
                <InputGroup.Prepend as={Col} xs={prefixSize} style={{paddingRight: 0, paddingLeft: 0}}>
                    <InputGroup.Text className={"text-justify"} as={Col} style={{paddingLeft: 4, paddingRight: 4, textAlign: 'center'}}>{props.prefix}</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                    required={props.required}
                    type={props.type}
                    id={props.id}
                    defaultValue={props.defaultValue && props.defaultValue}
                    isValid={props.isValid}
                    isInvalid={props.isInvalid}
                    value={props.value}
                    placeholder={placeholder}
                    disabled={props.disabled}
                    onChange={(event)=>props.onChange({[props.id]: event.target.value})}
                    >
                </Form.Control>
                {props.ddItems.length ?
                <InputGroup.Append as={Col} xs={suffixSize} style={{paddingLeft:'3px', paddingRight:'0px'}}>
                    <Dropdown style={{width:'100%', height: '100%',}}>
                        <Dropdown.Toggle variant={ddButtonVariant} style={{width:'100%', height: '100%'}}>{props.ddLabel}</Dropdown.Toggle>
                            <Dropdown.Menu>
                                {props.ddItems.map((ddItem, idx) => {
                                    //console.log(ddItem)
                                    // console.log(key)
                                    return(
                                    <Dropdown.Item key={idx} onSelect={() => props.onSelectDD(ddItem.option)}>{ddItem.label}</Dropdown.Item>
                                )})}
                            </Dropdown.Menu>
                    </Dropdown>
                </InputGroup.Append>:
                <InputGroup.Append as={Col} xs='3' style={{paddingLeft: '3px', paddingRight:'0px'}}>
                    <InputGroup.Text disabled={true} style={{width:'100%', height: '100%'}}>{props.ddLabel}</InputGroup.Text>
                </InputGroup.Append>}
                <Form.Control.Feedback type="invalid">{invalidMessage}</Form.Control.Feedback>
            </InputGroup>
                
                {// <Col md='2' style={{'paddingLeft': 0, 'paddingRight': 0}}>
                //     <InputGroup.Text as={Col}>{props.suffix}</InputGroup.Text>
                // </Col>
            }
        </Form.Group>   
    )
};

export const RadiosWithPrefix = (props) => {
    const prefixSize = props.prefixSize? props.prefixSize: '3';
    return (
    <Form.Group as={Row} style={rowStyle}>
        <InputGroup.Prepend as={Col} xs={prefixSize} style={{paddingRight: 0, paddingLeft: 0}}>
            <InputGroup.Text className={"text-justify"} as={Col} style={{paddingLeft: 4, paddingRight: 4, textAlign: 'center'}}>{props.prefix}</InputGroup.Text>
        </InputGroup.Prepend>
        {Object.entries(props.options).map( data => {
            const [key, label] = data;
            //console.log(key, props.defaultChecked, key===props.defaultChecked)
            return (
            <Col key={key}>
                <Form.Check
                    inline
                    label={label}
                    name="radioGroup"
                    type='radio'
                    defaultChecked={props.defaultChecked===key}
                    onChange={()=>props.onChange({[props.id]:key})}
                />
            </Col>
        )})}
    </Form.Group>
    )
};

export const TextBox = (props) => {
    return (
        <Form.Group as={Row} style={rowStyle}>
            <InputGroup > 
                <InputGroup.Prepend as={Col} xs='3' style={{paddingRight: "0", borderRight:"0", marginRight:'0'}}>
                    <InputGroup.Text style={{width:'100%'}}>Napomena</InputGroup.Text>
                </InputGroup.Prepend>
                <Col style={{'paddingLeft': 0, 'paddingRight': 0}}>
                    <Form.Control as="textarea"
                        onChange={event => props.onChange(event.target.value)}
                        value={props.value}
                    />
                </Col>
            </InputGroup>
        </Form.Group>
    )
};

export const DropdownForm = (props) => {

    const [selection, setSelection] = useState(props.options[0])
    let chosenNumber = Number(selection[0])
    let tagList = Array(chosenNumber).fill(1).map((_, idx) => {return(idx+1)})

    return (
        <Row className='no-gutters'>
            <Dropdown>
                <Dropdown.Toggle variant='secondary' style={{marginLeft:"10px"}}>
                    {`${props.prefix} ${selection}`}
                </Dropdown.Toggle>
                <Dropdown.Menu> 
                    {props.options.map(option => {
                        return (
                        <Dropdown.Item key={option} onSelect={() => setSelection(option)}>{option}</Dropdown.Item>
                    )})}
                </Dropdown.Menu>
            </Dropdown>
            {tagList.map((key) => {
                return (
                    <InputGroup as={Col} key={key} style={{paddingRight: "0", paddingLeft:'0'}}> 
                        <InputGroup.Prepend>
                        <InputGroup.Text >{`d${key}`}</InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control
                            type="text"
                            placeholder={`d${key}`}
                            onChange={(event)=>props.onChange(event.target.value, key-1)}
                        />
                    </InputGroup>
                )
            })}           
        </Row>
    )
};

export const TexBoxtWithPrefix = (props) => {
    return (
        <Form.Group as={Row} className='no-gutters' style={{marginTop: 0, marginBottom: '5px', ...props.customStyle}}>
            <InputGroup style={{height: '81px'}}>
                <InputGroup.Prepend as={Col} xs='3' style={{'padding': 0}}>
                    <InputGroup.Text className={"text-justify"} as={Col} style={{paddingLeft: 4, paddingRight: 4}}>{props.prefix}</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control as="textarea" style={{fontSize: '16px', paddingRight:'0px'}}
                    onChange={(event)=>props.onChange({[props.id]: event.target.value})}
                >
                </Form.Control>
            </InputGroup>
        </Form.Group>  
    );
};
