import { createSlice } from '@reduxjs/toolkit';

const getCartStorageKey = () => {
  const userInfo = localStorage.getItem('userInfo');

  if (!userInfo) {
    return 'cartItems:guest';
  }

  try {
    const user = JSON.parse(userInfo);
    return `cartItems:${user._id || user.email || 'guest'}`;
  } catch (error) {
    return 'cartItems:guest';
  }
};

const getStoredCart = () => {
  const cartItems = localStorage.getItem(getCartStorageKey());
  return cartItems ? JSON.parse(cartItems) : [];
};

const saveCart = (cartItems) => {
  localStorage.setItem(getCartStorageKey(), JSON.stringify(cartItems));
};

const clearStoredCart = () => {
  localStorage.removeItem(getCartStorageKey());
};

const initialState = {
  cartItems: getStoredCart(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x.productId === item.productId);
      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x.productId === existItem.productId ? item : x
        );
      } else {
        state.cartItems.push(item);
      }
      saveCart(state.cartItems);
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x.productId !== action.payload);
      saveCart(state.cartItems);
    },
    clearCart: (state) => {
      state.cartItems = [];
      clearStoredCart();
    },
    loadCart: (state) => {
      state.cartItems = getStoredCart();
    }
  },
});

export const { addToCart, removeFromCart, clearCart, loadCart } = cartSlice.actions;
export default cartSlice.reducer;
