import React from'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

const TestLayout = () => {

    const childElem = (
        <Row className='no-gutters'>
            <Col xs='3' style={{backgroundColor: 'red'}}>
                col 1
            </Col>
            <Col style={{backgroundColor: 'blue'}}>
                col 2
            </Col>
        </Row>
    );

    return (
        <Row className='no-gutters'>
            <Col style={{paddingRight:'10px'}}>
                {childElem}
            </Col>
            <Col >
                {childElem}
            </Col>
        </Row>
    )
};





export default TestLayout;