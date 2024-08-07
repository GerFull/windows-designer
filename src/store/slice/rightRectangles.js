import { createSlice, createAsyncThunk, } from '@reduxjs/toolkit';



const FRAME_SIZE = 5;

const widthCloset = 600
const heightCloset = 400

function id() {
   return Math.round(Math.random() * 10000);
}


const initialState = {
   RightRectangels: [
      { id: 40, width: 100, height: heightCloset - 60, x: 100 + widthCloset, y: 30 },
   ],

   rightBackRectangles: [
      { id: 211, x: widthCloset + 100, y: 30, fill: '#efcf9f', radiusX: 100, radiusY: 30, type: 'line', colorType: 'main' },
      { id: 212, x: widthCloset + 100, y: 30, fill: 'black', opacity: 0.2, radiusX: 100, radiusY: 30, type: 'line', colorType: 'main' },
      { id: 213, x: widthCloset + 100, y: 34, fill: '#efcf9f', radiusX: 100, radiusY: 28, type: 'line', colorType: 'main' },


      { id: 214, x: widthCloset + 100, y: heightCloset - 30, fill: '#efcf9f', radiusX: 100, radiusY: 30, type: 'line', changeType: 'down', colorType: 'main' },
      { id: 215, x: widthCloset + 100, y: heightCloset - 30, fill: 'black', opacity: 0.2, radiusX: 100, radiusY: 30, type: 'line', changeType: 'down', colorType: 'main' },
      { id: 216, x: widthCloset + 100, y: heightCloset - 34, fill: '#efcf9f', radiusX: 100, radiusY: 28, type: 'line', changeType: 'down', colorType: 'main' },


      { id: 217, x: widthCloset + 100, y: 30, width: 100, height: heightCloset - 60, fill: '#efcf9f', colorType: 'main' },
   ],
   horizontalRightFrames: [],
   colorMain: '#efcf9f',
   TextureMain: null,
   RightWallVisible:true
}


const rightRectangelsSlice = createSlice({
   name: 'rightRectangels',
   initialState,
   reducers: {
      createHorizontalRight(state, action) {

         const { xk, yk, idd } = action.payload

         const idFrame = id()
         const idShadowFrame = id()



         const itemSelect = state.RightRectangels.filter(item => ((xk > item.x && xk < (item.x + item.width)) &&
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
         const newsect = [...state.RightRectangels.filter(item => item.id !== itemSelect?.id).filter(item => item?.id !== idd),
         { id: id(), width: itemSelect.width, height: yk - itemSelect?.y, x: itemSelect?.x, y: itemSelect?.y },
            newFrame,
            shadowFrame,
         { id: id(), width: itemSelect.width, height: itemSelect?.height - (yk - itemSelect?.y) - FRAME_SIZE, x: itemSelect?.x, y: yk + FRAME_SIZE }]


         state.horizontalRightFrames = [...state.horizontalRightFrames,
         { id: idFrame, shadowFrameId: idShadowFrame, width: itemSelect.width, height: FRAME_SIZE, color: state.colorMain, x: itemSelect?.x, y: yk, type: 'frame', draggable: true, derection: 2 }]


         state.RightRectangels = newsect
      },
      DragStarHorizontalRight(state, action) {

         const { itemSelect } = action.payload

         // переделать поиск не из всех прямугольников, а только этой области

         state.horizontalRightFrames = state.horizontalRightFrames.filter(item => item.id !== itemSelect.frameID)

         // прямоугольник внизу
         const itemDown = state.RightRectangels.filter(item => (
            (itemSelect.x + 2 > item.x && itemSelect.x + 2 < (item.x + item.width)) &&
            (itemSelect.y + 2 + FRAME_SIZE > item.y && itemSelect.y + FRAME_SIZE + 2 < (item.y + item.height)) && item?.type !== 'frame'
         )
         )[0]

         // прямоугольнику вверху
         const itemsUp = state.RightRectangels.filter(item => (item.x >= itemSelect.x) && ((item.x + item.width) <= (itemSelect.x + itemSelect.width)) &&
            ((item.y + item.height) === itemSelect.y) &&

            item?.type !== 'frame'
         )

         state.RightRectangels = state.RightRectangels.map(item => {
            if (item.id === itemSelect.id) {
               return { ...item, width: 0, height: 0, }
            } else if (item.id === itemSelect.frameID) {
               return { ...item, width: 0, height: 0, }
            } else if (itemsUp.includes(item)) {
               return { ...item, height: item.height + FRAME_SIZE + itemDown.height }
            } else {
               return item
            }
         }).filter(item => item.id !== itemDown.id)

      },
      deleteItemRight(state, action) {

         const { id } = action.payload

         state.RightRectangels = state.RightRectangels.filter(item => item?.id !== id)
      },
      changeSizeHeightRight(state, action) {


         const { heightCloset, heightClosetChange, maxHeight, minHeight, lastFrame } = action.payload



         if (heightClosetChange > maxHeight) {
            state.RightRectangels = state.RightRectangels.map(item => {
               return { ...item, height: item.height + (maxHeight / 5 - heightCloset) }
            })
            state.rightBackRectangles = state.rightBackRectangles.map(item => {
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

               state.RightRectangels = state.RightRectangels.map(item => {
                  return { ...item, height: item.height + ((lastFrame + 50) - heightCloset) }
               })

               state.rightBackRectangles = state.rightBackRectangles.map(item => {
                  if (item.changeType === 'down') {
                     return { ...item, y: item.y + ((lastFrame + 50) - heightCloset) }
                  } else if (item.type !== 'line') {
                     return { ...item, height: item.height + ((lastFrame + 50) - heightCloset) }
                  } else {
                     return item
                  }
               })
            } else {

               state.RightRectangels = state.RightRectangels.map(item => {
                  if (item.type !== 'frame') {
                     return { ...item, height: item.height + (minHeight / 5 - heightCloset) }
                  } else {
                     return item
                  }
               })

               state.rightBackRectangles = state.rightBackRectangles.map(item => {
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

               state.RightRectangels = state.RightRectangels.map(item => {
                  return { ...item, height: item.height + ((lastFrame + 50) - heightCloset) }
               })

               state.rightBackRectangles = state.rightBackRectangles.map(item => {
                  if (item.changeType === 'down') {
                     return { ...item, y: item.y + ((lastFrame + 50) - heightCloset) }
                  } else if (item.type !== 'line') {
                     return { ...item, height: item.height + ((lastFrame + 50) - heightCloset) }
                  } else {
                     return item
                  }
               })

            } else {

               state.RightRectangels = state.RightRectangels.map(item => {
                  if (item?.type !== 'frame') {
                     return { ...item, height: item.height + (heightClosetChange / 5 - heightCloset) }
                  } else return item
               })

               state.rightBackRectangles = state.rightBackRectangles.map(item => {
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
      changeSizeWallRight(state, action) {

         const { widthClosetChange, widthCloset, maxWidth, minWidth, lastFrame } = action.payload

         if (widthClosetChange > maxWidth) {


            state.RightRectangels = state.RightRectangels.map(item => {
               return { ...item, x: item.x + (maxWidth / 5 - widthCloset) }
            })
            state.rightBackRectangles = state.rightBackRectangles.map(item => {
               return { ...item, x: item.x + (maxWidth / 5 - widthCloset) }
            })

         } else if (widthClosetChange < minWidth) {

            if ((widthClosetChange / 5) < lastFrame + 50) {


               state.RightRectangels = state.RightRectangels.map(item => {
                  return { ...item, x: item.x + ((lastFrame + 50) - widthCloset) }
               })

               state.rightBackRectangles = state.rightBackRectangles.map(item => {
                  return { ...item, x: item.x + ((lastFrame + 50) - widthCloset) }
               })
            } else {


               state.RightRectangels = state.RightRectangels.map(item => {

                  return { ...item, x: item.x + (minWidth / 5 - widthCloset) }

               })

               state.rightBackRectangles = state.rightBackRectangles.map(item => {
                  return { ...item, x: item.x + (minWidth / 5 - widthCloset) }
               })
            }

         } else {

            if ((widthClosetChange / 5) < lastFrame + 50) {



               state.RightRectangels = state.RightRectangels.map(item => {
                  return { ...item, x: item.x + ((lastFrame + 50) - widthCloset) }
               })
               state.rightBackRectangles = state.rightBackRectangles.map(item => {
                  return { ...item, x: item.x + ((lastFrame + 50) - widthCloset) }
               })
            }
            else {
               state.RightRectangels = state.RightRectangels.map(item => {
                  return { ...item, x: item.x + ((widthClosetChange / 5) - widthCloset) }
               })
               state.rightBackRectangles = state.rightBackRectangles.map(item => {
                  return { ...item, x: item.x + ((widthClosetChange / 5) - widthCloset) }
               })
            }


         }


      },
      changeSizeRightWall(state, action) {

         const { changeValue } = action.payload


         state.RightRectangels = state.RightRectangels.map(item => {
            return { ...item, x: item.x + changeValue }
         })

         state.rightBackRectangles = state.rightBackRectangles.map(item => {
            return { ...item, x: item.x + changeValue }
         })

      },
      changeWidthRight(state, action) {

         const { changeValue } = action.payload

         state.RightRectangels = state.RightRectangels.map(item => {
            return { ...item, width: item.width + changeValue }
         })


         state.rightBackRectangles = state.rightBackRectangles.map(item => {
            if (item.type === 'line') {
               return { ...item, radiusX: item.radiusX + changeValue }
            } else {
               return { ...item, width: item.width + changeValue }
            }


         })
      },
      changeColorRight(state, action) {

         const { mainColor } = action.payload

         state.rightBackRectangles = state.rightBackRectangles.map(item => {
            if (item.colorType === 'main') {
               item.fill = mainColor
               item.texture = null
               return item
            } else return item
         })

         state.RightRectangels = state.RightRectangels.map(item => {
            if (item?.type === 'frame') {
               item.color = mainColor
               item.texture = null
               return item
            } else return item
         })
         state.colorMain = mainColor
      },
      changeTextureRight(state, action) {

         const { value } = action.payload

         let mainTexture = null

         if (value !== '0') {
            mainTexture = `http://127.0.0.1:8000/${value}`
         } else {
            mainTexture = null
         }

         state.rightBackRectangles = state.rightBackRectangles.map(item => {
            if (item.colorType === 'main') {
               item.texture = mainTexture
               return item
            } else return item
         })


         state.RightRectangels = state.RightRectangels.map(item => {
            if (item?.type === 'frame') {
               item.texture = mainTexture
               return item
            } else return item
         })

         state.TextureMain = mainTexture
      },
      rightVisibleWall(state, action) {

         const { widthRightWall, widthLeftWall, heightCloset, widthCloset ,value} = action.payload
         state.RightWallVisible=value
         state.RightRectangels = [{ id: 40, width: widthRightWall, height: heightCloset - 60, x: widthLeftWall + widthCloset, y: 30 },]
         state.horizontalRightFrames = []
      },
      changeHorizontalRightFrames(state, action) {


         const { value, valueInput, itemSelect, heightShow } = action.payload

         const itemsDown = state.RightRectangels.filter(item => (
            (item.x >= itemSelect.x && ((item.x + item.width) <= (itemSelect.x + itemSelect.width))) &&
            (item.y === (itemSelect.y + itemSelect.height))
         )
         )

         const itemsUp = state.RightRectangels.filter(item => (
            (item.x >= itemSelect.x && ((item.x + item.width) <= (itemSelect.x + itemSelect.width))) &&
            ((item.y + item.height) === itemSelect.y)
         )
         )


         if (heightShow !== undefined) {
            state.RightRectangels = state.RightRectangels.map(item => {
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

            state.horizontalRightFrames = state.horizontalRightFrames.map(item => {
               if (item.id === itemSelect.id) {
                  return { ...item, y: item.y + ((valueInput - 150) / 5 - value) }
               }
               else {
                  return item
               }
            })

         } else {

            state.RightRectangels = state.RightRectangels.map(item => {
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

            state.horizontalRightFrames = state.horizontalRightFrames.map(item => {
               if (item.id === itemSelect.id) {
                  return { ...item, y: item.y + ((valueInput) / 5 - value) }
               }
               else {
                  return item
               }
            })

         }
      }
   },

});



export default rightRectangelsSlice.reducer;
export const {
   createHorizontalRight, DragStarHorizontalRight, deleteItemRight,
   changeSizeHeightRight, changeSizeWallRight, changeSizeRightWall,
   changeWidthRight, changeColorRight, changeTextureRight, rightVisibleWall
   , changeHorizontalRightFrames

} = rightRectangelsSlice.actions;


