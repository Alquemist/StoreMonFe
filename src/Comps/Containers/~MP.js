import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';

import MPHeader from '../Simple/MPHeader';
import MPItemList from '../Simple/MPNewItem';
import {getDates, filterData} from '../../Misc/Functions';
import {POSAxiosGet} from '../../Misc/MyAxios'

const MP = (props) => {

    const token = props.userData.token
    const defaultHeader = {
        userData: props.userData,
        kasaId: '',
        mjesto: '',
        datum: getDates(1)[1],
        docBr: '',
        nacinPlacanjaOdmah: '',
        nacinPlacanjaOstatak: '',
        naciniPlacanja: {odmah: [], ostatak: []},
        odmah: '',
        ostatak: '',
    };

    const DefaultMPItem = {
        item: {},
        otprKolicina: 1,
        poIzlaznojJM: true,
        korekcijaG: '',
        korekcijaZ: '',
        konacnoG: '',
        konacnoZ: '',
    };

    const [MPItem, updateMPItem] = useState(DefaultMPItem);
    const [MPList, setMPList] = useState([])
    const [hdrData, setHdrData] = useState(defaultHeader)
    const [hdrValidation, setHdrValidation] = useState({})

    useEffect(()=> {
        POSAxiosGet()
        .then(response=>setHdrData({...hdrData, ...response.data}))
        .catch(err=>console.log(err))
    },[]);

    //console.log(props.userData)
    return(
        <>
            <MPHeader
                hdrData={hdrData}
                onChange={newData => setHdrData({...hdrData, ...newData})}
                fieldValidations={hdrValidation}
            />
            <MPItemList
                MPItem={MPItem}
                updateMPItem={updateMPItem}
                onDodajCallBack={MPItem => setMPList(oldData => {console.log(MPItem); oldData.push(MPItem); return oldData})}
                token={token}
            />
        </>
    )
};

const mapStateToProps = (fromRedux) => {
    return {userData: fromRedux.userData}
};

export default connect(mapStateToProps)(MP);