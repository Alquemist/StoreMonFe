import React from 'react';
import Button from 'react-bootstrap/Button';

const testButton = (props) => (
    <Button variant="primary" onClick={() => console.log(props.txt)}>Print State</Button>
);

export default testButton;