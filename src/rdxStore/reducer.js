const initialState = {
    userData: {
        token: '',
        ime: '',
        prezime: '',
        permissions: [],
        settings: {},
    },
    savedData: {
        item: {},
        attribs: []
    },
    savedState: false,
};

const reducer = (state = initialState, args) => {

    switch (args.type) {
        case 'SET_USERDATA': return {
            ...state,
            userData: {...state.userData, ...args.userData}
        };

        case 'CLEAR_USERDATA': return {
            ...state,
            userData: {...initialState.userData}
        };
        // case 'ITEM_SELECTION':{
        //     //console.log(state)
        //     const savedData = {
        //         item: args.item,
        //         attribs: args.attribs,
        //     }
        //     console.log(savedData)
        //     return {
        //     ...state,
        //     savedData: savedData
        // }}
        case 'ITEM_UPDATE': {
            console.log(args)
            const savedData = {
                ...state.savedData,
                item: {...args.item},
            }
            console.log(savedData)
            return {
                ...state,
                savedData: {...savedData},
            }
        };

        case 'ATTR_UPDATE': {
            //console.log(args)
            const savedData = {
                ...state.savedData,
                attribs: args.attribs}
            return {
                ...state,
                savedData: savedData
            }
        };

        default: {
            return state;
        }
    }
};

export default reducer;