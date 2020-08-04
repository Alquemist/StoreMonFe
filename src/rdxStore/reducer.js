const initialState = {
    userData: {
        token: "9c700a4d2745506f862ebae29c058250ebad2ded",
        ime: '',
        prezime: '',
        role: '',
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

        case 'SET_USER': {
            return {
                ...state,
                userData: {...args.userData},
            }
        };

        default: {
            return state;
        }
    }
};

export default reducer;