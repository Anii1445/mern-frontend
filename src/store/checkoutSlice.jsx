import {createSlice} from "@reduxjs/toolkit";

const checkoutSlice = createSlice({
    name: "checkout",
    initialState: {
        selectedAddress: null,
        orderInfo: null,
        deliverAddress: null,
        cartTotal: null,
        userName: null,
    },
    reducers:{
        setSelectedAddress: (state, action) => {
            state.selectedAddress = action.payload;
        },
        setOrderInfo: (state, action) => {
            state.orderInfo = action.payload;
        },
        setDeliverAddress:(state, action) => {
            state.deliverAddress = action.payload;
        },
        setCartTotal: (state, action) => {
            state.cartTotal = action.payload;
        },
        setUserName: (state, action) => {
            state.userName = action.payload;
        },
        clearCheckout: (state) => {
            state.selectedAddress = null;
            state.orderInfo = null;
            state.deliverAddress = null;
            state.cartTotal = null;
            state.userName = null;
            state.searchText = "";
        }
    }
});

export const { setSelectedAddress, setOrderInfo, setDeliverAddress,  setCartTotal, setUserName, clearCheckout } = checkoutSlice.actions;
export default checkoutSlice.reducer;