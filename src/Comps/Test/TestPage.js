import React, {Component} from 'react';

import PostButton from '../Simple/PostmanButton'

class ChildComp extends Component {
    

    state = {
        tekst: this.props.tekst
    }

    prva() {
        console.log('ojsaaa', this.state)
    }

    render() {
        console.log(this.state.tekst, this.props.tekst)
        return(
            <h1>{this.state.tekst}</h1>
        )
    }
}

class Test extends Component {

    state = {
        inputed: 'txt',
    }

    handleChange = (event) => {
        this.setState({inputed: event.target.value})
        console.log(this.state)
    }

    render() {
        //console.log(this.state)
        return(
            <>
                <h1>OK</h1>
                <input value={this.state.inputed} onChange={this.handleChange}/>
                <ChildComp tekst={this.state.inputed}/>
                <PostButton/>
            </>
        )
    }
};

export default Test;