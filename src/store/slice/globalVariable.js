import { createSlice, createAsyncThunk, } from '@reduxjs/toolkit';



const initialState = {
   minHeight: 0,
   maxHeight: 0,
   maxWidth: 0,
   minWidth: 0,
   maxDepth: 0,
   minDepth: 0,
   coeficentMarkUo:0,
   coeficentWaste:0,

   priceBox:0,
   priceHanger:0,
   priceBarbel:0,
   priceMechanismDoor:0,



   widthCloset: 600,
   heightCloset: 400,
   depthCloset:120,
   widthLeftWall:100,
   widthRightWall:100,

   admin: false
}


export const limitsVariable = createAsyncThunk(
   'GlobalVariable/limits',
   async function (_, { rejectWithValue }) {
      const response = await fetch(`http://127.0.0.1:8000/api/Limits/1`);

      if (!response.ok) {
         return rejectWithValue('Server Error!');
      }
      const data = await response.json();

      return data;
   }
);


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

      changeMaxDepth(state, action) {
         state.maxDepth = Number(action.payload)
      },
      changeMinDepth(state, action) {
         state.minDepth = Number(action.payload)
      },

      changeCoeficentMarkUo(state, action) {
         state.coeficentMarkUo = Number(action.payload)
      },
      changeCoeficentWaste(state, action) {
         state.coeficentWaste = Number(action.payload)
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

      changePriceBox(state, action) {
         state.priceBox = Number(action.payload)
      },
      changePriceHanger(state, action) {
         state.priceHanger = Number(action.payload)
      },
      changePriceBarbel(state, action) {
         state.priceBarbel = Number(action.payload)
      },
      changePriceMechanismDoor(state, action) {
         state.priceMechanismDoor = Number(action.payload)
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
   extraReducers: (builder) => {
      builder
         .addCase(limitsVariable.pending, (state) => {

         })
         .addCase(limitsVariable.fulfilled, (state, action) => {
            state.minHeight=action.payload.minHeight
            state.maxHeight=action.payload.maxHeight
            state.maxWidth=action.payload.maxWidth
            state.minWidth=action.payload.minWidth
            state.maxDepth=action.payload.maxDepth
            state.minDepth=action.payload.minDepth
            state.coeficentMarkUo=action.payload.coeficentMarkUo
            state.coeficentWaste=action.payload.coeficentWaste

            state.priceBarbel=action.payload.priceBarbel
            state.priceBox=action.payload.priceBox
            state.priceHanger=action.payload.priceHanger
            state.priceMechanismDoor=action.payload.priceMechanismDoor
         })
         .addMatcher((state, action) => {

         });
   }
});



export default globalVariableSlice.reducer;
export const {
   changeMinHeight, changeMaxHeight,
   changeMaxWidth, changeMinWidth,
   changeAdmin, changeWidth,
   changeHeight,replaceWidthRight,
   replaceWidthLeft,changeDepth,changeMaxDepth,
   changeMinDepth,changeCoeficentMarkUo,changeCoeficentWaste,
   changePriceBox,changePriceHanger,changePriceBarbel,changePriceMechanismDoor
} = globalVariableSlice.actions;


