import React, {useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import {connect} from 'react-redux';
import {loginAxios} from '../../Misc/MyAxios';
import * as myDBApi from '../../Misc/IDB_Handlers';


const ConfirmDelete = (props) => {

    // const style = {  //On top center horizontally
    //     position: 'absolute',
    //     zIndex: 10,
    //     left: 0,
    //     right: 0,
    //     marginLeft: 'auto',
    //     marginRight: 'auto',
    //     width: '50%'};

    return (
        <Modal.Dialog>
            <Modal.Header closeButton>
                <Modal.Title>Da li ste sigurni?</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p>Ovo će izbrisati sve podatke vezane za ovaj artikal</p>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={props.onNazad}>Nazad</Button>
                <Button variant="danger" onClick={props.onDelete}>Obriši</Button>
            </Modal.Footer>
        </Modal.Dialog>
    );
};


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

    const defCredentials = {username: '', pwd: ''};
    const [credentials, setCredentials] = useState(defCredentials);
    const style = {marginBottom:'5px'};
    const [isInvalid, setInvalid] = useState({username: false, pwd: false});
    const [loginFailed, setLoginFailed] = useState();

    const onLoginCallBack = () => {

        let usernameInvalid = !credentials.username
        let pwdInvalid = !credentials.pwd

        if (usernameInvalid||pwdInvalid){
            setInvalid({username: usernameInvalid, pwd: pwdInvalid})
            return
        };

        loginAxios(credentials.username, credentials.pwd)
        .then(res => {
            console.log(res.data);
            props.onSetToken(res.data)
            myDBApi.storeUserData(res.data)
        })
        .catch(err => {
            console.log(err)
            setLoginFailed(true)
        })
    };

    const onKeyUp = (event) => {
        if (event.keyCode === 13) {
            onLoginCallBack()
        }
    };
    console.log(isInvalid.pwd)
    return (
        <Modal show={true} dialogClassName="modal-90w" onHide={()=>{}}>
            <Modal.Header className="justify-content-md-center" style={{background: '#e2e3e5'}}>
                    <Col xs lg="2"></Col>
                    <Col md="auto">
                        <h4 style={{color: '#6c757d'}}>Unesite svoje kredencijale</h4>
                    </Col>
                    <Col xs lg="2"></Col>
            </Modal.Header>
            <Modal.Body>
                <Col>
                    <Form.Control size="lg" style={style}
                        required 
                        isInvalid={isInvalid.username}
                        type="text"
                        placeholder="Korisničko ime"
                        value={credentials.username} 
                        onChange={event=>setCredentials({...credentials, username: event.target.value})}
                        onKeyUp={onKeyUp}
                    />
                    <Form.Control.Feedback type="invalid">Unesite korisničko ime</Form.Control.Feedback>
                </Col>
                
                <Col>
                    <Form.Control size="lg" style={style} 
                        isInvalid={isInvalid.pwd || loginFailed}
                        type="password"
                        placeholder="Lozinka"
                        value={credentials.pwd}
                        onChange={event=>setCredentials({...credentials, pwd: event.target.value})}
                        onKeyUp={onKeyUp}
                    />
                    <Form.Control.Feedback type="invalid">
                        {isInvalid.pwd? 'Unesite Lozinku': 'Prijava neuspješna'} 
                    </Form.Control.Feedback>
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

export {ChangeNalogStatusModal, connectedLoginModal as LoginModal, ConfirmDelete};