import React from 'react';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
//import {globals} from './settings'


const callbackFn = (onClickPost) => {axios.post("http://localhost:8000/gettoken/",
    {
        username: 'user',
        password: 'lozinka1'
    }
)
.then(function (response) {
  // handle success
  console.log('hello token:', response.data.token);
  onClickPost(response.data.token)
})
.catch(function (error) {
  // handle error
  console.log(error);
})};

const postmanButton = (props) => (
    <Button variant="primary" onClick={() => callbackFn(props.onClickPost)}>Get token</Button>
);

export default postmanButton