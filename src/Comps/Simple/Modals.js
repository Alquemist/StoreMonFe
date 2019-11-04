import React, {useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import {connect} from 'react-redux';
import {loginAxios} from '../../Misc/MyAxios';
import { preFetch } from '../../Misc/fetchs';

const ChangeNalogStatusModal = (props) => {

    return (
        <Modal show={props.show} onHide={props.onCloseCallback}>
            <Modal.Header closeButton>
                <Modal.Title>Status naloga</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p>Da li želite da sačuvate novi status naloga?</p>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="outline-secondary" onClick={props.onCloseCallback}>Otkaži</Button>
                <Button variant="outline-danger" onClick={props.onSaveCallback}>Sačuvaj</Button>
            </Modal.Footer>
        </Modal>
    )
};

const LoginModal = (props) => {

    const defCredentials = {username: '', pass: ''}
    const [credentials, setCredentials] = useState(defCredentials)
    const style = {marginBottom:'5px'}
    const [loginInvalid, setLoginInvalid] = useState(false)

    const onLoginCallBack = () => {
        //console.log(credentials)
        loginAxios(credentials.username, credentials.pass)
        .then(res => {
            console.log(res.data);
            props.onSetToken(res.data)
            preFetch(res.data)
        })
        .catch(err => { 
            if (err.response.status === 400) {
                setLoginInvalid(true)
            }
        })
    };
    //console.log(style)
    return (
        <Modal show={true} dialogClassName="modal-90w" onHide={()=>{}}>
            <Modal.Header className="justify-content-md-center">
                    <Col xs lg="2"></Col>
                    <Col md="auto">
                        <h4 style={{color: '#6c757d'}}>Unesite svoje kredencijale</h4>
                    </Col>
                    <Col xs lg="2"></Col>
            </Modal.Header>
            <Modal.Body>
                <Col>
                    <Form.Control required size="lg" isInvalid={loginInvalid} type="text" placeholder="Korisničko ime" value={credentials.username} style={style} onChange={event=>setCredentials({...credentials, username: event.target.value})}/>
                    {credentials.username? null: <Form.Control.Feedback type="invalid">Unesite korisničko ime</Form.Control.Feedback>}
                </Col>
                
                <Col>
                    <Form.Control size="lg" isInvalid={loginInvalid} type="password" placeholder="Lozinka" value={credentials.pass} style={style} onChange={event=>setCredentials({...credentials, pass: event.target.value})}/>
                    <Form.Control.Feedback type="invalid">Pogrešni kredencijali</Form.Control.Feedback>
                </Col>
                <Col>
                    <Row className="justify-content-md-center">
                        <Col xs lg="2"></Col>
                        <Col md="auto">
                            <Button variant='secondary' onClick={onLoginCallBack}>Prijavi se</Button>
                        </Col>
                        <Col xs lg="2"></Col>
                    </Row>
                </Col>
            </Modal.Body>
            <Modal.Footer>
                <a href="#" style={{color: '#343a40'}}>Zaboravni ste?</a>
            </Modal.Footer>
        </Modal>
    )
};

const mapDispatchToProps = dispatch => {
    return {
        onSetToken: (userData) => dispatch({type: 'SET_USERDATA', userData: userData}),
    };
   };

const connectedLoginModal = connect(null, mapDispatchToProps)(LoginModal)

export {ChangeNalogStatusModal, connectedLoginModal as LoginModal};