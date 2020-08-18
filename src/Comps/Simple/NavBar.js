import React, {useState} from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { withRouter } from 'react-router-dom';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import {connect} from 'react-redux';
import {removeUserData} from '../../Misc/IDB_Handlers';

const NavBar = (props) => {
    const path = props.history.location.pathname.split('/').join('')
    const ud = props.userData
    const [hovering, setHover] = useState(false);
    //style={{position: 'fixed', top: '0', left: '0'}}
    return(
        <Navbar expand="md" bg="dark" variant="dark">
            <Navbar.Brand style={{alignSelf: 'flex-start', display: 'inline-block', paddingLeft:0, marginRight: 0}} href="/">SPARTA</Navbar.Brand> 
            <Nav style={{alignItems: 'flex-start', paddingLeft:'12px'}} className="mr-auto">
                <Nav.Link active={path===''} href="#/">Evidencija</Nav.Link>
                <Nav.Link active={path==='Otpremnice'} href="#Otpremnice">Otpremnice</Nav.Link>
                <Nav.Link active={path==='Zaprimka'} href="#Zaprimka">Zaprimka</Nav.Link>
                <Nav.Link active={path==='Nalog'} href="#Nalog">Nalozi</Nav.Link>
                <Nav.Link active={path==='SpecProizvodnje'} href="#SpecProizvodnje">Sastavnica</Nav.Link>
            </Nav>
            {ud.token?
                <Button variant="secondarry" style={{color:'white', display:'inline-block', alignSelf: 'flex-start', padding:0}}
                onClick={() => {props.logout(); removeUserData(ud.userID)}}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}>
                {ud.ime[0]+ud.prezime[0]}: <Badge style={hovering? {'textDecoration': 'underline'}: {}}>logout</Badge>
            </Button>
            :null
            }
        </Navbar>
)};

const mapStateToProps = (fromRedux) => {
    return {userData: fromRedux.userData}
};

const mapDispatchToProps = (dispatch) => {
    return {logout: () => dispatch({type: 'CLEAR_USERDATA', userData: {}})}
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NavBar));