import React from 'react';
import NavBar from '../Simple/NavBar';
import Evidencija from './Evidencija';
import Zaprimka from './Zaprimka';
import Nalog from './Nalog';
import SpecProizvodnje from './SpecProizvodnje';
import TabWrapper from './OtpremniceTabsWrapper';
import {LoginModal} from '../Simple/Modals'
import {Route} from 'react-router-dom';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom';

//import test from '../../Misc/test'

console.log('može ovde')

const mainWin = (props) => (
    <>
        <NavBar/>
        <Route path="/" exact component={props.token? Evidencija: LoginModal} />
        <Route path='/Zaprimka' component={props.token? Zaprimka: LoginModal} />
        <Route path='/Nalog' component={props.token? Nalog: LoginModal} />
        <Route path='/SpecProizvodnje' component={props.token? SpecProizvodnje: LoginModal} />
        <Route path='/Prodaja' component={props.token? TabWrapper: LoginModal} />
    </>
);

const mapStateToProps = (fromRedux) => {
    return {token: fromRedux.userData.token}
};

export default withRouter(connect(mapStateToProps)(mainWin));