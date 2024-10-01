export const cartInitialState = JSON.parse(localStorage.getItem('cart')) || []

export const CART_ACTION_TYPES = {
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  UPDATE_CART_ITEM: 'UPDATE_CART_ITEM',
  CLEAR_CART: 'CLEAR_CART'
}

const UPDATE_STATE_BY_ACTION = {
  [CART_ACTION_TYPES.ADD_TO_CART]: (state, action) => {
    const { id, customizations } = action.payload;
    const productInCartIndex = state.findIndex(item => item.id === id && JSON.stringify(item.customizations) === JSON.stringify(customizations));

    if (productInCartIndex >= 0) {
      return state.map((item, index) => 
        index === productInCartIndex ? { ...item, quantity: item.quantity + 1 } : item
      );
    }

    return [...state, { ...action.payload, quantity: 1 }];
  },
  [CART_ACTION_TYPES.REMOVE_FROM_CART]: (state, action) => {
    return state.filter(item => item.id !== action.payload.id || JSON.stringify(item.customizations) !== JSON.stringify(action.payload.customizations));
  },
  [CART_ACTION_TYPES.UPDATE_CART_ITEM]: (state, action) => {
    const { productId, updates } = action.payload;
    return state.map(item => 
      item.id === productId ? { ...item, ...updates } : item
    );
  },
  [CART_ACTION_TYPES.CLEAR_CART]: () => []
};

export const cartReducer = (state, action) => {
  const { type: actionType } = action;
  const updateState = UPDATE_STATE_BY_ACTION[actionType];
  return updateState ? updateState(state, action) : state;
};