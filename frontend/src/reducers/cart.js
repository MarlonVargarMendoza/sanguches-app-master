export const cartReducer = (state = { items: [], total: 0 }, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const items = Array.isArray(state.items) ? state.items : [];
      const existingItemIndex = items.findIndex(item => item.id === action.payload.id);
      if (existingItemIndex >= 0) {
        const newItems = items.map((item, index) => 
          index === existingItemIndex 
            ? { ...item, quantity: item.quantity + 1, calculatedPrice: item.calculatedPrice + (item.calculatedPrice / item.quantity) }
            : item
        );
        return { ...state, items: newItems };
      } else {
        return {
          ...state,
          items: [...items, { ...action.payload, quantity: 1, calculatedPrice: action.payload.calculatedPrice }]
        };
      }
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: Array.isArray(state.items) ? state.items.filter(item => item.id !== action.payload) : []
      };
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: Array.isArray(state.items) 
          ? state.items.map(item =>
              item.id === action.payload.id
                ? { ...item, ...action.payload.updates }
                : item
            )
          : []
      };
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        total: 0
      };
    case 'LOAD_CART':
      return {
        ...state,
        items: Array.isArray(action.payload.items) ? action.payload.items : [],
        total: action.payload.total || 0
      };
    case 'UPDATE_TOTAL':
      return {
        ...state,
        total: action.payload
      };
    default:
      return state;
  }
};