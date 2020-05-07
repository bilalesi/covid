import React, { useContext, createContext, useReducer } from 'react';

const GlobalStateDefault = {
    defaultContry: 'Algeria',
    countryRightCorner: {
        country: 'Algeria',
        iso2: 'dz'
    }
}

const GlobalStateContext = createContext();
const GlobalDispatchContext = createContext();

const GlobalReducer = (state, action) => {
    switch(action.type){
        case 'CHANGE_COUNTRY_RIGHT_CORNER':
            return{
                ...state,
                countryRightCorner: action.payload
            }
        default:
            throw new Error('unhandled action type: ', action.type)
    }
}

const GlobalProvider = ({children}) =>{
    const [state, dispatch] = useReducer(GlobalReducer, GlobalStateDefault);
    return(
        <GlobalStateContext.Provider value={state}>
            <GlobalDispatchContext.Provider value={dispatch}>
                { 
                    children
                }
            </GlobalDispatchContext.Provider>
        </GlobalStateContext.Provider>
    )
}

const useGlobalState = () => {
    const context = useContext(GlobalStateContext);
    if(context === undefined)
        throw new Error('useGlobalState must be used within a GlobalProvider')
    else
        return context;
}

const useGlobalDispatch = () => {
    const context = useContext(GlobalDispatchContext);
    if(context === undefined)
        throw new Error('useGlobalDisptach must be used within a GlobalProvider')
    else
        return context;
}

export{
    GlobalProvider,
    useGlobalState,
    useGlobalDispatch
}