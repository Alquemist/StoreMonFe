const srvUrl = 'http://localhost:8000/api'
const hdr = (token) => { return (
    {
        headers: new Headers({'Authorization': `Token ${token}`})
    })
};
//'Content-Type': 'application/x-www-form-urlencoded'

    
export const zaprimkaFetch = (apiUrl, token) => {
    return (
        fetch(srvUrl+apiUrl,
            hdr(token)
            // {headers: new Headers({
            //     'Authorization': `Token ${token}`,
            //     //'Content-Type': 'application/x-www-form-urlencoded'
            // })}
            )
        .then(response => {
            console.log(response)
            return response.json()
        })
    )
};

export const preFetch = (token) => {
    return(
        fetch(`${srvUrl}/preFetch/preFetchAll`, hdr(token)).then(response => {return response.json()})
    )
};

// export const fetchGetter (token) => {

// };