import { createSlice } from "@reduxjs/toolkit";
import mongoose from "mongoose";

interface IGrocery{
    _id?:mongoose.Types.ObjectId,
    name : string,
    category : string,
    price : string,
    unit : string,
    quantity : number
    image : string,
    createdAt?:Date,
    updatedAt?:Date
}

interface ICartSlicer {
    cartData : IGrocery[] ,
    subTotal : number
    deliveryFee : number,
    total : number
} 

const initialState : ICartSlicer = {
    cartData : [],
    subTotal : 0,
    deliveryFee : 40,
    total : 40
}

const cartSlice = createSlice({
    name : 'cart',
    initialState,
    reducers:{
        addToCart :(state,action) => {
            state.cartData.push(action.payload)
            cartSlice.caseReducers.calculateTotal(state)
        },
        increaseQuantity : (state,action) => {
            const item = state.cartData.find(i=>i._id==action.payload)
            if(item){
                item.quantity = item.quantity + 1
            }  
            cartSlice.caseReducers.calculateTotal(state)  
        },
        decreaseQuantity : (state,action) => {
            const item = state.cartData.find(i=>i._id==action.payload)
            if(item?.quantity && item.quantity > 1){
                item.quantity = item.quantity - 1
            }else{
                state.cartData = state.cartData.filter(i=>i._id!==action.payload)
            }
            cartSlice.caseReducers.calculateTotal(state)
        },
        removeFromCart : (state,action) => {
            state.cartData = state.cartData.filter(i=>i._id!==action.payload)
            cartSlice.caseReducers.calculateTotal(state)
        },
        calculateTotal : (state) => {
            state.subTotal = state.cartData.reduce((sum,item)=>sum + Number(item.price)*item.quantity,0)
            state.deliveryFee = state.subTotal > 100 ? 0 : 40
            state.total = state.subTotal + state.deliveryFee
        }
    }
})


export const {addToCart,increaseQuantity,decreaseQuantity,removeFromCart} = cartSlice.actions
export default cartSlice.reducer 