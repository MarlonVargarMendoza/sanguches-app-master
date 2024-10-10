export const initialState = { items: [], total: 0 };

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { id, customizations = {} } = action.payload;
      const existingItemIndex = state.items.findIndex(item => 
        item.id === id && JSON.stringify(item.customizations) === JSON.stringify(customizations)
      );
      
      if (existingItemIndex >= 0) {
        const newItems = state.items.map((item, index) => 
          index === existingItemIndex 
            ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) }
            : item
        );
        return { ...state, items: newItems };
      } else {
        return {
          ...state,
          items: [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }]
        };
      }
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, ...action.payload.updates }
            : item
        )
      };
    case 'CLEAR_CART':
      return initialState;
    default:
      return state;
  }
};