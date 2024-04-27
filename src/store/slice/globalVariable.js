import { createSlice, createAsyncThunk, } from '@reduxjs/toolkit';



const initialState = {
   minHeight: 1000,
   maxHeight: 3000,
   maxWidth: 5000,
   minWidth: 2000,
   widthCloset: 600,
   heightCloset: 400,
   depthCloset:120,
   widthLeftWall:100,
   widthRightWall:100,
   admin: false
}


const globalVariableSlice = createSlice({
   name: 'globalVariable',
   initialState,
   reducers: {
      changeMinHeight(state, action) {
         state.minHeight = Number(action.payload)
      },
      changeMaxHeight(state, action) {
         state.maxHeight = Number(action.payload)
      },
      changeMaxWidth(state, action) {
         state.maxWidth = Number(action.payload)
      },
      changeMinWidth(state, action) {
         state.minWidth = Number(action.payload)
      },

      changeWidth(state, action) {
         state.widthCloset = Number(action.payload)
      },
      changeHeight(state, action) {
         state.heightCloset = Number(action.payload)
      },
      changeDepth(state, action) {
         state.depthCloset = Number(action.payload)
      },


      replaceWidthRight(state, action) {
         state.widthRightWall = Number(action.payload)
      },
      replaceWidthLeft(state, action) {
         state.widthLeftWall = Number(action.payload)
      },
      changeAdmin(state, action) {
         state.admin = action.payload
      },
   },

});



export default globalVariableSlice.reducer;
export const {
   changeMinHeight, changeMaxHeight,
   changeMaxWidth, changeMinWidth,
   changeAdmin, changeWidth,
   changeHeight,replaceWidthRight,
   replaceWidthLeft,changeDepth
} = globalVariableSlice.actions;


