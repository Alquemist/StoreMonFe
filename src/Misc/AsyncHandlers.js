
export const itemSearcHandler = (myAxios, param, setOptions, setIsLoading) => {
    //console.log(myAxios)
    setIsLoading(true)
    
    myAxios({
        url: '/inventar/searchItem/',
        params: {
            naziv: param
        },
    })
    .then((response) => {
        setIsLoading(false)
        setOptions(response.data)
    })
    .catch(error => console.log(error))
};


export const itemTransformData = (selection) => {
    //console.log(selection)
    if (selection && selection.customOption) {
        return {
            naziv: selection.naziv,
            new: true,
            tip: 'proizvod',
            kolicina: 0, 
            JMUlaz: '', 
            JMIzlaz: '', 
            JMOdnos: 1,
        }
    } 
    if (selection && !selection.customOption) {
        return {...selection, invBr: parseInt(selection.invBr)};
    }
    return {}
};