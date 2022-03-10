import React, {Component} from 'react';
//import {connect} from 'react-redux';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';


class FormGroup extends Component {
    
    state = {
        attr: {...this.props.attr},
        buttonDisabled: !(this.props.attr.naziv && this.props.attr.vrijednost),
        daChecked: this.props.attr.vrijednost === '1',
        neChecked: this.props.attr.vrijednost === '0',
        };

    onAttrChange = (attrUpdate) => {
        console.log(attrUpdate)
        const newAttr = {...this.state.attr, ...attrUpdate}
            this.setState(
                {
                    attr: newAttr,
                    buttonDisabled: !(newAttr.naziv && newAttr.vrijednost)
                }
            )
        };

    attrTypeChanger = (event) => {
        const value = event.target.value;
        (value!==this.state.attr.tip) && this.setState(oldAttrib => {
            return {
                attr: {
                    ...oldAttrib.attr,
                    tip: value,
                    vrijednost: '',
                },
                buttonDisabled: true,
                daChecked: oldAttrib.attr.vrijednost === '1',
                neChecked: oldAttrib.attr.vrijednost === '0',
            }
        })
        
        //this.props.toggleSaveState(!areSame(this.state.oldAttrib, {...this.state.attr, tip: event.target.value}))
    };

        dynElem = () => (
            this.state.attr.tip === "bool" ?
            <div onChange={(event) => this.onAttrChange({vrijednost: event.target.value})}>
                <Form.Check id="vrijednost" inline label="Da" value={1} type="radio" name="radioOPs" defaultChecked={this.state.daChecked}/>
                <Form.Check id="vrijednost" inline label="Ne" value={0} type="radio" name="radioOPs" defaultChecked={this.state.neChecked}/>
            </div>
            :
            <Form.Control md="4" type="text" placeholder="vrijednost" value={this.state.attr.vrijednost} onChange={(event) => this.onAttrChange({vrijednost: event.target.value})}/>
        );

        colStyle = {padding: '0 3px 0 3px'};


    render() {
        console.log(this.state.attr)
        // console.log(this.props)

        return(
            <Form.Group as={Row} className='no-gutters' style={{padding: 0, margin: 0}}>
            
                <Col md="4" style={this.colStyle}>
                    <Form.Control type="text" placeholder="naziv" defaultValue={this.state.attr.naziv} onChange={(event) => this.onAttrChange({naziv: event.target.value})}/>
                </Col>
                <Col md="3" style={this.colStyle}>
                    <Form.Control id="tip" as="select"  onChange={this.attrTypeChanger} defaultValue={this.state.attr.tip}>
                        <option>txt</option>
                        <option>broj</option>
                        <option>bool</option>
                    </Form.Control>
                </Col>
                <Col md="4" style={this.colStyle}>
                    {this.dynElem()}
                </Col>
                <Col md='1'>
                    <Button style={{padding: '6px'}} variant="light" disabled={this.state.buttonDisabled} onClick={() => this.props.dodajCallback(this.state.attr)}>Dodaj</Button>
                </Col>
            </Form.Group>
        );
    };
};


const attrEditor = props => {

        //console.log(props.attribToEditIdx)
        return (
            <>
            <Alert variant="secondary" style={{padding: '12px', margin: 0}}>
                <FormGroup
                    key={props.attribToEditIdx}
                    attr={props.attribToEdit}
                    dodajCallback={(attrib) => {props.dodajCallback(attrib, props.attribToEditIdx)}}
                /> 
            </Alert> 
            {props.newAttribs.length? <Table responsive striped bordered hover>
                <tbody>
                    <tr>
                        <th>Naziv</th>
                        <th>Vrijednost</th>
                        <th>Tip</th>
                        <th>*</th>
                    </tr>
                    {props.newAttribs.map((attr, idx) => {
                        //console.log(idx, props.attribToEditIdx);
                        return (
                            (idx === props.attribToEditIdx)?
                            null:
                            <tr key={idx}>
                                <td style={{padding: '3px'}}>{attr.naziv}</td>
                                <td style={{padding: '3px'}}>{attr.vrijednost}</td>
                                <td style={{padding: '3px'}}>{attr.tip}</td>
                                <td style={{padding: '3px'}}>
                                    <Button variant="outline-dark" size='sm' style={{marginRight: '8px'}} onClick={() => props.editCallback(idx)}>Uredi</Button>
                                    <Button variant="outline-danger" size='sm' onClick={() => props.obrisiCallback(idx)}>Obriši</Button>
                                </td>
                            </tr>)})}
                </tbody>
            </Table>:
            null }
            </>
        )

};

// const mapStateToProps = (fromRedux) => {
//     const state = {attribs:fromRedux.savedData.attribs, savedState:fromRedux.savedState}
//     return state;
// };

// const mapDispatchToProps = (dispatch) => {}

// export default connect(mapStateToProps, mapDispatchToProps)(attrEditor);
export default attrEditor;