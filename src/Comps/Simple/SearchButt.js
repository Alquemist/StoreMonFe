import React, {useState} from 'react';
import {newAxios} from '../../Misc/MyAxios'
import {AsyncTypeahead} from 'react-bootstrap-typeahead';
import {withRouter} from 'react-router-dom'

const SearchButt = (props) => {

    const [state, setState] = useState({
        isLoading: false,
        options: [],
    });

    const myAxios = newAxios(props.token)

    const onSearchHandler = (param) => {
        setState({isLoading: true, options: []});
        myAxios({
            url: '/inventar/searchItem/',
            params: {
                naziv: param
              },
        })
        .then((response) => {
            setState({isLoading:false, options: response.data})
          })
          .catch(function (error) {
            console.log(error);
          })
    };

    const onSelectHandler = (selection) => {
        console.log(selection)
        let item = {};

        if (selection && selection.customOption) {
            myAxios({
                url: 'inventar/getLastInv/'
            }).then(response => {
                item = {
                    naziv: selection.naziv,
                    new: true, 
                    invBr: response.data+1, 
                    tip: 'proizvod',
                    kolicina: 0, 
                    JMUlaz: '', 
                    JMIzlaz: '', 
                    JMOdnos: 1,
                };
                console.log(item)
                props.itemToStore(item)
                props.attribsToStore([])
            })
            return
        };

        if (selection && !selection.customOption) {
            item = {
                ...selection
            };
        
            myAxios({
                url: '/atributi/getattribs/',
                params: {
                    itemID: item.id
                }
            })
            .then((response) => {
                //console.log(response.data)
                props.itemToStore(item)
                props.attribsToStore(response.data)
            })
            .catch(function (error) {
                console.log(error);
            })
        };
    };


    const renderMeny = (option) => (
        <div>
          {option.naziv}
          <div>
            <small>invBr: {option.invBr}</small>
          </div>
        </div>
      )

    return (
        <AsyncTypeahead
            newSelectionPrefix="Dodaj u inventar: "
            placeholder='Pretrazi'
            allowNew
            filterBy={['naziv', 'invBr']}
            labelKey='naziv'
            renderMenuItemChildren={renderMeny}
            minLength={1}
            useCache={false}
            isLoading={state.isLoading}
            onSearch={onSearchHandler}
            options={state.options}
            onChange={(selected) => onSelectHandler(selected[0])}
        />
    )
};

export default withRouter(SearchButt);