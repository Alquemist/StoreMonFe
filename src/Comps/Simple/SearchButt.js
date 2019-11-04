import React, {Component} from 'react';
import {AsyncTypeahead} from 'react-bootstrap-typeahead';
import {withRouter} from 'react-router-dom'
import {newAxios} from '../../Misc/settings'


class SearchButt extends Component {

    token = this.props.token;
    myAxios = newAxios(this.token)

    state = {
        response: {},
        isLoading: false,
        options: [],
    };

    renderMeny = (option) => (
        <div>
          {option.naziv}
          <div>
            <small>invBr: {option.invBr}</small>
          </div>
        </div>
      )

    onSelectHandler = (selection) => {
        console.log(selection)
        let item = {};

        if (selection && selection.customOption) {
            this.myAxios({
                url: 'inventar/getLastInv/'
            }).then(response => {
                item = {
                    naziv: selection.naziv,
                    new: true, 
                    invBr: response.data+1, 
                    tip: 'proizvod',
                    pdvStopa: 17,
                    ziralMP: '',
                    gotovinaMP: '',
                    ziralVP: '',
                    gotovinaVP: '',
                    kolicina: 0, 
                    JMUlaz: '', 
                    JMIzlaz: '', 
                    JMOdnos: 1,
                };
                console.log(item)
                this.props.itemToStore(item)
                this.props.attribsToStore([])
            })
            return
        };

        if (selection && !selection.customOption) {
            
            item = {
                ...selection
            };
        
            this.myAxios({
                url: '/atributi/getattribs',
                params: {
                    itemID: item.id
                }
            })
            .then((response) => {
                //console.log(response.data)
                this.props.itemToStore(item)
                this.props.attribsToStore(response.data)
            })
            .catch(function (error) {
                console.log(error);
            })
        };
    };
    
    onSearchHandler = (param) => {
        
        this.setState({isLoading: true});
        this.myAxios({
            url: '/inventar/searchItem',
            params: {
                naziv: param
              },
        })
        .then((response) => {
            //console.log(response.data)
            //const items = Object.keys(response.data)
            //const options = items.filter(item => response.data[item].id)
            //this.setState({isLoading: false, response: response.data, options: options})
            this.setState({isLoading:false, options: response.data})
          })
          .catch(function (error) {
            console.log(error);
          })
    };
    render () {
        return (
        <AsyncTypeahead
            newSelectionPrefix="Dodaj u inventar: "
            placeholder='Pretrazi'
            allowNew
            filterBy={['naziv', 'invBr']}
            labelKey='naziv'
            renderMenuItemChildren={this.renderMeny}
            minLength={1}
            useCache={false}
            isLoading={this.state.isLoading}
            onSearch={this.onSearchHandler}
            options={this.state.options}
            onChange={(selected) => this.onSelectHandler(selected[0])}
        />)
    };
};

export default withRouter(SearchButt);