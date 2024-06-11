import { createSlice, createAsyncThunk, current, } from '@reduxjs/toolkit';


const FRAME_SIZE = 5;
const FRAME_SIZESHOW = 3.2
const colorMain = '#efcf9f'

function checkPlaneIntersection(plane1X, plane1Y, plane1Width, plane1Height, plane2X, plane2Y, plane2Width, plane2Height) {

   let intersectX = Math.max(plane1X, plane2X) < Math.min(plane1X + plane1Width, plane2X + plane2Width);
   let intersectY = Math.max(plane1Y, plane2Y) < Math.min(plane1Y + plane1Height, plane2Y + plane2Height);

   return intersectX && intersectY;
}


function id() {
   return Math.round(Math.random() * 10000);
}

const widthCloset = 600
const heightCloset = 400

const initialState = {
   Rectangels: [{ id: 1, width: widthCloset - 10, height: heightCloset - 10, x: 105, y: 5, yShow: FRAME_SIZESHOW, xShow: 100 + FRAME_SIZESHOW }],
   verticalFrames: [],
   horizontalFrames: [],
   mainBackRectangles: [

      { id: id(), width: widthCloset, height: heightCloset, x: 100, y: 0, fill: colorMain, changeType: 'frame', colorType: 'frame', texture: null, },
      { id: id(), width: widthCloset, height: heightCloset, x: 100, y: 0, fill: 'black', opacity: 0.2, colorType: 'shadow', texture: null, },

      {
         id: id(),
         points: [
            105, 5,
            205, 30,
            205, heightCloset - 25,
            105, heightCloset],
         // fill: colorMain,
         fill: 'gray',
         texture: null,
         type: 'line',
         changeType: 'left',
         colorType: 'main'
      },

      {
         id: id(),
         points: [
            105, 5,
            110 + (widthCloset - 15), 5,
            105 + (widthCloset - 10 - 100), 30,
            205, 30],
         // points: [
         //    105, 5,
         //    110 + (widthCloset - 15), 5,
         //    105 + (widthCloset - 10 ), 30,
         //    105, 30],
         fill: colorMain,
         type: 'line',
         changeType: 'up',
         texture: null,
         colorType: 'main'
      },

      {
         id: id(),
         points: [
            105 + (widthCloset - 10 - 100), 30,
            105 + (widthCloset - 10), 5,
            105 + (widthCloset - 10), heightCloset,
            105 + (widthCloset - 10 - 100), heightCloset - 25],
         // fill: colorMain,
         fill: 'gray',
         type: 'line',
         changeType: 'right',
         colorType: 'main',
         texture: null,
      },

      {
         id: id(),
         // points: [
         //    105, heightCloset - 30,
         //    105 + (widthCloset - 10 ), heightCloset - 30,
         //    110 + (widthCloset - 15), heightCloset - 5,
         //    105, heightCloset - 5],
         points: [
            205, heightCloset - 25,
            105 + (widthCloset - 10 - 100), heightCloset - 25,
            110 + (widthCloset - 15), heightCloset,
            105, heightCloset],
         // fill: colorMain,
         fill: 'white',
         type: 'line',
         changeType: 'down',
         colorType: 'main',
         texture: null,
      },
      {
         id: id(),
         // width: widthCloset - 10 ,
         width: widthCloset - 10 - 200,
         height: heightCloset - 55,

         x: 205,
         // x: 105,
         y: 30,

         fill: colorMain, colorType: 'frame', texture: null,
         type: 'backWall',
         changeType: 'main'
      },
      {
         id: id(),
         width: widthCloset - 10 - 200,
         // width: widthCloset - 10 ,
         height: heightCloset - 55,
         // x: 105,
         x: 205,
         y: 30,
         fill: 'black',
         opacity: 0.2,
         colorType: 'shadow',
         texture: null,
         changeType: 'main',
         type: 'backWallShadow',
      }

   ],
   colorMain: '#efcf9f',
   elements: [],
   TextureMain: null,
   selectedTextura: {
      id: 'std',
      mainColor: '#efcf9f',
      title: 'Стандартный',
      cost: 500
   },
   intersection: false,
   countBox: 0,
   countBarbel: 0,
   countHanger: 0,
   downVisible: false,
   upVisible: true,
   mainVisible: true,
   srcMainImage:''


}


const mainRectanglesSlice = createSlice({
   name: 'mainRectangles',
   initialState,
   reducers: {
      createVertical(state, action) {
         const { xk, yk, shadowid, mainId, widthLeftWall } = action.payload
         const idFrame = id()
         const idShadowFrame = id()

         const itemSelect = state.Rectangels.filter(item => ((xk > item.x && xk < (item.x + item.width)) &&
            (yk > item.y && yk < (item.y + item.height))))[0]

         const newFrame = {
            id: idFrame,
            width: FRAME_SIZE,
            height: itemSelect.height,
            color: state.colorMain,
            texture: state.TextureMain,
            x: xk,
            y: itemSelect?.y,
            type: 'frame',
            draggable: true, derection: 1
         }

         const shadowFrame = {
            id: idShadowFrame,
            idFrame: idFrame, width: FRAME_SIZE,
            type: 'shadowframe', height: itemSelect.height,
            color: 'black', opacity: 0.2,
            frameID: idFrame,
            x: xk, y: itemSelect?.y,
            draggable: true, derection: 1
         }

         let intersected = false;

         // проверка на пересечение 
         state.elements.forEach(item => {
            if (checkPlaneIntersection(newFrame.x, newFrame.y, newFrame.width, newFrame.height, item.x, item.y, item.width, item.height)) {
               intersected = true
            }
         })


         if (!intersected) {

            const newsect = [...state.Rectangels.filter(item => item.id !== itemSelect?.id).filter(item => item?.id !== shadowid).filter(item => item?.id !== mainId),
            { id: id(), width: xk - itemSelect?.x, height: itemSelect?.height, x: itemSelect?.x, y: itemSelect?.y },
               newFrame,
               shadowFrame,
            { id: id(), width: itemSelect.width - (xk - itemSelect.x) - FRAME_SIZE, height: itemSelect?.height, x: xk + FRAME_SIZE, y: itemSelect?.y }]


            state.verticalFrames = [...state.verticalFrames,
            { id: idFrame, width: FRAME_SIZE, shadowFrameId: idShadowFrame, height: itemSelect.height, color: state.colorMain, x: xk - widthLeftWall, y: itemSelect?.y, type: 'frame', draggable: true, derection: 1 }]

            state.Rectangels = newsect

         }


      },
      createHorizontal(state, action) {
         const { xk, yk, shadowid, mainId } = action.payload

         const idFrame = id()
         const idShadowFrame = id()
         let intersected = false;



         const itemSelect = state.Rectangels.filter(item => ((xk > item.x && xk < (item.x + item.width)) &&
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

         // проверка что рамка не пересикается с элемнтов 

         state.elements.forEach(item => {
            if (checkPlaneIntersection(newFrame.x, newFrame.y, newFrame.width, newFrame.height, item.x, item.y, item.width, item.height)) {
               intersected = true
            }
         })

         if (!intersected) {

            const newsect = [...state.Rectangels.filter(item => item.id !== itemSelect?.id).filter(item => item?.id !== shadowid).filter(item => item?.id !== mainId),
            { id: id(), width: itemSelect.width, height: yk - itemSelect?.y, x: itemSelect?.x, y: itemSelect?.y },
               newFrame,
               shadowFrame,
            { id: id(), width: itemSelect.width, height: itemSelect?.height - (yk - itemSelect?.y) - FRAME_SIZE, x: itemSelect?.x, y: yk + FRAME_SIZE }]


            state.horizontalFrames = [...state.horizontalFrames,
            {
               id: idFrame,
               width: itemSelect.width,
               shadowFrameId: idShadowFrame,
               height: FRAME_SIZE,
               color: state.colorMain,
               x: itemSelect?.x,
               y: yk,
               type: 'frame', draggable: true, derection: 2
            }]


            state.Rectangels = newsect


         }


      },
      createNewBurb(state, action) {
         const { xk, yk, idd, widthLeftWall, widthCloset, start } = action.payload

         const idElement = id()

         console.log(start)

         let intersected = false;
         const heightBurb = 20

         const itemSelect = state.Rectangels.filter(item => ((xk > item.x && xk < (item.x + item.width)) &&
            (yk > item.y && yk < (item.y + item.height))))[0]



         let newElement = {
            id: idElement,
            width: itemSelect.width,
            height: heightBurb,
            src: './images/barbell.png',
            x: itemSelect?.x, y: yk, type: 'element', draggable: true, derection: 2
         }

         if ((itemSelect.x === widthLeftWall + 5) && (itemSelect.x + itemSelect.width === widthCloset + widthLeftWall - 5)) {
            newElement = {
               id: idElement,
               width: itemSelect.width - 100,
               height: heightBurb,
               src: './images/barbell.png',
               x: itemSelect?.x + 50, y: yk, type: 'element', draggable: true, derection: 2
            }

         } else if (itemSelect.x === widthLeftWall + 5) {
            newElement = {
               id: idElement,
               width: itemSelect.width - 50,
               height: heightBurb,
               src: './images/barbell.png',
               x: itemSelect?.x + 50, y: yk, type: 'element', draggable: true, derection: 2
            }
         } else if (itemSelect.x + itemSelect.width === widthCloset + widthLeftWall - 5) {
            newElement = {
               id: idElement,
               width: itemSelect.width - 50,
               height: heightBurb,
               src: './images/barbell.png',
               x: itemSelect?.x, y: yk, type: 'element', draggable: true, derection: 2
            }
         }



         state.elements.forEach(item => {
            if (checkPlaneIntersection(newElement.x, newElement.y, newElement.width, newElement.height, item.x, item.y, item.width, item.height, newElement.id, item.id)) {
               intersected = true
            }
         })
         state.elements = state.elements.filter(item => item?.id !== idd)

         if (!intersected) {

            // const newsect = [...state.Rectangels.filter(item => item.id !== itemSelect?.id).filter(item => item?.id !== idd),
            // { id: id(), width: itemSelect.width, height: yk - itemSelect?.y, x: itemSelect?.x, y: itemSelect?.y },
            // { id: id(), width: itemSelect.width, height: itemSelect?.height - (yk - itemSelect?.y) - heightBurb, x: itemSelect?.x, y: yk + heightBurb }]

            const newElems = [...state.elements.filter(item => item?.id !== idd),
               newElement
            ]

            // state.Rectangels = newsect
            if (start == undefined){
               state.countBarbel = state.countBarbel + 1


            }
            state.elements = newElems
         }


      },
      createDrawer(state, action) {
         const { xk, yk, idd, heightDrawer } = action.payload

         const idElement = id()

         let intersected = false;

         let heightBurb = 40

         if (!heightDrawer) {
            heightBurb = 40
            state.countBox = state.countBox + 1
         } else {
            heightBurb = heightDrawer

         }



         const itemSelect = state.Rectangels.filter(item => ((xk > item.x && xk < (item.x + item.width)) &&
            (yk > item.y && yk < (item.y + item.height))))[0]

         const newElement = {
            id: idElement,
            width: itemSelect.width,
            height: heightBurb,
            copyHeight: heightBurb,
            src: './images/drawer.png',
            x: itemSelect?.x, y: yk, type: 'drawer', draggable: true, derection: 2
         }

         state.elements.forEach(item => {
            if (checkPlaneIntersection(newElement.x, newElement.y, newElement.width, newElement.height, item.x, item.y, item.width, item.height, newElement.id, item.id)) {
               intersected = true
            }
         })

         state.Rectangels.filter(item => item.type === 'frame').forEach(item => {
            if (checkPlaneIntersection(newElement.x, newElement.y, newElement.width, newElement.height, item.x, item.y, item.width, item.height, newElement.id, item.id)) {
               intersected = true
            }
         })


         state.elements = state.elements.filter(item => item?.id !== idd)

         if (!intersected) {


            const newElems = [...state.elements.filter(item => item?.id !== idd),
               newElement
            ]


            state.elements = newElems
         }


      },
      createHanger(state, action) {
         const { xk, yk, idd, start } = action.payload

         const idElement = id()
         const widthHanger = 100
         const heightHanger = 130

         let intersected = false;

         const itemSelect = state.Rectangels.filter(item => ((xk > item.x && xk < (item.x + item.width)) &&
            (yk > item.y && yk < (item.y + item.height))))[0]





         const newElement = {
            id: idElement,
            width: widthHanger,
            height: heightHanger,
            src: './images/вешалка.png',
            x: xk, y: itemSelect?.y, type: 'hanger', draggable: true,
         }

         state.elements.forEach(item => {
            if (checkPlaneIntersection(newElement.x, newElement.y, newElement.width, newElement.height, item.x, item.y, item.width, item.height, newElement.id, item.id)) {
               intersected = true
            }
         })

         state.elements = state.elements.filter(item => item?.id !== idd)

         if (itemSelect.width > widthHanger && itemSelect.height > heightHanger && !intersected && ((xk - itemSelect.x + widthHanger) < itemSelect.width)) {
            const newElems = [...state.elements.filter(item => item?.id !== idd),
               newElement
            ]
            state.elements = newElems
            if (start == undefined) {
               state.countHanger = state.countHanger + 1
            }
         }


      },
      createSideHanger(state, action) {
         const { xk, yk, idd, widthCloset } = action.payload

         const idElement = id()
         const widthSideHanger = 50
         const heightSideHanger = 60

         let intersected = false;

         const sortRectangle = state.Rectangels.sort(function (a, b) {
            if (a.x > b.x) {
               return 1;
            }
            if (a.x < b.x) {
               return -1;
            }
            return 0;
         });



         const leftItem = {
            id: idElement,
            width: widthSideHanger,
            height: heightSideHanger,
            src: './images/burb.webp',
            x: sortRectangle[0].x, y: yk, type: 'sidehanger', draggable: true,
         }
         const rightItem = {
            id: idElement,
            width: widthSideHanger,
            height: heightSideHanger,
            src: './images/burb.webp',
            x: sortRectangle[0].x + widthCloset - widthSideHanger - 10, y: yk, type: 'sidehanger', draggable: true,
         }





         const midlex = sortRectangle[0].x + (widthCloset / 2)

         if (xk <= midlex) {

            state.elements.forEach(item => {
               if (checkPlaneIntersection(leftItem.x, leftItem.y, leftItem.width, leftItem.height, item.x, item.y, item.width, item.height, leftItem.id, item.id)) {
                  intersected = true
               }
            })

            state.Rectangels.filter(item => item.type === 'frame').forEach(item => {
               if (checkPlaneIntersection(leftItem.x, leftItem.y, leftItem.width, leftItem.height, item.x, item.y, item.width, item.height, leftItem.id, item.id)) {
                  intersected = true
               }
            })

            if (!intersected) {
               const newElems = [...state.elements.filter(item => item?.id !== idd),
                  leftItem]
               state.elements = newElems
            }

         } else {

            state.elements.forEach(item => {
               if (checkPlaneIntersection(rightItem.x, rightItem.y, rightItem.width, rightItem.height, item.x, item.y, item.width, item.height, rightItem.id, item.id)) {
                  intersected = true
               }
            })

            state.Rectangels.filter(item => item.type === 'frame').forEach(item => {
               if (checkPlaneIntersection(rightItem.x, rightItem.y, rightItem.width, rightItem.height, item.x, item.y, item.width, item.height, rightItem.id, item.id)) {
                  intersected = true
               }
            })


            if (!intersected) {
               const newElems = [...state.elements.filter(item => item?.id !== idd),
                  rightItem
               ]
               state.elements = newElems
            }


         }






      },
      DragStarVertical(state, action) {

         let { itemSelect } = action.payload

         state.verticalFrames = state.verticalFrames.filter(item => item.id !== itemSelect.frameID)


         // рамки справа
         const itemsFrameRight = state.Rectangels.filter(item => (
            (item.y > itemSelect.y && (item.y + item.height) < (itemSelect.y + itemSelect.height))
            &&
            ((item.x) === itemSelect.x + itemSelect.width) && item?.type === 'frame'
         )
         )

         // прямоугольники справа
         const itemsRight = state.Rectangels.filter(item => (
            (itemSelect.y + 2 > item.y && itemSelect.y + 2 < (item.y + item.height)) &&
            (itemSelect.x + 2 + FRAME_SIZE > item.x && itemSelect.x + FRAME_SIZE + 2 < (item.x + item.width)) && item?.type !== 'frame'
         )
         )[0]


         // прямоугольники слева
         const itemsLeft = state.Rectangels.filter(item =>
            (item.y >= itemSelect.y) && ((item.y + item.height) <= (itemSelect.y + itemSelect.height)) &&
            ((item.x + item.width) === itemSelect.x) &&

            item?.type !== 'frame'
         )

         // рамки слева
         const itemsFrameLeft = state.Rectangels.filter(item => (
            (item.y > itemSelect.y && (item.y + item.height) < (itemSelect.y + itemSelect.height))
            &&
            ((item.x + item.width) === itemSelect.x) && item?.type === 'frame'
         )
         )

         // максимальная ширина рамки справа
         const max = itemsFrameRight.length > 0 && itemsFrameRight?.reduce((acc, curr) => acc?.width > curr?.width ? acc : curr);


         // область поиска в которой ищется все, что нужно удалить
         const searchArea = { x: itemSelect.x + FRAME_SIZE, y: itemSelect.y, width: max.width, height: itemSelect.height }


         const deleteRec = state.Rectangels.filter(item =>
            item?.x >= searchArea?.x && item?.x < (searchArea?.x + searchArea?.width) &&
            item?.y >= searchArea?.y && item?.y < (searchArea?.y + searchArea?.height))


         // если рамки справа нету

         if (itemsFrameRight.length === 0) {
            state.Rectangels = state.Rectangels.map(item => {
               if (item.id === itemSelect.id) {
                  return { ...item, width: 0, height: 0, }
               } else if (item.id === itemSelect.frameID) {
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
            state.Rectangels = state.Rectangels.map(item => {
               if (item.id === itemSelect.id) {
                  return { ...item, width: 0, height: 0, }
               } else if (item.id === itemSelect.frameID) {
                  return { ...item, width: 0, height: 0, }
               }
               else if (itemsFrameLeft.includes(item) || itemsLeft.includes(item)) {
                  return { ...item, width: item.width + max.width + FRAME_SIZE, }
               } else {
                  return item
               }
            }).filter(item => !deleteRec.includes(item))



            state.horizontalFrames = state.horizontalFrames.filter(item_a => !deleteRec.some(item_B => item_a.id === item_B.id))
         }

      },
      DragStarHorizontal(state, action) {

         const { itemSelect } = action.payload

         state.horizontalFrames = state.horizontalFrames.filter(item => item.id !== itemSelect.frameID)

         // рамки внизу
         const itemsFrameDown = state.Rectangels.filter(item => (
            (item.x > itemSelect.x && (item.x + item.width) < (itemSelect.x + itemSelect.width))
            &&
            ((item.y) === itemSelect.y + itemSelect.height) && item?.type === 'frame'
         )
         )

         // прямоугольник внизу
         const itemDown = state.Rectangels.filter(item => (
            (itemSelect.x + 2 > item.x && itemSelect.x + 2 < (item.x + item.width)) &&
            (itemSelect.y + 2 + FRAME_SIZE > item.y && itemSelect.y + FRAME_SIZE + 2 < (item.y + item.height)) && item?.type !== 'frame'
         )
         )[0]

         // прямоугольнику вверху
         const itemsUp = state.Rectangels.filter(item => (item.x >= itemSelect.x) && ((item.x + item.width) <= (itemSelect.x + itemSelect.width)) &&
            ((item.y + item.height) === itemSelect.y) &&

            item?.type !== 'frame'
         )

         // рамки вверху
         const itemsFrameUp = state.Rectangels.filter(item => (
            (item.x > itemSelect.x && (item.x + item.width) < (itemSelect.x + itemSelect.width))
            &&
            ((item.y + item.height) === itemSelect.y) && item?.type === 'frame'
         )
         )

         // максимальная высота рамки снизу
         const max = itemsFrameDown.length > 0 && itemsFrameDown?.reduce((acc, curr) => acc?.height > curr?.height ? acc : curr);


         // область поиска в которой ищутся все, что нужно удалить
         const searchArea = { x: itemSelect.x, y: itemSelect.y + itemSelect.height, width: itemSelect.width, height: max.height }


         const deleteRec = state.Rectangels.filter(item =>
            item?.x >= searchArea?.x && item?.x < (searchArea?.x + searchArea?.width) &&
            item?.y >= searchArea?.y && item?.y < (searchArea?.y + searchArea?.height))


         // если нет рамок снизу 

         if (itemsFrameDown.length === 0) {
            state.Rectangels = state.Rectangels.map(item => {
               if (item.id === itemSelect.id) {
                  return { ...item, width: 0, height: 0, }
               } else if (item.id === itemSelect.frameID) {
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
            state.Rectangels = state.Rectangels.map(item => {
               if (item.id === itemSelect.id) {
                  return { ...item, width: 0, height: 0, }
               } else if (item.id === itemSelect.frameID) {
                  return { ...item, width: 0, height: 0, }
               }
               else if (itemsUp.includes(item) || itemsFrameUp.includes(item)) {
                  return { ...item, height: item.height + max.height + FRAME_SIZE, }
               } else {
                  return item
               }
            }).filter(item => !deleteRec.includes(item))

            state.verticalFrames = state.verticalFrames.filter(item_a => !deleteRec.some(item_B => item_a.id === item_B.id))
         }

      },
      DragStartHanger(state, action) {

         const { itemSelect } = action.payload

         state.elements = state.elements.map(item => {
            if (item.id === itemSelect.id) {
               return { ...item, width: 0, height: 0 }
            }
            else {
               return item
            }
         })
      },
      deleteRectangle(state, action) {
         const { id } = action.payload

         state.Rectangels = state.Rectangels.filter(item => item?.id !== id)
      },
      deleteElement(state, action) {
         const { id, type } = action.payload

         state.elements = state.elements.filter(item => item?.id !== id)

         if (type === 'drawer') {
            state.countBox = state.countBox - 1
         }
         if (type === 'hanger') {
            state.countHanger = state.countHanger - 1
         }
         if (type === 'element') {
            state.countBarbel = state.countBarbel - 1
         }
      },
      onBlurInputVertical(state, action) {

         let { value, containerDiv, wrap, itemSelect, height } = action.payload

         containerDiv.removeChild(wrap);


         const FrameDown = state.Rectangels.find(item => (

            ((item.y) === (itemSelect.y + height))
            &&
            ((item.x < itemSelect.x) && ((item.x + item.width) > (itemSelect.x + itemSelect.width))) && item.type === 'frame'
         )
         )
         const ShadowFrameDown = state.Rectangels.find(item => (

            ((item.y) === (itemSelect.y + height))
            &&
            ((item.x < itemSelect.x) && ((item.x + item.width) > (itemSelect.x + itemSelect.width))) && item.type === 'shadowframe'
         )
         )




         if (FrameDown !== undefined) {

            const itemsDown = state.Rectangels.filter(item => (
               (item.y === (FrameDown.y + FrameDown.height)) &&
               ((item.x >= FrameDown.x) && ((item.x + item.width) <= (FrameDown.x + FrameDown.width)))
            )
            )


            const itemsUp = state.Rectangels.filter(item => (
               ((item.y + item.height) === FrameDown.y) &&
               ((item.x >= FrameDown.x) && ((item.x + item.width) <= (FrameDown.x + FrameDown.width)))
            )
            )

            let changeValue = (value - 2) - height

            const minHeight = itemsDown?.reduce((acc, curr) => acc?.height < curr?.height ? acc : curr).height;


            if (itemSelect.height + changeValue < itemSelect.height + minHeight) {

               state.Rectangels = state.Rectangels.map(item => {
                  if (item.id === itemSelect.id) {
                     return { ...item, height: item.height + changeValue }
                  }
                  else if (itemsUp.includes(item)) {
                     return { ...item, height: item.height + changeValue, }
                  }
                  else if (itemsDown.includes(item)) {
                     return { ...item, y: item.y + changeValue, height: item.height - changeValue, }
                  }
                  else if (item.id === FrameDown.id) {
                     return { ...item, y: item.y + changeValue }
                  }
                  else if (item.id === ShadowFrameDown.id) {
                     return { ...item, y: item.y + changeValue }
                  }
                  else {
                     return item
                  }
               })


               state.horizontalFrames = state.horizontalFrames.map(item => {
                  if (item.id === FrameDown.id) {
                     return { ...item, y: item.y + changeValue }
                  }
                  else {
                     return item
                  }
               })
            }



         }

      },
      onBlurInputHorizontal(state, action) {


         let { value, containerDiv, wrap, itemSelect, width } = action.payload

         containerDiv.removeChild(wrap);

         const FrameRight = state.Rectangels.find(item => (
            ((item.x) === (itemSelect.x + width)) &&
            ((item.y < itemSelect.y) && ((item.y + item.height) > (itemSelect.y + itemSelect.height))) && item.type === 'frame'
         )
         )
         const ShadowFrameRight = state.Rectangels.find(item => (
            ((item.x) === (itemSelect.x + width)) &&
            ((item.y < itemSelect.y) && ((item.y + item.height) > (itemSelect.y + itemSelect.height))) && item.type === 'shadowframe'
         )
         )


         let changeValue = 0

         changeValue = (value - 2) - width

         if (FrameRight !== undefined) {


            const itemsRightFrame = state.Rectangels.filter(item => (
               (item.x === (FrameRight.x + FrameRight.width)) &&
               ((item.y >= FrameRight.y) && ((item.y + item.height) <= (FrameRight.y + FrameRight.height)))
            )
            )

            const itemsLeftFrame = state.Rectangels.filter(item => (
               ((item.x + item.width) === FrameRight.x) &&
               ((item.y >= FrameRight.y) && ((item.y + item.height) <= (FrameRight.y + FrameRight.height)))
            )
            )

            const minWidth = itemsRightFrame?.reduce((acc, curr) => acc?.width < curr?.width ? acc : curr).width;



            if (itemSelect.width + changeValue < itemSelect.width + minWidth) {

               state.Rectangels = state.Rectangels.map(item => {
                  if (itemsLeftFrame.includes(item)) {
                     return { ...item, width: item.width + changeValue, }
                  }
                  else if (itemsRightFrame.includes(item)) {
                     return { ...item, x: item.x + changeValue, width: item.width - changeValue, }
                  }
                  else if (item.id === FrameRight.id) {
                     return { ...item, x: item.x + changeValue }
                  }
                  else if (item.id === ShadowFrameRight.id) {
                     return { ...item, x: item.x + changeValue }
                  }
                  else {
                     return item
                  }
               })

               state.verticalFrames = state.verticalFrames.map(item => {

                  if (item.id === FrameRight.id) {
                     return { ...item, x: item.x + changeValue }
                  }
                  else {
                     return item
                  }
               })
            }
         }




         // если itemsRight пустой значит рамка стоит в упор к стенке

      },
      onBlurInputDrawer(state, action) {

         let { value, containerDiv, wrap, itemSelect, height } = action.payload

         containerDiv.removeChild(wrap);

         let changeValue = 0

         changeValue = value - height

         state.elements = state.elements.map(item => {
            if (item.id === itemSelect.id) {
               return { ...item, height: item.height + changeValue, copyHeight: item.copyHeight + changeValue }
            } else return item
         })


      },
      changeSizeWidthMain(state, action) {

         const { widthClosetChange, widthCloset, maxWidth, minWidth, widthLeftWall, lastFrame } = action.payload

         const lastItems = state.Rectangels.filter(item =>
            ((item.x + item.width) === ((widthCloset - 5) + widthLeftWall))
         )


         if (widthClosetChange > maxWidth) {

            state.Rectangels = state.Rectangels.map(item => {
               if (lastItems.includes(item)) {
                  return { ...item, width: item.width + (maxWidth / 5 - widthCloset) }
               } else {
                  return item
               }
            })

            state.mainBackRectangles = state.mainBackRectangles.map(item => {
               if (item?.changeType === 'up' || item?.changeType === 'down') {
                  item.points[2] = item.points[2] + (maxWidth / 5 - widthCloset)
                  item.points[4] = item.points[4] + (maxWidth / 5 - widthCloset)
                  return item
               } else if (item?.changeType === 'right') {
                  item.points[0] = item.points[0] + (maxWidth / 5 - widthCloset)
                  item.points[2] = item.points[2] + (maxWidth / 5 - widthCloset)
                  item.points[4] = item.points[4] + (maxWidth / 5 - widthCloset)
                  item.points[6] = item.points[6] + (maxWidth / 5 - widthCloset)
                  return item
               } else {
                  return { ...item, width: item.width + (maxWidth / 5 - widthCloset) }
               }
            })

         } else if (widthClosetChange < minWidth) {

            if ((widthClosetChange / 5) < lastFrame + 50) {

               state.Rectangels = state.Rectangels.map(item => {
                  if (lastItems.includes(item)) {
                     return { ...item, width: item.width + ((lastFrame + 50) - widthCloset) }
                  } else {
                     return item
                  }
               })
               state.mainBackRectangles = state.mainBackRectangles.map(item => {
                  if (item?.changeType === 'up' || item?.changeType === 'down') {
                     item.points[2] = item.points[2] + ((lastFrame + 50) - widthCloset)
                     item.points[4] = item.points[4] + ((lastFrame + 50) - widthCloset)
                     return item
                  } else if (item?.changeType === 'right') {
                     item.points[0] = item.points[0] + ((lastFrame + 50) - widthCloset)
                     item.points[2] = item.points[2] + ((lastFrame + 50) - widthCloset)
                     item.points[4] = item.points[4] + ((lastFrame + 50) - widthCloset)
                     item.points[6] = item.points[6] + ((lastFrame + 50) - widthCloset)
                     return item
                  } {
                     return { ...item, width: item.width + ((lastFrame + 50) - widthCloset) }
                  }
               })

            } else {

               state.Rectangels = state.Rectangels.map(item => {
                  if (lastItems.includes(item)) {
                     return { ...item, width: item.width + (minWidth / 5 - widthCloset) }
                  } else {
                     return item
                  }
               })
               state.mainBackRectangles = state.mainBackRectangles.map(item => {
                  if (item?.changeType === 'up' || item?.changeType === 'down') {
                     item.points[2] = item.points[2] + (minWidth / 5 - widthCloset)
                     item.points[4] = item.points[4] + (minWidth / 5 - widthCloset)
                     return item
                  } else if (item?.changeType === 'right') {
                     item.points[0] = item.points[0] + (minWidth / 5 - widthCloset)
                     item.points[2] = item.points[2] + (minWidth / 5 - widthCloset)
                     item.points[4] = item.points[4] + (minWidth / 5 - widthCloset)
                     item.points[6] = item.points[6] + (minWidth / 5 - widthCloset)
                     return item
                  } {
                     return { ...item, width: item.width + (minWidth / 5 - widthCloset) }
                  }
               })

            }
         } else {

            if ((widthClosetChange / 5) < lastFrame + 50) {
               state.Rectangels = state.Rectangels.map(item => {
                  if (lastItems.includes(item)) {
                     return { ...item, width: item.width + ((lastFrame + 50) - widthCloset) }
                  } else {
                     return item
                  }
               })
               state.mainBackRectangles = state.mainBackRectangles.map(item => {
                  if (item?.changeType === 'up' || item?.changeType === 'down') {
                     item.points[2] = item.points[2] + ((lastFrame + 50) - widthCloset)
                     item.points[4] = item.points[4] + ((lastFrame + 50) - widthCloset)
                     return item
                  } else if (item?.changeType === 'right') {
                     item.points[0] = item.points[0] + ((lastFrame + 50) - widthCloset)
                     item.points[2] = item.points[2] + ((lastFrame + 50) - widthCloset)
                     item.points[4] = item.points[4] + ((lastFrame + 50) - widthCloset)
                     item.points[6] = item.points[6] + ((lastFrame + 50) - widthCloset)
                     return item
                  } {
                     return { ...item, width: item.width + ((lastFrame + 50) - widthCloset) }
                  }
               })

            }
            else {
               state.Rectangels = state.Rectangels.map(item => {
                  if (lastItems.includes(item)) {
                     return { ...item, width: item.width + ((widthClosetChange / 5) - widthCloset) }
                  } else {
                     return item
                  }
               })

               state.mainBackRectangles = state.mainBackRectangles.map(item => {
                  if (item?.changeType === 'up' || item?.changeType === 'down') {
                     item.points[2] = item.points[2] + ((widthClosetChange / 5) - widthCloset)
                     item.points[4] = item.points[4] + ((widthClosetChange / 5) - widthCloset)
                     return item
                  } else if (item?.changeType === 'right') {
                     item.points[0] = item.points[0] + ((widthClosetChange / 5) - widthCloset)
                     item.points[2] = item.points[2] + ((widthClosetChange / 5) - widthCloset)
                     item.points[4] = item.points[4] + ((widthClosetChange / 5) - widthCloset)
                     item.points[6] = item.points[6] + ((widthClosetChange / 5) - widthCloset)
                     return item
                  } {
                     return { ...item, width: item.width + ((widthClosetChange / 5) - widthCloset) }
                  }
               })
            }


         }






      },
      changeSizeHeightMain(state, action) {

         const { heightCloset, heightClosetChange, maxHeight, minHeight, lastFrame } = action.payload


         const lastItems = state.Rectangels.filter(item =>
            ((item?.y + item.height) === heightCloset - 5)
         )



         if (heightClosetChange > maxHeight) {

            state.Rectangels = state.Rectangels.map(item => {
               if (lastItems.includes(item)) {
                  return { ...item, height: item.height + (600 - heightCloset) }
               } else {
                  return item
               }
            })

            state.mainBackRectangles = state.mainBackRectangles.map(item => {
               if (item?.changeType === 'right') {
                  item.points[5] = item.points[5] + (maxHeight / 5 - heightCloset)
                  item.points[7] = item.points[7] + (maxHeight / 5 - heightCloset)
                  return item
               } else if (item.changeType === 'down') {
                  item.points[1] = item.points[1] + (maxHeight / 5 - heightCloset)
                  item.points[3] = item.points[3] + (maxHeight / 5 - heightCloset)
                  item.points[5] = item.points[5] + (maxHeight / 5 - heightCloset)
                  item.points[7] = item.points[7] + (maxHeight / 5 - heightCloset)
                  return item
               } else if (item.changeType === 'left') {
                  item.points[5] = item.points[5] + (maxHeight / 5 - heightCloset)
                  item.points[7] = item.points[7] + (maxHeight / 5 - heightCloset)
                  return item
               } else {
                  return { ...item, height: item.height + (maxHeight / 5 - heightCloset) }
               }
            })





         } else if (heightClosetChange < minHeight) {
            if (heightClosetChange / 5 < lastFrame + 50) {

               state.Rectangels = state.Rectangels.map(item => {
                  if (lastItems.includes(item)) {
                     return { ...item, height: item.height + ((lastFrame + 50) - heightCloset) }
                  } else {
                     return item
                  }
               })
               state.mainBackRectangles = state.mainBackRectangles.map(item => {
                  if (item?.changeType === 'right') {
                     item.points[5] = item.points[5] + ((lastFrame + 50) - heightCloset)
                     item.points[7] = item.points[7] + ((lastFrame + 50) - heightCloset)
                     return item
                  } else if (item.changeType === 'down') {
                     item.points[1] = item.points[1] + ((lastFrame + 50) - heightCloset)
                     item.points[3] = item.points[3] + ((lastFrame + 50) - heightCloset)
                     item.points[5] = item.points[5] + ((lastFrame + 50) - heightCloset)
                     item.points[7] = item.points[7] + ((lastFrame + 50) - heightCloset)
                     return item
                  } else if (item.changeType === 'left') {
                     item.points[5] = item.points[5] + ((lastFrame + 50) - heightCloset)
                     item.points[7] = item.points[7] + ((lastFrame + 50) - heightCloset)
                     return item
                  } else {
                     return { ...item, height: item.height + ((lastFrame + 50) - heightCloset) }
                  }
               })
            } else {
               state.Rectangels = state.Rectangels.map(item => {
                  if (lastItems.includes(item)) {
                     return { ...item, height: item.height + (minHeight / 5 - heightCloset) }
                  } else {
                     return item
                  }
               })



               state.mainBackRectangles = state.mainBackRectangles.map(item => {
                  if (item?.changeType === 'right') {
                     item.points[5] = item.points[5] + (minHeight / 5 - heightCloset)
                     item.points[7] = item.points[7] + (minHeight / 5 - heightCloset)
                     return item
                  } else if (item.changeType === 'down') {
                     item.points[1] = item.points[1] + (minHeight / 5 - heightCloset)
                     item.points[3] = item.points[3] + (minHeight / 5 - heightCloset)
                     item.points[5] = item.points[5] + (minHeight / 5 - heightCloset)
                     item.points[7] = item.points[7] + (minHeight / 5 - heightCloset)
                     return item
                  } else if (item.changeType === 'left') {
                     item.points[5] = item.points[5] + (minHeight / 5 - heightCloset)
                     item.points[7] = item.points[7] + (minHeight / 5 - heightCloset)
                     return item
                  } else {
                     return { ...item, height: item.height + (minHeight / 5 - heightCloset) }
                  }
               })
            }



         } else {
            if (heightClosetChange / 5 < lastFrame + 50) {

               state.Rectangels = state.Rectangels.map(item => {
                  if (lastItems.includes(item)) {
                     return { ...item, height: item.height + ((lastFrame + 50) - heightCloset) }
                  } else {
                     return item
                  }
               })
               state.mainBackRectangles = state.mainBackRectangles.map(item => {
                  if (item?.changeType === 'right') {
                     item.points[5] = item.points[5] + ((lastFrame + 50) - heightCloset)
                     item.points[7] = item.points[7] + ((lastFrame + 50) - heightCloset)
                     return item
                  } else if (item.changeType === 'down') {
                     item.points[1] = item.points[1] + ((lastFrame + 50) - heightCloset)
                     item.points[3] = item.points[3] + ((lastFrame + 50) - heightCloset)
                     item.points[5] = item.points[5] + ((lastFrame + 50) - heightCloset)
                     item.points[7] = item.points[7] + ((lastFrame + 50) - heightCloset)
                     return item
                  } else if (item.changeType === 'left') {
                     item.points[5] = item.points[5] + ((lastFrame + 50) - heightCloset)
                     item.points[7] = item.points[7] + ((lastFrame + 50) - heightCloset)
                     return item
                  } else {
                     return { ...item, height: item.height + ((lastFrame + 50) - heightCloset) }
                  }
               })
            } else {

               state.Rectangels = state.Rectangels.map(item => {
                  if (lastItems.includes(item)) {
                     return { ...item, height: item.height + (heightClosetChange / 5 - heightCloset) }
                  } else {
                     return item
                  }
               })
               state.mainBackRectangles = state.mainBackRectangles.map(item => {
                  if (item?.changeType === 'right') {
                     item.points[5] = item.points[5] + ((heightClosetChange / 5) - heightCloset)
                     item.points[7] = item.points[7] + ((heightClosetChange / 5) - heightCloset)
                     return item
                  } else if (item.changeType === 'down') {
                     item.points[1] = item.points[1] + ((heightClosetChange / 5) - heightCloset)
                     item.points[3] = item.points[3] + ((heightClosetChange / 5) - heightCloset)
                     item.points[5] = item.points[5] + ((heightClosetChange / 5) - heightCloset)
                     item.points[7] = item.points[7] + ((heightClosetChange / 5) - heightCloset)
                     return item
                  } else if (item.changeType === 'left') {
                     item.points[5] = item.points[5] + ((heightClosetChange / 5) - heightCloset)
                     item.points[7] = item.points[7] + ((heightClosetChange / 5) - heightCloset)
                     return item
                  } else {
                     return { ...item, height: item.height + (heightClosetChange / 5 - heightCloset) }
                  }
               })
            }
         }
      },
      changeHorizontalFrames(state, action) {

         const { itemSelect, value, valueInput } = action.payload


         const itemsDown = state.Rectangels.filter(item => (
            (item.x >= itemSelect.x && ((item.x + item.width) <= (itemSelect.x + itemSelect.width))) &&
            (item.y === (itemSelect.y + itemSelect.height))
         )
         )

         const itemsUp = state.Rectangels.filter(item => (
            (item.x >= itemSelect.x && ((item.x + item.width) <= (itemSelect.x + itemSelect.width))) &&
            ((item.y + item.height) === itemSelect.y)
         )
         )




         state.Rectangels = state.Rectangels.map(item => {
            if (item.id === itemSelect.id) {
               return { ...item, y: item.y + ((valueInput / 5) - value) }
            } else if (item.id === itemSelect.shadowFrameId) {
               return { ...item, y: item.y + ((valueInput / 5) - value) }
            }
            else if (itemsUp.includes(item)) {
               return { ...item, height: item.height + ((valueInput / 5) - value), }
            }
            else if (itemsDown.includes(item)) {
               return { ...item, y: item.y + ((valueInput / 5) - value), height: item.height - ((valueInput / 5) - value), }
            }
            else {
               return item
            }
         })

         state.horizontalFrames = state.horizontalFrames.map(item => {
            if (item.id === itemSelect.id) {
               return { ...item, y: item.y + ((valueInput / 5) - value) }
            } else if (item.id === itemSelect.shadowFrameId) {
               return { ...item, y: item.y + ((valueInput / 5) - value) }
            }
            else {
               return item
            }
         })

      },
      changeVerticalFrames(state, action) {

         const { itemSelect, value, valueInput, widthLeftWall } = action.payload

         const itemsLeft = state.Rectangels.filter(item => (
            (item.y >= itemSelect.y && ((item.y + item.height) <= (itemSelect.y + itemSelect.height))) &&
            ((item.x + item.width) === (itemSelect.x + widthLeftWall))
         )
         )

         const itemsRight = state.Rectangels.filter(item => (
            (item.y >= itemSelect.y && ((item.y + item.height) <= (itemSelect.y + itemSelect.height))) &&
            (item.x === ((itemSelect.x + widthLeftWall) + itemSelect.width))
         )
         )

         state.Rectangels = state.Rectangels.map(item => {
            if (item.id === itemSelect.id) {
               return { ...item, x: item.x + ((valueInput / 5) - value) }
            } else if (item.id === itemSelect.shadowFrameId) {
               return { ...item, x: item.x + ((valueInput / 5) - value) }
            }
            else if (itemsLeft.includes(item)) {
               return { ...item, width: item.width + ((valueInput / 5) - value), }
            }
            else if (itemsRight.includes(item)) {
               return { ...item, x: item.x + ((valueInput / 5) - value), width: item.width - ((valueInput / 5) - value), }
            }
            else {
               return item
            }
         })

         state.verticalFrames = state.verticalFrames.map(item => {
            if (item.id === itemSelect.id) {
               return { ...item, x: item.x + ((valueInput / 5) - value) }
            } else if (item.id === itemSelect.shadowFrameId) {
               return { ...item, x: item.x + ((valueInput / 5) - value) }
            }
            else {
               return item
            }
         })
      },
      changeColorMain(state, action) {

         const { mainColor, texture, LeftInside, RightInside, DownVisable, UpVisable } = action.payload


         state.mainBackRectangles = state.mainBackRectangles.map(item => {
            if (item.colorType !== 'shadow') {
               if (item.changeType === 'left' && LeftInside) {
                  item.fill = mainColor
                  item.texture = null
                  return item
               } else if (item.changeType === 'right' && RightInside) {
                  item.fill = mainColor
                  item.texture = null
                  return item
               } else if (item.changeType === 'down' && DownVisable) {
                  item.fill = mainColor
                  item.texture = null
                  return item
               } else if (item.changeType === 'main') {
                  item.fill = mainColor
                  item.texture = null
                  return item
               } else if (item.changeType === 'up' && UpVisable) {
                  item.fill = mainColor
                  item.texture = null
                  return item
               } else if (item.changeType === 'frame') {
                  item.fill = mainColor
                  item.texture = null
                  return item
               }


            } return item
         })

         state.Rectangels = state.Rectangels.map(item => {
            if (item?.type === 'frame') {
               item.color = mainColor
               item.texture = null
               return item
            } else return item
         })

         state.colorMain = mainColor
         state.selectedTextura = texture
         state.TextureMain = null
      },
      changeTextureMain(state, action) {

         const { value, texture, LeftInside, RightInside, DownVisable, UpVisable } = action.payload


         let mainTexture = null

         if (value !== '0') {
            mainTexture = `http://127.0.0.1:8000/${value}`
         } else {
            mainTexture = null
         }


         state.mainBackRectangles = state.mainBackRectangles.map(item => {

            if (item.colorType !== 'shadow') {
               if (item.changeType === 'left' && LeftInside) {
                  item.texture = mainTexture
                  return item
               } else if (item.changeType === 'right' && RightInside) {
                  item.texture = mainTexture
                  return item
               } else if (item.changeType === 'down' && DownVisable) {
                  item.texture = mainTexture
                  return item
               } else if (item.changeType === 'main') {
                  item.texture = mainTexture
                  return item
               } else if (item.changeType === 'up' && UpVisable) {
                  item.texture = mainTexture
                  return item
               } else if (item.changeType === 'frame') {
                  item.texture = mainTexture
                  return item
               }


            } return item


         })

         state.Rectangels = state.Rectangels.map(item => {
            if (item?.type === 'frame') {
               item.texture = mainTexture
               return item
            } else return item
         })

         state.TextureMain = mainTexture

         state.selectedTextura = texture


      },
      changeVisionMainWall(state, action) {
         const { value } = action.payload

         state.mainVisible = value

         if (value === false) {
            state.mainBackRectangles = state.mainBackRectangles.map(item => {
               if (item.type === 'backWall' && item.colorType !== 'shadow') {
                  item.fill = 'white'
                  return item
               } if (item.colorType === 'shadow' && item.type === 'backWallShadow') {
                  item.opacity = 0
                  return item
               } else return item
            })
         } else {
            state.mainBackRectangles = state.mainBackRectangles.map(item => {
               if (item.type === 'backWall' && item.colorType !== 'shadow') {
                  item.fill = state.colorMain
                  return item
               } if (item.colorType === 'shadow' && item.type === 'backWallShadow') {
                  item.opacity = 0.2
                  return item
               } else return item
            })
         }
      },
      changeSizeMainWall(state, action) {

         const { changeValue } = action.payload

         state.Rectangels = state.Rectangels.map(item => {
            return { ...item, x: item.x + changeValue }
         })

         state.mainBackRectangles = state.mainBackRectangles.map(item => {
            if (item?.changeType === 'right' || item.changeType === 'left' || item.changeType === 'up' || item.changeType === 'down') {
               item.points[0] = item.points[0] + (changeValue)
               item.points[2] = item.points[2] + (changeValue)
               item.points[4] = item.points[4] + (changeValue)
               item.points[6] = item.points[6] + (changeValue)
               return item
            } else {
               return { ...item, x: item.x + changeValue }
            }
         })

         state.elements = state.elements.map(item => {
            return { ...item, x: item.x + changeValue }
         })
      },
      changeWallInside(state, action) {

         const { value, type } = action.payload


         if (!value) {
            state.mainBackRectangles = state.mainBackRectangles.map(item => {
               if (item.changeType === type) {
                  return { ...item, fill: 'gray', texture: null }
               } else return item
            })
         } else {
            state.mainBackRectangles = state.mainBackRectangles.map(item => {
               if (item.changeType === type) {
                  if (state.TextureMain !== null) {
                     item.texture = state.TextureMain
                     item.fill = null
                  } else {
                     item.fill = state.colorMain
                     item.texture = null
                  }
                  return item
               } else return item
            })
         }


      },
      changeVisibableUp(state, action) {

         const { value } = action.payload

         state.upVisible = value

         if (!value) {
            state.mainBackRectangles = state.mainBackRectangles.map(item => {


               switch (item.changeType) {
                  case 'up':
                     item.fill = 'white'
                     item.texture = null
                     item.points[1] = item.points[1] - 5
                     item.points[3] = item.points[3] - 5
                     item.points[5] = item.points[5] - 5
                     item.points[7] = item.points[7] - 5
                     return item

                  case 'left':
                     item.points[1] = item.points[1] - 5
                     item.points[3] = item.points[3] - 5
                     return item

                  case 'right':
                     item.points[1] = item.points[1] - 5
                     item.points[3] = item.points[3] - 5
                     return item
                  case 'main':
                     item.y = item.y - 5
                     item.height = item.height + 5
                     return item
                  default:
                     return item
               }


            })
         } else {
            state.mainBackRectangles = state.mainBackRectangles.map(item => {


               switch (item.changeType) {
                  case 'up':
                     if (state.TextureMain !== null) {
                        item.texture = state.TextureMain
                        item.fill = null
                     } else {
                        item.fill = state.colorMain
                        item.texture = null
                     }
                     item.points[1] = item.points[1] + 5
                     item.points[3] = item.points[3] + 5
                     item.points[5] = item.points[5] + 5
                     item.points[7] = item.points[7] + 5
                     return item

                  case 'left':
                     item.points[1] = item.points[1] + 5
                     item.points[3] = item.points[3] + 5
                     return item

                  case 'right':
                     item.points[1] = item.points[1] + 5
                     item.points[3] = item.points[3] + 5
                     return item
                  case 'main':
                     item.y = item.y + 5
                     item.height = item.height - 5
                     return item
                  default:
                     return item

               }

            })
         }

      },
      changeVisibableDown(state, action) {

         const { value } = action.payload

         state.downVisible = value
         if (!value) {

            state.mainBackRectangles = state.mainBackRectangles.map(item => {


               switch (item.changeType) {
                  case 'down':
                     item.fill = 'white'
                     item.texture = null
                     item.points[1] = item.points[1] + (5 + 14.2)
                     item.points[3] = item.points[3] + (5 + 14.2)
                     item.points[5] = item.points[5] + (5 + 14.2)
                     item.points[7] = item.points[7] + (5 + 14.2)
                     return item

                  case 'left':
                     item.points[5] = item.points[5] + (5 + 14.2)
                     item.points[7] = item.points[7] + (5 + 14.2)
                     return item

                  case 'right':
                     item.points[5] = item.points[5] + (5 + 14.2)
                     item.points[7] = item.points[7] + (5 + 14.2)
                     return item
                  case 'main':

                     item.height = item.height + (5 + 14.2)
                     return item
                  default:
                     return item
               }


            })
         } else {
            state.mainBackRectangles = state.mainBackRectangles.map(item => {
               switch (item.changeType) {
                  case 'down':
                     if (state.TextureMain !== null) {
                        item.texture = state.TextureMain
                        item.fill = null
                     } else {
                        item.fill = state.colorMain
                        item.texture = null
                     }

                     item.points[1] = item.points[1] - (5 + 14.2)
                     item.points[3] = item.points[3] - (5 + 14.2)
                     item.points[5] = item.points[5] - (5 + 14.2)
                     item.points[7] = item.points[7] - (5 + 14.2)
                     return item

                  case 'left':
                     item.points[5] = item.points[5] - (5 + 14.2)
                     item.points[7] = item.points[7] - (5 + 14.2)
                     return item

                  case 'right':
                     item.points[5] = item.points[5] - (5 + 14.2)
                     item.points[7] = item.points[7] - (5 + 14.2)
                     return item
                  case 'main':
                     item.height = item.height - (5 + 14.2)
                     return item
                  default:
                     return item

               }

            })
         }

      },
      checkIntercetion(state, action) {

         const { element } = action.payload



         // state.Rectangels.filter(item => item.type === 'frame').forEach(item => {
         //    state.intersection = checkPlaneIntersection(element.x, element.y, element.width, element.height, item.x, item.y, item.width, item.height)

         // })


      },
      newImage(state,action){
         const {image}=action.payload

         state.srcMainImage=image
      }
   },

});



export default mainRectanglesSlice.reducer;
export const { createVertical, createHorizontal, createNewBurb,
   DragStarVertical, DragStarHorizontal,
   deleteRectangle, onBlurInputVertical,
   onBlurInputHorizontal, changeSizeWidthMain,
   changeSizeHeightMain,
   changeHorizontalFrames,
   changeVerticalFrames,
   changeColorMain, changeVisionMainWall,
   changeTextureMain,
   changeSizeMainWall, DragStarElement,
   createHanger, createSideHanger,
   DragStartHanger, deleteElement,
   createDrawer, onBlurInputDrawer,
   changeWallInside, changeVisibableUp,
   checkIntercetion, changeVisibableDown,
   newImage
} = mainRectanglesSlice.actions;


