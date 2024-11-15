import { createContext, useReducer } from 'react';

export const CustomizationContext = createContext();

const initialState = {
    product: null,
    loading: true,
    error: null,
    products: [],
    customizations: {
        additions: [],
        sauces: [],
        drinks: [],
        accompaniments: []
    },
    selections: {
        additions: [],
        sauces: [],
        drinks: [],
        accompaniments: []
    },
    quantity: 1,
    snackbarOpen: false,
    isEditing: false
};

function customizationReducer(state, action) {
    switch (action.type) {
        case 'RESET_STATE':
            return {
                ...initialState,
                loading: true
            };
        case 'SET_LOADING':
            return {
                ...state,
                loading: action.payload
            };
        case 'SET_INITIAL_DATA':
            return {
                ...state,
                product: action.payload.product,
                customizations: action.payload.customizations,
                products: action.payload.products,
                loading: false
            };
        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload,
                loading: false,
                product: null
            };
        case 'UPDATE_SELECTION':
            return {
                ...state,
                selections: {
                    ...state.selections,
                    [action.payload.type]: action.payload.value
                }
            };
        case 'UPDATE_QUANTITY':
            return {
                ...state,
                quantity: typeof action.payload === 'function'
                    ? action.payload(state.quantity)
                    : action.payload
            };
        case 'SET_NOTIFICATION':
            return {
                ...state,
                snackbarOpen: action.payload
            };
        default:
            return state;
    }
}

export function CustomizationProvider({ children }) {
    const [state, dispatch] = useReducer(customizationReducer, initialState);

    return (
        <CustomizationContext.Provider value={{ state, dispatch }}>
            {children}
        </CustomizationContext.Provider>
    );
}