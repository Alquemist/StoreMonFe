import axios from 'axios';


export const newAxios = (token) => {
    return (
    axios.create({
        baseURL: 'http://localhost:8000/api',
        timeout: 2000,
        headers: {Authorization: 'Token ' + token}})
  )
};

export const loginAxios = (user, pass) => {
    return (
        axios({
            method: "post",
            url: "http://localhost:8000/gettoken/",
            data: {username: 'admin', password: 'Vrbanja_01'}
        })
    )
};

export const CreateAxiosMethods = (token) => {

    const myAxios = newAxios(token)

    const addAndLink = (attribs, item) => {
        return (
            myAxios({
                method: 'post',
                url: '/atributi/addAndLink/',
                data: {attribs: attribs, item: item}
            })
        )
    };
    
    const updateAttribs = (attribs) => {
        return (
            myAxios({
                method: 'patch',
                url: '/atributi/updateAttribs/',
                data: attribs
            })
        )
    };
    
    const updateItem = (item) => {
        console.log(item)
        return (
            myAxios({
                method: 'patch',
                url: `/inventar/${item.id}/`,
                data: item
            })
        )
    };

    const deleteItem = (itemId) => {
        return (
            myAxios({
                method: 'delete',
                url: `/inventar/deleteItem/`,
                data: itemId
            })
        )
    };

    const deleteAttribs = (atribIds) => {
        return (
            myAxios({
                method: 'delete',
                url: '/atributi/deleteAttribs/',
                data: atribIds
            })
        )        
    };

    return {
        addAndLink: addAndLink,
        updateAttribs: updateAttribs,
        updateItem: updateItem,
        deleteItem: deleteItem,
        deleteAttribs: deleteAttribs
    }
};


export const zaprimkaAxios = (token) => {
    const myAxios = newAxios(token)

    const getData = () => {
        return (
            myAxios({
                method: 'get',
                url: '/primka/getData/'
            })
        )
    };

    const postHeaderData = (headerData) => {
        return (
            myAxios({
                method: 'post',
                url: '/primka/zaprimanje/',
                data: headerData
            })
        )        
    };

    return {
        getData: getData,
        postHeaderData: postHeaderData,
    }
};

export const doesInvExists = (invBr, token) => {
    const myAxios = newAxios(token);
    return (
        myAxios({
            method: 'get',
            url: '/inventar/doesInvExists/',
            params: {
                invBr: invBr
              },
        })
    )
};

export const getLastInvBr = (token) => {
    const myAxios = newAxios(token);
    return(
        myAxios({
            url: 'inventar/getLastInv/'
        })
    )
};

export const saveSpecs = (token, data) => {
    const myAxios = newAxios(token)
    return(
        myAxios({
            method: 'post',
            url: 'specs/saveSpecs/',
            data: data, 
        })
    )
};

export const getSpecs = (token, itemId) =>{
    const myAxios = newAxios(token)
    return (
        myAxios({
            method: 'get',
            url: 'specs/getSpecs/',
            params: {
                itemId: itemId
              },
        })
    )
};

export const saveNalog = (token, itemId, nalog) => {
    const myAxios = newAxios(token)
    //console.log(itemId, nalog)
    return (
        myAxios({
            method: 'post',
            url: 'nalozi/saveNalog/',
            data: {'itemId': itemId, 'nalog': nalog}
        })
    )
};

export const getNalogList = (token, queryData) => {
    const myAxios = newAxios(token)
    return (
        myAxios({
            method: 'get',
            url: 'nalozi/getNalogList/',
            params: {
                queryData: queryData
              },
        })
    )
};

export const updateNalogStatus = (nalog, token) => {
    console.log(nalog)
    const myAxios = newAxios(token)
    return (
        myAxios({
            method: 'patch',
            url: '/nalozi/updateNalog/',
            data: nalog,
        })
    )
};

export const otpremnicaAxios = (token) => {

    const myAxios = newAxios(token)

    const getData = () => {
        return (
            myAxios({
                method: 'get',
                url: '/otpremnice/getData/'
            })
        )
    };

    const saveData = (hdrData, otpremnice) => {
        console.log({hdrData: hdrData, otpremnice: otpremnice})
        return (
            myAxios({
                method: 'post',
                url: '/otpremnice/saveData/',
                data: {hdrData: hdrData, otpremnice: otpremnice}
            })
        )        
    };

    const getOtpremnice = (searchParams) => {
        return (
            myAxios({
                method: 'get',
                url: '/otpremnice/searchData/',
                params: {
                    params: searchParams
                }
            })
        )
    };

    const getOtpremniceDetails = (id) => {
        //console.log(id)
        return(
            myAxios({
                method: 'get',
                url: '/otpremnice/getDetails/',
                params: {
                    id: id
                }
            })
        )
    };

    return {
        getData: getData,
        saveData: saveData,
        getOtpremnice: getOtpremnice,
        getOtpremniceDetails: getOtpremniceDetails
    }
};

// export const MPAxios = (token) => {
//     const myAxios = newAxios(token);

//     const getHeaderData = (kasaId) => {
//         console.log('get header data', kasaId)
//         return(
//             myAxios({
//                 method: 'get',
//                 url: '/MP/getHeaderData',
//                 params: {
//                     kasaId: kasaId
//                 }
//             })
//         )
//     };

//     const saveMPData = (hdrData, MPList) => {
//         return (
//             myAxios({
//                 method: 'post',
//                 url: '/MP/saveMPData',
//                 params: {
//                     hdrData: hdrData,
//                     MPList: MPList,
//                 }
//             })
//         )
//     };

//     return ({
//         getHeaderData: getHeaderData,
//         saveMPData: saveMPData
//     })
// };