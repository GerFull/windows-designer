import { configureStore } from "@reduxjs/toolkit";
import globalVariableSlice from './slice/globalVariable'
import mainRectanglesSlice from "./slice/mainRectangles";
import leftRectangelsSlice from "./slice/leftRectangles";
import rightRectangelsSlice from "./slice/rightRectangles";
import doorSlice from "./slice/doorSlice";



const store = configureStore({
   reducer: {
      globalVariable: globalVariableSlice,
      mainRectangles:mainRectanglesSlice,
      leftRectangels:leftRectangelsSlice,
      rightRectangels:rightRectangelsSlice,
      doors:doorSlice
   },
})

export default store