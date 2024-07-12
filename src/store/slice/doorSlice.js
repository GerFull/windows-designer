import { configureStore, createSlice } from '@reduxjs/toolkit';



const FRAME_SIZE = 5;

function id() {
   return Math.round(Math.random() * 10000);
}




const initialState = {
   doors: [],
   doorRectangles: [],
   NumberOfDoors: 3,
   colorMain: 'white',
   verticalDoorsFrame: [],
   horizontalDoorsFrames: [],
   styleFrame: true,
   colorFrame: '#8d8d8d',
   nameColorFrame: 'Серый'
}

const DoorPageslice = createSlice({
   name: 'DoorPage',
   initialState,
   reducers: {
      createDoors(state, action) {
         const { countDoors, widthCloset, heightCloset, widthLeftWall } = action.payload

         const doorsArr = []
         const doorsReactanglesArr = []

         for (let i = 0; i < countDoors; i++) {

            doorsArr.push({
               id: id(),
               x: ((widthLeftWall + (state.styleFrame ? 2.5 : 1.25)) + (widthCloset / countDoors * i)),
               stroke: state.colorFrame
            })

         }

         for (let i = 0; i < countDoors; i++) {

            doorsReactanglesArr.push(
               {
                  id: id(),
                  x: ((widthLeftWall + (state.styleFrame ? 5 : 2.5)) + (widthCloset / countDoors * i)),
                  y: state.styleFrame ? 5 : 2.5,
                  width: (widthCloset / countDoors) - (state.styleFrame ? 10 : 5),
                  cost: 150,
                  height: heightCloset - (state.styleFrame ? 10 : 5),
                  color: state.colorMain,
                  opacity: 1,
                  numberDoor: i + 1
               }

            )

         }

         state.doors = doorsArr
         state.doorRectangles = doorsReactanglesArr
         state.NumberOfDoors = countDoors

      },
      changeColorStroke(state, action) {

         const { mainColor, name } = action.payload

         state.colorFrame = mainColor
         state.nameColorFrame = name

         state.doors.map(item => {

            item.stroke = mainColor
            return item
         })


      },
      changeColorRect(state, action) {

         const { color, id, cost } = action.payload

         if (color.includes('Images')) {
            state.doorRectangles.map(item => {

               if (item.id === id) {
                  item.texture = `http://127.0.0.1:8000/${color}`
                  item.color = null
                  item.cost = cost
                  item.opacity = 1
                  return item
               } else return item
            })

         } else if (color.includes('images')) {

            state.doorRectangles.map(item => {

               if (item.id === id) {
                  item.texture = color
                  item.color = null
                  item.cost = cost
                  item.opacity = 1
                  return item
               } else return item
            })
         } else {
            state.doorRectangles.map(item => {

               if (item.id === id) {
                  item.color = color
                  item.texture = null
                  item.opacity = 0.5
                  return item
               } else return item
            })

         }



      },
      changeThicknessFrame(state, action) {
         const { value } = action.payload

         state.styleFrame = value

      }
   },

});



export default DoorPageslice.reducer;
export const {
   createDoors,
   changeColorStroke, changeColorRect,
   changeThicknessFrame
} = DoorPageslice.actions;


