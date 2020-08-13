import React, {useState} from 'react';
import NavBar from '../Simple/NavBar';
import Evidencija from './Evidencija';
import Zaprimka from './Zaprimka';
import Nalog from './Nalog';
import SpecProizvodnje from './SpecProizvodnje';
import Otpremnice from './Otpremnice';
import {LoginModal} from '../Simple/Modals'
import {Route} from 'react-router-dom';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom';
import {getUserData} from '../../Misc/IDB_Handlers';


const MainWin = (props) => {

    const [isLoading, setLoadnig] = useState(!Boolean(props.token))
    
    const mainPage = isLoading?
        null   
        :(
            <>
                <NavBar/>
                <Route path="/" exact component={props.token? Evidencija: LoginModal} />
                <Route path='/Zaprimka' component={props.token? Zaprimka: LoginModal} />
                <Route path='/Nalog' component={props.token? Nalog: LoginModal} />
                <Route path='/SpecProizvodnje' component={props.token? SpecProizvodnje: LoginModal} />
                <Route path='/Otpremnice' component={props.token? Otpremnice: LoginModal} />
            </>
        );
    
    isLoading && getUserData()
        .then(userData => {
            props.setUserData(userData)
            setLoadnig(false)
        })
        .catch(e => console.log(e));
  
    return mainPage;
};

const mapStateToProps = (fromRedux) => {
    return {token: fromRedux.userData.token}
};

const mapDispatchToProps = dispatch => {
    return {setUserData: userData => dispatch({type: 'SET_USERDATA', userData: userData})}
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MainWin));