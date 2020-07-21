import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { withRouter } from 'react-router-dom';

const navBar = (props) => {
    const path = props.history.location.pathname.split('/').join('')
    console.log(path)
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
    </Navbar>
)};

export default withRouter(navBar);