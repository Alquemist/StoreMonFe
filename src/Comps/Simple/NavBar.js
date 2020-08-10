import React, {useState} from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { withRouter } from 'react-router-dom';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import {connect} from 'react-redux';
import {removeUserData} from '../../Misc/IDB_Handlers';

const NavBar = (props) => {
    const path = props.history.location.pathname.split('/').join('')
    const ud = props.userData

    const [hovering, setHover] = useState(false);

    return(
        <Navbar expand="md" bg="dark" variant="dark">
            <Navbar.Brand href="/">SPARTA</Navbar.Brand>
            <Nav className="mr-auto">
                <Nav.Link active={path===''} href="#/">Evidencija</Nav.Link>
                <Nav.Link active={path==='Otpremnice'} href="#Otpremnice">Otpremnice</Nav.Link>
                <Nav.Link active={path==='Zaprimka'} href="#Zaprimka">Zaprimka</Nav.Link>
                <Nav.Link active={path==='Nalog'} href="#Nalog">Nalozi</Nav.Link>
                <Nav.Link active={path==='SpecProizvodnje'} href="#SpecProizvodnje">Sastavnica</Nav.Link>
            </Nav>
            {ud.token?
                <Button variant="secondarry" className='float-right' style={{color:'white'}}
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