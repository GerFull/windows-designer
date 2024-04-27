import { createSlice, createAsyncThunk, } from '@reduxjs/toolkit';


const FRAME_SIZE = 5;
const colorMain = '#efcf9f'


const heightCloset = 400

function id() {
   return Math.round(Math.random() * 10000);
}


const initialState = {
   leftRectangels: [
      { id: 20, width: 100, height: heightCloset - 60, x: 0, y: 30 },
   ],
   leftBackRectangles: [
      { id: 111, x: 100, y: 30, fill: '#efcf9f', radiusX: 100, radiusY: 30, type: 'line', colorType: 'main' },
      { id: 112, x: 100, y: 30, fill: 'black', opacity: 0.2, radiusX: 100, radiusY: 30, type: 'line', colorType: 'shadow' },
      { id: 113, x: 100, y: 34, fill: '#efcf9f', radiusX: 100, radiusY: 28, type: 'line', colorType: 'main' },


      { id: 114, x: 100, y: heightCloset - 30, fill: '#efcf9f', radiusX: 100, radiusY: 30, type: 'line', changeType: 'down', colorType: 'main' },
      { id: 115, x: 100, y: heightCloset - 30, fill: 'black', opacity: 0.2, radiusX: 100, radiusY: 30, type: 'line', changeType: 'down', colorType: 'shadow' },
      { id: 116, x: 100, y: heightCloset - 34, fill: '#efcf9f', radiusX: 100, radiusY: 28, type: 'line', changeType: 'down', colorType: 'main' },

      { id: 117, x: 0, y: 30, width: 100, height: heightCloset - 60, fill: '#efcf9f', colorType: 'main' },
   ],
   horizontalLeftFrames: [],
   colorMain: '#efcf9f',
   TextureMain: null,
   LeftWallVisible:false
}


const leftRectangelsSlice = createSlice({
   name: 'leftRectangels',
   initialState,
   reducers: {
      createHorizontalLeft(state, action) {

         const { xk, yk, idd } = action.payload

         const idFrame = id()
         const idShadowFrame = id()

         const itemSelect = state.leftRectangels.filter(item => ((xk > item.x && xk < (item.x + item.width)) &&
            (yk > item.y && yk < (item.y + item.height))))[0]

         const newFrame = {
            id: idFrame,

            width: itemSelect.width,
            height: FRAME_SIZE,
            color: state.colorMain,
            texture: state.TextureMain,
            x: itemSelect?.x, y: yk,
            type: 'frame',
            draggable: true,
            derection: 2
         }

         const shadowFrame = {
            id: idShadowFrame,
            idFrame: idFrame,
            width: itemSelect.width,
            type: 'shadowframe',
            height: FRAME_SIZE,
            color: 'black', opacity: 0.2,
            x: itemSelect?.x,
            y: yk, draggable: true,
            derection: 2,
            frameID: idFrame
         }


         const newsect = [...state.leftRectangels.filter(item => item.id !== itemSelect?.id).filter(item => item?.id !== idd),
         { id: id(), width: itemSelect.width, height: yk - itemSelect?.y, x: itemSelect?.x, y: itemSelect?.y },
            newFrame,
            shadowFrame,
         { id: id(), width: itemSelect.width, height: itemSelect?.height - (yk - itemSelect?.y) - FRAME_SIZE, x: itemSelect?.x, y: yk + FRAME_SIZE }]


         state.horizontalLeftFrames = [...state.horizontalLeftFrames,
         { id: idFrame, width: itemSelect.width, shadowFrameId: idShadowFrame, height: FRAME_SIZE, color: state.colorMain, x: itemSelect?.x, y: yk, type: 'frame', draggable: true, derection: 2 }]


         state.leftRectangels = newsect
      },
      DragStarHorizontalLeft(state, action) {

         const { itemSelect } = action.payload

         state.horizontalLeftFrames = state.horizontalLeftFrames.filter(item => item.id !== itemSelect.frameID)
         // прямоугольник внизу
         const itemDown = state.leftRectangels.filter(item => (
            (itemSelect.x + 2 > item.x && itemSelect.x + 2 < (item.x + item.width)) &&
            (itemSelect.y + 2 + FRAME_SIZE > item.y && itemSelect.y + FRAME_SIZE + 2 < (item.y + item.height)) && item?.type !== 'frame'
         )
         )[0]

         // прямоугольнику вверху
         const itemsUp = state.leftRectangels.filter(item => (item.x >= itemSelect.x) && ((item.x + item.width) <= (itemSelect.x + itemSelect.width)) &&
            ((item.y + item.height) === itemSelect.y) &&

            item?.type !== 'frame'
         )

         state.leftRectangels = state.leftRectangels.map(item => {
            if (item.id === itemSelect.id) {
               return { ...item, width: 0, height: 0, }
            } else if (item.id === itemSelect.frameID) {
               return { ...item, width: 0, height: 0, }
            }
            else if (itemsUp.includes(item)) {
               return { ...item, height: item.height + FRAME_SIZE + itemDown.height }
            } else {
               return item
            }
         }).filter(item => item.id !== itemDown.id)

      },
      deleteItemLeft(state, action) {

         const { id } = action.payload

         state.leftRectangels = state.leftRectangels.filter(item => item?.id !== id)
      },
      changeSizeHeightLeft(state, action) {


         const { heightCloset, heightClosetChange, maxHeight, minHeight, lastFrame } = action.payload



         if (heightClosetChange > maxHeight) {
            state.leftRectangels = state.leftRectangels.map(item => {
               return { ...item, height: item.height + (maxHeight / 5 - heightCloset) }
            })
            state.leftBackRectangles = state.leftBackRectangles.map(item => {
               if (item.changeType === 'down') {
                  return { ...item, y: item.y + (maxHeight / 5 - heightCloset) }
               } else if (item.type !== 'line') {
                  return { ...item, height: item.height + (maxHeight / 5 - heightCloset) }
               } else {
                  return item
               }
            })
         } else if (heightClosetChange < minHeight) {
            if (heightClosetChange / 5 < lastFrame + 50) {

               state.leftRectangels = state.leftRectangels.map(item => {
                  return { ...item, height: item.height + ((lastFrame + 50) - heightCloset) }
               })

               state.leftBackRectangles = state.leftBackRectangles.map(item => {
                  if (item.changeType === 'down') {
                     return { ...item, y: item.y + ((lastFrame + 50) - heightCloset) }
                  } else if (item.type !== 'line') {
                     return { ...item, height: item.height + ((lastFrame + 50) - heightCloset) }
                  } else {
                     return item
                  }
               })
            } else {

               state.leftRectangels = state.leftRectangels.map(item => {
                  if (item.type !== 'frame') {
                     return { ...item, height: item.height + (minHeight / 5 - heightCloset) }
                  } else {
                  }
               })

               state.leftBackRectangles = state.leftBackRectangles.map(item => {
                  if (item.changeType === 'down') {
                     return { ...item, y: item.y + (minHeight / 5 - heightCloset) }
                  } else if (item.type !== 'line') {
                     return { ...item, height: item.height + (minHeight / 5 - heightCloset) }
                  } else {
                     return item
                  }
               })
            }

         } else {
            if (heightClosetChange / 5 < lastFrame + 50) {

               state.leftRectangels = state.leftRectangels.map(item => {
                  return { ...item, height: item.height + ((lastFrame + 50) - heightCloset) }
               })

               state.leftBackRectangles = state.leftBackRectangles.map(item => {
                  if (item.changeType === 'down') {
                     return { ...item, y: item.y + ((lastFrame + 50) - heightCloset) }
                  } else if (item.type !== 'line') {
                     return { ...item, height: item.height + ((lastFrame + 50) - heightCloset) }
                  } else {
                     return item
                  }
               })

            } else {

               state.leftRectangels = state.leftRectangels.map(item => {
                  if (item?.type !== 'frame') {
                     return { ...item, height: item.height + (heightClosetChange / 5 - heightCloset) }
                  } else return item
               })

               state.leftBackRectangles = state.leftBackRectangles.map(item => {
                  if (item.changeType === 'down') {
                     return { ...item, y: item.y + (heightClosetChange / 5 - heightCloset) }
                  } else if (item.type !== 'line') {
                     return { ...item, height: item.height + (heightClosetChange / 5 - heightCloset) }
                  } else {
                     return item
                  }
               })
            }
         }
      },
      changeSizeLeftWall(state, action) {

         const { changeValue } = action.payload

         state.leftRectangels = state.leftRectangels.map(item => {
            return { ...item, width: item.width + changeValue }
         })


         state.leftBackRectangles = state.leftBackRectangles.map(item => {
            if (item.type === 'line') {
               return { ...item, x: item.x + changeValue, radiusX: item.radiusX + changeValue }
            } else if (item.type !== 'line') {
               return { ...item, width: item.width + changeValue }
            } else {
               return item
            }
         })

      },
      changeColorLeft(state, action) {

         const { mainColor } = action.payload

         state.leftBackRectangles = state.leftBackRectangles.map(item => {
            if (item.colorType === 'main') {
               item.fill = mainColor
               item.texture = null
               return item
            } else return item
         })

         state.leftRectangels = state.leftRectangels.map(item => {
            if (item?.type === 'frame') {
               item.color = mainColor
               item.texture = null
               return item
            } else return item
         })
         state.colorMain = mainColor
      },
      changeTextureLeft(state, action) {

         const { value } = action.payload

         let mainTexture = null

         if (value !== '0') {
            mainTexture = `http://127.0.0.1:8000/${value}`
         } else {
            mainTexture = null
         }

         state.leftBackRectangles = state.leftBackRectangles.map(item => {
            if (item.colorType === 'main') {
               item.texture = mainTexture
               return item
            } else return item
         })


         state.leftRectangels = state.leftRectangels.map(item => {
            if (item?.type === 'frame') {
               item.texture = mainTexture
               return item
            } else return item
         })

         state.TextureMain = mainTexture
      },
      leftVisibleWall(state, action) {

         const { widthLeftWall, heightCloset,value } = action.payload

         // console.log(value)
         state.LeftWallVisible=value

         state.leftRectangels = [{ id: 20, width: widthLeftWall, height: heightCloset - 60, x: 0, y: 30 }]
         state.horizontalLeftFrames = []
      },
      changeHorizontalLeftFrames(state, action) {

         const { value, valueInput, itemSelect, heightShow } = action.payload


         const itemsDown = state.leftRectangels.filter(item => (
            (item.x >= itemSelect.x && ((item.x + item.width) <= (itemSelect.x + itemSelect.width))) &&
            (item.y === (itemSelect.y + itemSelect.height))
         )
         )

         const itemsUp = state.leftRectangels.filter(item => (
            (item.x >= itemSelect.x && ((item.x + item.width) <= (itemSelect.x + itemSelect.width))) &&
            ((item.y + item.height) === itemSelect.y)
         )
         )


         if (heightShow !== undefined) {
            state.leftRectangels = state.leftRectangels.map(item => {
               if (item.id === itemSelect.id) {
                  return { ...item, y: item.y + (((valueInput - 150) / 5) - value) }
               }
               else if (itemsUp.includes(item)) {
                  return { ...item, height: item.height + (((valueInput - 150) / 5) - value), }
               }
               else if (itemsDown.includes(item)) {
                  return { ...item, y: item.y + (((valueInput - 150) / 5) - value), height: item.height - (((valueInput - 150) / 5) - value), }
               }
               else {
                  return item
               }
            })

            state.horizontalLeftFrames = state.horizontalLeftFrames.map(item => {
               if (item.id === itemSelect.id) {
                  return { ...item, y: item.y + (((valueInput - 150) / 5) - value) }
               }
               else {
                  return item
               }
            })

         } else {
            state.leftRectangels = state.leftRectangels.map(item => {
               if (item.id === itemSelect.id) {
                  return { ...item, y: item.y + (((valueInput) / 5) - value) }
               }
               else if (itemsUp.includes(item)) {
                  return { ...item, height: item.height + (((valueInput) / 5) - value), }
               }
               else if (itemsDown.includes(item)) {
                  return { ...item, y: item.y + (((valueInput) / 5) - value), height: item.height - (((valueInput) / 5) - value), }
               }
               else {
                  return item
               }
            })

            state.horizontalLeftFrames = state.horizontalLeftFrames.map(item => {
               if (item.id === itemSelect.id) {
                  return { ...item, y: item.y + (((valueInput) / 5) - value) }
               }
               else {
                  return item
               }
            })

         }
      }
   },

});



export default leftRectangelsSlice.reducer;
export const {
   createHorizontalLeft, DragStarHorizontalLeft,
   deleteItemLeft, changeSizeHeightLeft,
   changeSizeLeftWall, changeColorLeft,
   changeTextureLeft, leftVisibleWall,
   changeHorizontalLeftFrames

} = leftRectangelsSlice.actions;


