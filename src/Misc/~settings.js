import axios from 'axios';

export const globals = {
    srv_url: 'http://localhost:8000/',

};


export const newAxios = (token) => {
    return (
        axios.create({
    baseURL: 'http://localhost:8000/api/',
    timeout: 1000,
    headers: {Authorization: 'Token ' + token}})
  )
};
