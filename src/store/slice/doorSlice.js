import { createSlice, } from '@reduxjs/toolkit';


const FRAME_SIZE = 5;

function id() {
   return Math.round(Math.random() * 10000);
}


const initialState = {
   doors: [],
   doorRectangles: [],
   colorFrame: '#efcf9f',
   colorMain: 'white',
   verticalDoorsFrame: [],
   horizontalDoorsFrames: []
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

            doorsArr.push({ id: id(), x: ((widthLeftWall + 2.5) + (widthCloset / countDoors * i)), stroke: 'black' })

         }

         for (let i = 0; i < countDoors; i++) {

            doorsReactanglesArr.push(
               {
                  id: id(),
                  x: ((widthLeftWall + 5) + (widthCloset / countDoors * i)),
                  y: 5,
                  width: (widthCloset / countDoors) - 10,
                  height: heightCloset - 10,
                  color: state.colorMain,
                  opacity: 0.5,
                  numberDoor: i + 1
               }

            )

         }

         state.doors = doorsArr
         state.doorRectangles = doorsReactanglesArr

      },
      createDoorsVertical(state, action) {
         const { xk, yk, idd, widthLeftWall } = action.payload
         const idFrame = id()

         const itemSelect = state.doorRectangles.filter(item => ((xk > item.x && xk < (item.x + item.width)) &&
            (yk > item.y && yk < (item.y + item.height))))[0]

         const newsect = [...state.doorRectangles.filter(item => item.id !== itemSelect?.id).filter(item => item?.id !== idd),
         { id: id(), numberDoor: itemSelect.numberDoor, color: state.colorMain, opacity: 0.5, width: xk - itemSelect?.x, height: itemSelect?.height, x: itemSelect?.x, y: itemSelect?.y },
         { id: idFrame, numberDoor: itemSelect.numberDoor, width: FRAME_SIZE, height: itemSelect.height, color: state.colorFrame, texture: state.TextureMain, x: xk, y: itemSelect?.y, type: 'frame', draggable: true, derection: 1 },
         // { id: idFrame, width: FRAME_SIZE, height: itemSelect.height, color: 'black', opacity: 0.2, x: xk, y: itemSelect?.y, draggable: true, derection: 1 },
         { id: id(), numberDoor: itemSelect.numberDoor, color: state.colorMain, opacity: 0.5, width: itemSelect.width - (xk - itemSelect.x) - FRAME_SIZE, height: itemSelect?.height, x: xk + FRAME_SIZE, y: itemSelect?.y }

         ]


         state.verticalDoorsFrame = [...state.verticalDoorsFrame,
         { id: idFrame, numberDoor: itemSelect.numberDoor, width: FRAME_SIZE, height: itemSelect.height, x: xk - widthLeftWall, y: itemSelect?.y, type: 'frame', draggable: true, derection: 1 }]

         state.doorRectangles = newsect
      },
      createDoorsHorizontal(state, action) {
         const { xk, yk, idd } = action.payload

         const idFrame = id()

         const itemSelect = state.doorRectangles.filter(item => ((xk > item.x && xk < (item.x + item.width)) &&
            (yk > item.y && yk < (item.y + item.height))))[0]



         const newsect = [...state.doorRectangles.filter(item => item.id !== itemSelect?.id).filter(item => item?.id !== idd),
         { id: id(), numberDoor: itemSelect.numberDoor, color: state.colorMain, opacity: 0.5, width: itemSelect.width, height: yk - itemSelect?.y, x: itemSelect?.x, y: itemSelect?.y },
         { id: idFrame, numberDoor: itemSelect.numberDoor, width: itemSelect.width, height: FRAME_SIZE, color: state.colorFrame, texture: state.TextureMain, x: itemSelect?.x, y: yk, type: 'frame', draggable: true, derection: 2 },
         // { id: idFrame, width: itemSelect.width, height: FRAME_SIZE, color: 'black', opacity: 0.2, x: itemSelect?.x, y: yk, draggable: true, derection: 2 },
         { id: id(), numberDoor: itemSelect.numberDoor, color: state.colorMain, opacity: 0.5, width: itemSelect.width, height: itemSelect?.height - (yk - itemSelect?.y) - FRAME_SIZE, x: itemSelect?.x, y: yk + FRAME_SIZE }]


         state.horizontalDoorsFrames = [...state.horizontalDoorsFrames,
         { id: idFrame, numberDoor: itemSelect.numberDoor, width: itemSelect.width, height: FRAME_SIZE, color: state.colorMain, x: itemSelect?.x, y: yk, type: 'frame', draggable: true, derection: 2 }]


         state.doorRectangles = newsect

      },

      DragStarDoorsVertical(state, action) {

         let { itemSelect } = action.payload

         state.verticalDoorsFrame = state.verticalDoorsFrame.filter(item => item.id !== itemSelect.id)


         // рамки справа
         const itemsFrameRight = state.doorRectangles.filter(item => (
            (item.y > itemSelect.y && (item.y + item.height) < (itemSelect.y + itemSelect.height))
            &&
            ((item.x) === itemSelect.x + itemSelect.width) && item?.type === 'frame'
         )
         )

         // прямоугольники справа
         const itemsRight = state.doorRectangles.filter(item => (
            (itemSelect.y + 2 > item.y && itemSelect.y + 2 < (item.y + item.height)) &&
            (itemSelect.x + 2 + FRAME_SIZE > item.x && itemSelect.x + FRAME_SIZE + 2 < (item.x + item.width)) && item?.type !== 'frame'
         )
         )[0]


         // прямоугольники слева
         const itemsLeft = state.doorRectangles.filter(item =>
            (item.y >= itemSelect.y) && ((item.y + item.height) <= (itemSelect.y + itemSelect.height)) &&
            ((item.x + item.width) === itemSelect.x) &&

            item?.type !== 'frame'
         )

         // рамки слева
         const itemsFrameLeft = state.doorRectangles.filter(item => (
            (item.y > itemSelect.y && (item.y + item.height) < (itemSelect.y + itemSelect.height))
            &&
            ((item.x + item.width) === itemSelect.x) && item?.type === 'frame'
         )
         )

         // максимальная ширина рамки справа
         const max = itemsFrameRight.length > 0 && itemsFrameRight?.reduce((acc, curr) => acc?.width > curr?.width ? acc : curr);


         // область поиска в которой ищется все, что нужно удалить
         const searchArea = { x: itemSelect.x + FRAME_SIZE, y: itemSelect.y, width: max.width, height: itemSelect.height }


         const deleteRec = state.doorRectangles.filter(item =>
            item?.x >= searchArea?.x && item?.x < (searchArea?.x + searchArea?.width) &&
            item?.y >= searchArea?.y && item?.y < (searchArea?.y + searchArea?.height))


         // если рамки справа нету

         if (itemsFrameRight.length === 0) {
            state.doorRectangles = state.doorRectangles.map(item => {
               if (item.id === itemSelect.id) {
                  return { ...item, width: 0, height: 0, }
               }
               else if (itemsFrameLeft.includes(item) || itemsLeft.includes(item)) {
                  return { ...item, width: item.width + FRAME_SIZE + itemsRight.width }
               } else {
                  return item
               }
            }).filter(item => item.id !== itemsRight.id)

         }
         else {

            // если рамка справа есть 
            state.doorRectangles = state.doorRectangles.map(item => {
               if (item.id === itemSelect.id) {
                  return { ...item, width: 0, height: 0, }
               }
               else if (itemsFrameLeft.includes(item) || itemsLeft.includes(item)) {
                  return { ...item, width: item.width + max.width + FRAME_SIZE, }
               } else {
                  return item
               }
            }).filter(item => !deleteRec.includes(item))



            state.horizontalDoorsFrames = state.horizontalDoorsFrames.filter(item_a => !deleteRec.some(item_B => item_a.id === item_B.id))
         }

      },
      DragStarDoorsHorizontal(state, action) {

         const { itemSelect } = action.payload

         state.horizontalDoorsFrames = state.horizontalDoorsFrames.filter(item => item.id !== itemSelect.id)

         // рамки внизу
         const itemsFrameDown = state.doorRectangles.filter(item => (
            (item.x > itemSelect.x && (item.x + item.width) < (itemSelect.x + itemSelect.width))
            &&
            ((item.y) === itemSelect.y + itemSelect.height) && item?.type === 'frame'
         )
         )

         // прямоугольник внизу
         const itemDown = state.doorRectangles.filter(item => (
            (itemSelect.x + 2 > item.x && itemSelect.x + 2 < (item.x + item.width)) &&
            (itemSelect.y + 2 + FRAME_SIZE > item.y && itemSelect.y + FRAME_SIZE + 2 < (item.y + item.height)) && item?.type !== 'frame'
         )
         )[0]

         // прямоугольнику вверху
         const itemsUp = state.doorRectangles.filter(item => (item.x >= itemSelect.x) && ((item.x + item.width) <= (itemSelect.x + itemSelect.width)) &&
            ((item.y + item.height) === itemSelect.y) &&

            item?.type !== 'frame'
         )

         // рамки вверху
         const itemsFrameUp = state.doorRectangles.filter(item => (
            (item.x > itemSelect.x && (item.x + item.width) < (itemSelect.x + itemSelect.width))
            &&
            ((item.y + item.height) === itemSelect.y) && item?.type === 'frame'
         )
         )

         // максимальная высота рамки снизу
         const max = itemsFrameDown.length > 0 && itemsFrameDown?.reduce((acc, curr) => acc?.height > curr?.height ? acc : curr);


         // область поиска в которой ищутся все, что нужно удалить
         const searchArea = { x: itemSelect.x, y: itemSelect.y + itemSelect.height, width: itemSelect.width, height: max.height }


         const deleteRec = state.doorRectangles.filter(item =>
            item?.x >= searchArea?.x && item?.x < (searchArea?.x + searchArea?.width) &&
            item?.y >= searchArea?.y && item?.y < (searchArea?.y + searchArea?.height))


         // если нет рамок снизу 

         if (itemsFrameDown.length === 0) {
            state.doorRectangles = state.doorRectangles.map(item => {
               if (item.id === itemSelect.id) {
                  return { ...item, width: 0, height: 0, }
               }
               else if (itemsUp.includes(item) || itemsFrameUp.includes(item)) {
                  return { ...item, height: item.height + FRAME_SIZE + itemDown.height }
               } else {
                  return item
               }
            }).filter(item => item.id !== itemDown.id)

         }
         else {
            // если рамка внизу есть 
            state.doorRectangles = state.doorRectangles.map(item => {
               if (item.id === itemSelect.id) {
                  return { ...item, width: 0, height: 0, }
               }
               else if (itemsUp.includes(item) || itemsFrameUp.includes(item)) {
                  return { ...item, height: item.height + max.height + FRAME_SIZE, }
               } else {
                  return item
               }
            }).filter(item => !deleteRec.includes(item))

            state.verticalDoorsFrame = state.verticalDoorsFrame.filter(item_a => !deleteRec.some(item_B => item_a.id === item_B.id))
         }

      },
      deleteDoorsRectangle(state, action) {
         const { id } = action.payload

         state.doorRectangles = state.doorRectangles.filter(item => item?.id !== id)
      },

      onBlurInputDoorsVertical(state, action) {


         let { value, containerDiv, wrap, itemSelect, height } = action.payload

         containerDiv.removeChild(wrap);


         const FrameDown = state.doorRectangles.filter(item => (

            ((item.y) === (itemSelect.y + height))
            &&
            ((item.x < itemSelect.x) && ((item.x + item.width) > (itemSelect.x + itemSelect.width)))
         )
         )[0]




         if (FrameDown !== undefined) {

            const itemsDown = state.doorRectangles.filter(item => (
               (item.y === (FrameDown.y + FrameDown.height)) &&
               ((item.x >= FrameDown.x) && ((item.x + item.width) <= (FrameDown.x + FrameDown.width)))
            )
            )


            const itemsUp = state.doorRectangles.filter(item => (
               ((item.y + item.height) === FrameDown.y) &&
               ((item.x >= FrameDown.x) && ((item.x + item.width) <= (FrameDown.x + FrameDown.width)))
            )
            )

            let changeValue = (value - 2) - height



            state.doorRectangles = state.doorRectangles.map(item => {
               if (item.id === itemSelect.id) {
                  return { ...item, height: item.height + changeValue }
               }
               else if (itemsUp.includes(item)) {
                  return { ...item, height: item.height + changeValue, }
               }
               else if (itemsDown.includes(item)) {
                  return { ...item, y: item.y + changeValue, height: item.height - changeValue, }
               }
               else if (item === FrameDown) {
                  return { ...item, y: item.y + changeValue }
               }
               else {
                  return item
               }
            })


            state.horizontalDoorsFrames = state.horizontalDoorsFrames.map(item => {
               if (item.id === FrameDown.id) {
                  return { ...item, y: item.y + changeValue }
               }
               else {
                  return item
               }
            })

         }









         // если itemsRight пустой значит рамка стоит в упор к стенке
         // добавлять разницу к элементам слева и убавлять разницу элементам справа
      },
      onBlurInputDoorsHorizontal(state, action) {


         let { value, containerDiv, wrap, itemSelect, width } = action.payload


         containerDiv.removeChild(wrap);


         const FrameRight = state.doorRectangles.filter(item => (

            ((item.x) === (itemSelect.x + width)) &&
            ((item.y < itemSelect.y) && ((item.y + item.height) > (itemSelect.y + itemSelect.height)))
         )
         )[0]

         let changeValue = 0

         changeValue = (value - 2) - width

         if (FrameRight !== undefined) {
            const itemsRightFrame = state.doorRectangles.filter(item => (
               (item.x === (FrameRight.x + FrameRight.width)) &&
               ((item.y >= FrameRight.y) && ((item.y + item.height) <= (FrameRight.y + FrameRight.height)))
            )
            )

            const itemsLeftFrame = state.doorRectangles.filter(item => (
               ((item.x + item.width) === FrameRight.x) &&
               ((item.y >= FrameRight.y) && ((item.y + item.height) <= (FrameRight.y + FrameRight.height)))
            )
            )
            // const minWidth = itemsRight?.reduce((acc, curr) => acc?.width < curr?.width ? acc : curr).width;

            state.doorRectangles = state.doorRectangles.map(item => {
               if (itemsLeftFrame.includes(item)) {
                  return { ...item, width: item.width + changeValue, }
               }
               else if (itemsRightFrame.includes(item)) {
                  return { ...item, x: item.x + changeValue, width: item.width - changeValue, }
               }
               else if (item === FrameRight) {
                  return { ...item, x: item.x + changeValue }
               }
               else {
                  return item
               }
            })


            state.verticalDoorsFrame = state.verticalDoorsFrame.map(item => {
               if (item.id === FrameRight.id) {

                  return { ...item, x: item.x + changeValue }
               }
               else {
                  return item
               }
            })
         }




         // если itemsRight пустой значит рамка стоит в упор к стенке

      },

      changeColorStroke(state, action) {

         const { mainColor } = action.payload

         state.doors.map(item => {

            item.stroke = mainColor
            return item
         })


      },
      changeColorRect(state, action) {

         const { color, id } = action.payload


         if (color.includes('Images')) {
            state.doorRectangles.map(item => {

               if (item.id === id) {
                  item.texture = `http://127.0.0.1:8000/${color}`
                  item.color = null
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

   },

});



export default DoorPageslice.reducer;
export const {
   createDoorsVertical, createDoorsHorizontal,
   createDoors, DragStarDoorsVertical,
   DragStarDoorsHorizontal, deleteDoorsRectangle,
   onBlurInputDoorsVertical, onBlurInputDoorsHorizontal,
   changeColorStroke, changeColorRect
} = DoorPageslice.actions;


