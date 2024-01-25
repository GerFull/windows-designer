import React, { useEffect, useRef, useState } from "react";
import { Provider } from "mobx-react";
import { Stage, Layer, Rect, Group, Line, Ellipse } from "react-konva";
import { observer, inject } from "mobx-react";
import style from '../css/RootFrame.module.scss'

import Metrics from "./Metrics";



const FRAME_SIZE = 5;




function id() {
  return Math.round(Math.random() * 10000);
}

// делать минус 100 так как layer сдвинули на 100 по x и y
// баг с input выделение с выходом за пределы 
// придумать ограничение чтоб смещенеие не уходило за пределы прямугольник справа
// 1 пиксель 5мм
// вертикальные полки нельзя ставить на боковины
// сделать визуал

function RootFrame(props) {


  const stageRef = useRef(null)

  // const [Rectangels, setRectangels] = useState([

  //   { id: 1, width: 300, height: 129, x: 0+150, y: 0 },
  //   { id: 2, width: 300, height: FRAME_SIZE, x: 0+150, y: 129, color: 'white', type: 'frame', draggable: true, derection: 2 },
  //   { id: 3, width: 300, height: 661, x: 0+150, y: 139 },

  //   { id: 4, width: 300, height: 284, x: 310+150, y: 0 },
  //   { id: 5, width: 300, height: FRAME_SIZE, x: 310+150, y: 284, color: 'white', type: 'frame', draggable: true, derection: 2 },
  //   { id: 6, width: 300, height: 506, x: 310+150, y: 294 },


  //   { id: 7, width: 300, height: 532, x: 620+150, y: 0 },
  //   { id: 8, width: 300, height: FRAME_SIZE, x: 620+150, y: 532, color: 'white', type: 'frame', draggable: true, derection: 2 },
  //   { id: 9, width: 300, height: 258, x: 620+150, y: 542 },

  //   { id: 10, width: FRAME_SIZE, height: 800, x: 300+150, y: 0, color: 'white', type: 'frame', draggable: true, derection: 1 },
  //   { id: 11, width: FRAME_SIZE, height: 800, x: 610+150, y: 0, color: 'white', type: 'frame', draggable: true, derection: 1 },
  //   { id: 12, width: FRAME_SIZE, height: 800, x: 920+150, y: 0, color: 'white', type: 'frame', draggable: true, derection: 1 },
  //   { id: 13, width: 70, height: 800, x: 930+150, y: 0 },
  // ])



  const [widthCloset, setWidthCloset] = useState(1000)
  const [widthClosetChange, setWidthClosetChange] = useState(widthCloset * 5)
  const [heightCloset, setHeightCloset] = useState(600)
  const [heightClosetChange, setHeightClosetChange] = useState(heightCloset * 5)

  const [widthLeftWall, setWidthLeftWall] = useState(100)
  const [widthLeftWallChange, setWidthLeftWallChange] = useState(widthLeftWall * 5)

  const [widthRightWall, setWidthRightWall] = useState(100)
  const [widthRightWallChange, setWidthRightWallChange] = useState(widthRightWall * 5)


  const [Rectangels, setRectangels] = useState([
    { id: 1, width: 980, height: heightCloset - 20, x: 110, y: 10 },
  ])

  const [leftRectangels, setLeftRectangels] = useState([
    { id: 20, width: widthLeftWall, height: heightCloset - 60, x: 0, y: 30 },
  ])

  const [RightRectangels, setRightRectangels] = useState([
    { id: 40, width: widthRightWall, height: heightCloset - 60, x: widthLeftWall + widthCloset, y: 30 },
  ])

  // const [verticalFrames, setVerticalFrames] = useState([
  //   { id: 10, width: FRAME_SIZE, height: 800, x: 300, y: 0, color: 'white', type: 'frame', draggable: true, derection: 1 },
  //   { id: 11, width: FRAME_SIZE, height: 800, x: 610, y: 0, color: 'white', type: 'frame', draggable: true, derection: 1 },
  //   { id: 12, width: FRAME_SIZE, height: 800, x: 920, y: 0, color: 'white', type: 'frame', draggable: true, derection: 1 },

  // ])

  // const [horizontalFrames, setHorizontalFrames] = useState([
  //   { id: 2, width: 300, height: FRAME_SIZE, x: 150, y: 129, color: 'white', type: 'frame', draggable: true, derection: 2 },
  //   { id: 5, width: 300, height: FRAME_SIZE, x: 310+150, y: 284, color: 'white', type: 'frame', draggable: true, derection: 2 },
  //   { id: 8, width: 300, height: FRAME_SIZE, x: 620+150, y: 532, color: 'white', type: 'frame', draggable: true, derection: 2 }
  // ])

  const [verticalFrames, setVerticalFrames] = useState([])

  const [horizontalFrames, setHorizontalFrames] = useState([])

  const [horizontalLeftFrames, setHorizontalLeftFrames] = useState([])
  const [horizontalRightFrames, setHorizontalRightFrames] = useState([])

  const [colorMain, setColorMain] = useState('#efcf9f')
  const [colorFrame, setColorFrame] = useState('#f4cb8d')
  const [colorValue, setColorValue] = useState(0)


  const [leftBackRectangles, setLeftBackRectangles] = useState([
    { x: 100, y: 30, fill: colorFrame, radiusX: 100, radiusY: 30, type: 'line', colorType: 'frame' },
    { x: 100, y: 34, fill: colorMain, radiusX: 100, radiusY: 25, type: 'line', colorType: 'main' },


    { x: 100, y: heightCloset - 30, fill: colorFrame, radiusX: 100, radiusY: 30, type: 'line', changeType: 'down', colorType: 'frame' },
    { x: 100, y: heightCloset - 34, fill: colorMain, radiusX: 100, radiusY: 25, type: 'line', changeType: 'down', colorType: 'main' },

    { x: 0, y: 30, width: widthLeftWall, height: heightCloset - 60, fill: colorMain, colorType: 'main' },
  ])

  const [mainBackRectangles, setMainBackRectabgles] = useState([
    { width: 1000, height: heightCloset, x: 100, y: 0, fill: colorFrame, colorType: 'frame' },

    { points: [110, 10, 210, 30, 210, heightCloset - 30, 110, heightCloset - 10], fill: colorMain, type: 'line', changeType: 'left', colorType: 'main' },

    {
      points: [110, 10,
        110 + (widthCloset - 20), 10,
        110 + (widthCloset - 20 - 100), 30,
        210, 30],
      fill: colorMain, type: 'line',
      changeType: 'up',
      colorType: 'main'
    },

    {
      points: [
        110 + (widthCloset - 20 - 100), 30,
        110 + (widthCloset - 20), 10,
        110 + (widthCloset - 20), heightCloset - 10,
        110 + (widthCloset - 20 - 100), heightCloset - 30], fill: colorMain, type: 'line',
      changeType: 'right',
      colorType: 'main'
    },

    {
      points: [
        210, heightCloset - 30,
        110 + (widthCloset - 20 - 100), heightCloset - 30,
        210 + (widthCloset - 20 - 100), heightCloset - 10,
        110, heightCloset - 10], fill: colorMain, type: 'line',
      changeType: 'down',
      colorType: 'main'
    }
  ])

  const [rightBackRectangles, setRightBackRectangles] = useState([
    { x: widthCloset + widthRightWall, y: 30, fill: colorFrame, radiusX: 100, radiusY: 30, type: 'line', colorType: 'frame' },
    { x: widthCloset + widthRightWall, y: 34, fill: colorMain, radiusX: 100, radiusY: 25, type: 'line', colorType: 'main' },


    { x: widthCloset + widthRightWall, y: heightCloset - 30, fill: colorFrame, radiusX: 100, radiusY: 30, type: 'line', changeType: 'down', colorType: 'frame' },
    { x: widthCloset + widthRightWall, y: heightCloset - 34, fill: colorMain, radiusX: 100, radiusY: 25, type: 'line', changeType: 'down', colorType: 'main' },


    { x: widthCloset + widthLeftWall, y: 30, width: widthRightWall, height: heightCloset - 60, fill: colorMain, colorType: 'main' },
  ])

  const [LeftWall, setLeftWall] = useState(true)
  const [RightWall, setRightWall] = useState(true)

  const LayerRef = useRef(null)
  const [selectedRectId, setSelectedRectId] = useState(null)
  const [derection, setDerection] = useState(null)


  const colors = [{
    mainColor: '#efcf9f',
    frameColor: '#f4cb8d'
  },
  {
    mainColor: 'white',
    frameColor: '#c2c0c0'
  },
  {
    mainColor: '#3d6990',
    frameColor: '#757dd1'
  }
  ]



  const drop = (e) => {

    e.preventDefault();

    console.log(selectedRectId)

    if (selectedRectId !== null) {
      if (Rectangels.includes(selectedRectId)) {
        if (derection === '1') {
          createVertical(e.layerX - 100, e.layerY - 100)
        }
        if (derection === '2') {
          createHorizontal(e.layerX - 100, e.layerY - 100)
        }
      } else if (leftRectangels.includes(selectedRectId)) {

        createHorizontalLeft(e.layerX - 100, e.layerY - 100)
      } else if (RightRectangels) {
        createHorizontalRight(e.layerX - 100, e.layerY - 100)
      }



      setSelectedRectId(null)

    }


  }


  const dragover = (e) => {



    e.preventDefault();
    const x = e.layerX - 100
    const y = e.layerY - 100
    props.store.mousePosition(x, y);

    const newArr = [...Rectangels, ...leftRectangels, ...RightRectangels]

    const item = newArr.filter(item => (
      (x > item.x && x < (item.x + item.width)) &&
      (y > item.y && y < (item.y + item.height)) && item?.type !== 'frame'
    )
    )[0]

    if (item !== undefined) {

      setSelectedRectId(item)

    } else setSelectedRectId(null)




  }


  useEffect(() => {



    const con = stageRef.current.container()
    con.addEventListener('dragover', dragover)

    con.addEventListener('drop', drop)

    return () => {
      con.removeEventListener('dragover', dragover)
      con.removeEventListener('drop', drop)
    }

  }, [Rectangels, derection, selectedRectId, leftRectangels, RightRectangels])


  const onDragEndMain = (x, y, id, derection) => {


    if ((x > 100 && x < 100 + widthCloset) && (y > 0 && y < y + heightCloset)) {
      if (derection === 1) {
        createVertical(x, y, id)
      } else {
        createHorizontal(x, y, id)
      }
    } else {
      setRectangels(Rectangels.filter(item => item?.id !== id))

    }



  }

  const onDragEndLeft = (x, y, id) => {


    if ((x > 0 && x < widthLeftWall) && (y > 20 && y < y + heightCloset - 20)) {

      createHorizontalLeft(x, y, id)

    } else {
      setLeftRectangels(leftRectangels.filter(item => item?.id !== id))

    }



  }

  const onDragEndRight = (x, y, id) => {


    if ((x > widthLeftWall + widthCloset && x < widthLeftWall + widthCloset + widthLeftWall) && (y > 20 && y < y + heightCloset - 20)) {

      createHorizontalRight(x, y, id)

    } else {
      setRightRectangels(RightRectangels.filter(item => item?.id !== id))

    }



  }



  const createVertical = (xk, yk, idd) => {

    const idFrame = id()

    const itemSelect = Rectangels.filter(item => ((xk > item.x && xk < (item.x + item.width)) &&
      (yk > item.y && yk < (item.y + item.height))))[0]


    const newsect = [...Rectangels.filter(item => item.id !== itemSelect?.id).filter(item => item?.id !== idd),
    { id: id(), width: xk - itemSelect?.x, height: itemSelect?.height, x: itemSelect?.x, y: itemSelect?.y },
    { id: idFrame, width: FRAME_SIZE, height: itemSelect.height, color: colorFrame, x: xk, y: itemSelect?.y, type: 'frame', draggable: true, derection: 1 },
    { id: id(), width: itemSelect.width - (xk - itemSelect.x) - FRAME_SIZE, height: itemSelect?.height, x: xk + FRAME_SIZE, y: itemSelect?.y }]


    setVerticalFrames([...verticalFrames,
    { id: idFrame, width: FRAME_SIZE, height: itemSelect.height, color: colorFrame, x: xk - widthLeftWall, y: itemSelect?.y, type: 'frame', draggable: true, derection: 1 }])

    setRectangels(newsect)
  }

  const createHorizontal = (xk, yk, idd) => {

    const idFrame = id()

    const itemSelect = Rectangels.filter(item => ((xk > item.x && xk < (item.x + item.width)) &&
      (yk > item.y && yk < (item.y + item.height))))[0]


    const newsect = [...Rectangels.filter(item => item.id !== itemSelect?.id).filter(item => item?.id !== idd),
    { id: id(), width: itemSelect.width, height: yk - itemSelect?.y, x: itemSelect?.x, y: itemSelect?.y },
    { id: idFrame, width: itemSelect.width, height: FRAME_SIZE, color: colorFrame, x: itemSelect?.x, y: yk, type: 'frame', draggable: true, derection: 2 },
    { id: id(), width: itemSelect.width, height: itemSelect?.height - (yk - itemSelect?.y) - FRAME_SIZE, x: itemSelect?.x, y: yk + FRAME_SIZE }]


    setHorizontalFrames([...horizontalFrames,
    { id: idFrame, width: itemSelect.width, height: FRAME_SIZE, color: colorFrame, x: itemSelect?.x, y: yk, type: 'frame', draggable: true, derection: 2 }])


    setRectangels(newsect)
  }

  const createHorizontalLeft = (xk, yk, idd) => {

    const idFrame = id()

    const itemSelect = leftRectangels.filter(item => ((xk > item.x && xk < (item.x + item.width)) &&
      (yk > item.y && yk < (item.y + item.height))))[0]


    const newsect = [...leftRectangels.filter(item => item.id !== itemSelect?.id).filter(item => item?.id !== idd),
    { id: id(), width: itemSelect.width, height: yk - itemSelect?.y, x: itemSelect?.x, y: itemSelect?.y },
    { id: idFrame, width: itemSelect.width, height: FRAME_SIZE, color: colorFrame, x: itemSelect?.x, y: yk, type: 'frame', draggable: true, derection: 2 },
    { id: id(), width: itemSelect.width, height: itemSelect?.height - (yk - itemSelect?.y) - FRAME_SIZE, x: itemSelect?.x, y: yk + FRAME_SIZE }]


    setHorizontalLeftFrames([...horizontalLeftFrames,
    { id: idFrame, width: itemSelect.width, height: FRAME_SIZE, color: colorFrame, x: itemSelect?.x, y: yk, type: 'frame', draggable: true, derection: 2 }])


    setLeftRectangels(newsect)
  }

  const createHorizontalRight = (xk, yk, idd) => {

    const idFrame = id()

    const itemSelect = RightRectangels.filter(item => ((xk > item.x && xk < (item.x + item.width)) &&
      (yk > item.y && yk < (item.y + item.height))))[0]


    const newsect = [...RightRectangels.filter(item => item.id !== itemSelect?.id).filter(item => item?.id !== idd),
    { id: id(), width: itemSelect.width, height: yk - itemSelect?.y, x: itemSelect?.x, y: itemSelect?.y },
    { id: idFrame, width: itemSelect.width, height: FRAME_SIZE, color: colorFrame, x: itemSelect?.x, y: yk, type: 'frame', draggable: true, derection: 2 },
    { id: id(), width: itemSelect.width, height: itemSelect?.height - (yk - itemSelect?.y) - FRAME_SIZE, x: itemSelect?.x, y: yk + FRAME_SIZE }]


    setHorizontalRightFrames([...horizontalRightFrames,
    { id: idFrame, width: itemSelect.width, height: FRAME_SIZE, color: colorFrame, x: itemSelect?.x, y: yk, type: 'frame', draggable: true, derection: 2 }])


    setRightRectangels(newsect)
  }

  const handleClick = (e) => {
    console.log('click')
  };


  const DragStarVertical = (itemSelect) => {


    setVerticalFrames(verticalFrames.filter(item => item.id !== itemSelect.id))


    // рамки справа
    const itemsFrameRight = Rectangels.filter(item => (
      (item.y > itemSelect.y && (item.y + item.height) < (itemSelect.y + itemSelect.height))
      &&
      ((item.x) === itemSelect.x + itemSelect.width) && item?.type === 'frame'
    )
    )

    // прямоугольники справа
    const itemsRight = Rectangels.filter(item => (
      (itemSelect.y + 2 > item.y && itemSelect.y + 2 < (item.y + item.height)) &&
      (itemSelect.x + 2 + FRAME_SIZE > item.x && itemSelect.x + FRAME_SIZE + 2 < (item.x + item.width)) && item?.type !== 'frame'
    )
    )[0]


    // прямоугольники слева
    const itemsLeft = Rectangels.filter(item =>
      (item.y >= itemSelect.y) && ((item.y + item.height) <= (itemSelect.y + itemSelect.height)) &&
      ((item.x + item.width) === itemSelect.x) &&

      item?.type !== 'frame'
    )

    // рамки слева
    const itemsFrameLeft = Rectangels.filter(item => (
      (item.y > itemSelect.y && (item.y + item.height) < (itemSelect.y + itemSelect.height))
      &&
      ((item.x + item.width) === itemSelect.x) && item?.type === 'frame'
    )
    )

    // максимальная ширина рамки справа
    const max = itemsFrameRight.length > 0 && itemsFrameRight?.reduce((acc, curr) => acc?.width > curr?.width ? acc : curr);


    // область поиска в которой ищется все, что нужно удалить
    const searchArea = { x: itemSelect.x + FRAME_SIZE, y: itemSelect.y, width: max.width, height: itemSelect.height }


    const deleteRec = Rectangels.filter(item =>
      item?.x >= searchArea?.x && item?.x < (searchArea?.x + searchArea?.width) &&
      item?.y >= searchArea?.y && item?.y < (searchArea?.y + searchArea?.height))



    // если рамки справа нету

    if (itemsFrameRight.length === 0) {
      setRectangels(Rectangels.map(item => {
        if (item.id === itemSelect.id) {
          return { ...item, width: 0, height: 0, }
        }
        else if (itemsFrameLeft.includes(item) || itemsLeft.includes(item)) {
          return { ...item, width: item.width + FRAME_SIZE + itemsRight.width }
        } else {
          return item
        }
      }).filter(item => item.id !== itemsRight.id))

    }
    else {

      // если рамка справа есть 
      setRectangels(Rectangels.map(item => {
        if (item.id === itemSelect.id) {
          return { ...item, width: 0, height: 0, }
        }
        else if (itemsFrameLeft.includes(item) || itemsLeft.includes(item)) {
          return { ...item, width: item.width + max.width + FRAME_SIZE, }
        } else {
          return item
        }
      }).filter(item => !deleteRec.includes(item)))

      setHorizontalFrames(horizontalFrames.filter(item => deleteRec.includes(item)))
    }

  }


  const DragStarHorizontal = (itemSelect) => {

    // переделать поиск не из всех прямугольников, а только этой области

    setHorizontalFrames(horizontalFrames.filter(item => item.id !== itemSelect.id))

    // рамки внизу
    const itemsFrameDown = Rectangels.filter(item => (
      (item.x > itemSelect.x && (item.x + item.width) < (itemSelect.x + itemSelect.width))
      &&
      ((item.y) === itemSelect.y + itemSelect.height) && item?.type === 'frame'
    )
    )

    // прямоугольник внизу
    const itemDown = Rectangels.filter(item => (
      (itemSelect.x + 2 > item.x && itemSelect.x + 2 < (item.x + item.width)) &&
      (itemSelect.y + 2 + FRAME_SIZE > item.y && itemSelect.y + FRAME_SIZE + 2 < (item.y + item.height)) && item?.type !== 'frame'
    )
    )[0]

    // прямоугольнику вверху
    const itemsUp = Rectangels.filter(item => (item.x >= itemSelect.x) && ((item.x + item.width) <= (itemSelect.x + itemSelect.width)) &&
      ((item.y + item.height) === itemSelect.y) &&

      item?.type !== 'frame'
    )

    // рамки вверху
    const itemsFrameUp = Rectangels.filter(item => (
      (item.x > itemSelect.x && (item.x + item.width) < (itemSelect.x + itemSelect.width))
      &&
      ((item.y + item.height) === itemSelect.y) && item?.type === 'frame'
    )
    )

    // максимальная высота рамки снизу
    const max = itemsFrameDown.length > 0 && itemsFrameDown?.reduce((acc, curr) => acc?.height > curr?.height ? acc : curr);


    // область поиска в которой ищутся все, что нужно удалить
    const searchArea = { x: itemSelect.x, y: itemSelect.y + itemSelect.height, width: itemSelect.width, height: max.height }


    const deleteRec = Rectangels.filter(item =>
      item?.x >= searchArea?.x && item?.x < (searchArea?.x + searchArea?.width) &&
      item?.y >= searchArea?.y && item?.y < (searchArea?.y + searchArea?.height))


    // если нет рамок снизу 

    if (itemsFrameDown.length === 0) {
      setRectangels(Rectangels.map(item => {
        if (item.id === itemSelect.id) {
          return { ...item, width: 0, height: 0, }
        }
        else if (itemsUp.includes(item) || itemsFrameUp.includes(item)) {
          return { ...item, height: item.height + FRAME_SIZE + itemDown.height }
        } else {
          return item
        }
      }).filter(item => item.id !== itemDown.id))

    }
    else {
      // если рамка внизу есть 
      setRectangels(Rectangels.map(item => {
        if (item.id === itemSelect.id) {
          return { ...item, width: 0, height: 0, }
        }
        else if (itemsUp.includes(item) || itemsFrameUp.includes(item)) {
          return { ...item, height: item.height + max.height + FRAME_SIZE, }
        } else {
          return item
        }
      }).filter(item => !deleteRec.includes(item)))

      setVerticalFrames(verticalFrames.filter(item => deleteRec.includes(item)))
    }



  }


  const DragStarHorizontalLeft = (itemSelect) => {

    // переделать поиск не из всех прямугольников, а только этой области

    setHorizontalLeftFrames(horizontalLeftFrames.filter(item => item.id !== itemSelect.id))
    // прямоугольник внизу
    const itemDown = leftRectangels.filter(item => (
      (itemSelect.x + 2 > item.x && itemSelect.x + 2 < (item.x + item.width)) &&
      (itemSelect.y + 2 + FRAME_SIZE > item.y && itemSelect.y + FRAME_SIZE + 2 < (item.y + item.height)) && item?.type !== 'frame'
    )
    )[0]

    // прямоугольнику вверху
    const itemsUp = leftRectangels.filter(item => (item.x >= itemSelect.x) && ((item.x + item.width) <= (itemSelect.x + itemSelect.width)) &&
      ((item.y + item.height) === itemSelect.y) &&

      item?.type !== 'frame'
    )

    setLeftRectangels(leftRectangels.map(item => {
      if (item.id === itemSelect.id) {
        return { ...item, width: 0, height: 0, }
      }
      else if (itemsUp.includes(item)) {
        return { ...item, height: item.height + FRAME_SIZE + itemDown.height }
      } else {
        return item
      }
    }).filter(item => item.id !== itemDown.id))

  }

  const DragStarHorizontalRight = (itemSelect) => {

    // переделать поиск не из всех прямугольников, а только этой области

    setHorizontalRightFrames(horizontalRightFrames.filter(item => item.id !== itemSelect.id))

    // прямоугольник внизу
    const itemDown = RightRectangels.filter(item => (
      (itemSelect.x + 2 > item.x && itemSelect.x + 2 < (item.x + item.width)) &&
      (itemSelect.y + 2 + FRAME_SIZE > item.y && itemSelect.y + FRAME_SIZE + 2 < (item.y + item.height)) && item?.type !== 'frame'
    )
    )[0]

    // прямоугольнику вверху
    const itemsUp = RightRectangels.filter(item => (item.x >= itemSelect.x) && ((item.x + item.width) <= (itemSelect.x + itemSelect.width)) &&
      ((item.y + item.height) === itemSelect.y) &&

      item?.type !== 'frame'
    )

    setRightRectangels(RightRectangels.map(item => {
      if (item.id === itemSelect.id) {
        return { ...item, width: 0, height: 0, }
      }
      else if (itemsUp.includes(item)) {
        return { ...item, height: item.height + FRAME_SIZE + itemDown.height }
      } else {
        return item
      }
    }).filter(item => item.id !== itemDown.id))

  }




  function clickCheck() {

    if (this.attrs.derection === 2 && this.attrs.width < widthCloset) {
      createInput(this.getAbsolutePosition(), this.attrs.width, this.attrs)

    }
    else if (this.attrs.derection === 1 && this.attrs.height < heightCloset) {
      createInput(this.getAbsolutePosition(), this.attrs.height, this.attrs)
    }



  }

  const onBlurInputHorizontal = (value, containerDiv, wrap, itemSelect, width) => {


    containerDiv.removeChild(wrap);

    const itemsLeft = Rectangels.filter(item => (
      ((item.x + item.width) === (itemSelect.x + width)) &&

      (((item.y + item.height) === (itemSelect.y)) || ((item.y) === (itemSelect.y + itemSelect.height)))
    )
    )



    const FrameRight = Rectangels.filter(item => (

      ((item.x) === (itemSelect.x + width)) &&
      ((item.y < itemSelect.y) && ((item.y + item.height) > (itemSelect.y + itemSelect.height)))
    )
    )[0]

    let changeValue = 0

    changeValue = value - width

    if (FrameRight !== undefined) {
      const itemsRight = Rectangels.filter(item => (
        (item.x === (FrameRight.x + FrameRight.width)) &&
        ((item.y >= FrameRight.y) && ((item.y + item.height) <= (FrameRight.y + FrameRight.height)))
      )
      )
      const minWidth = itemsRight?.reduce((acc, curr) => acc?.width < curr?.width ? acc : curr).width;
      setRectangels(Rectangels.map(item => {
        if (item.id === itemSelect.id) {
          return { ...item, width: item.width + changeValue }
        }
        else if (itemsLeft.includes(item)) {
          return { ...item, width: item.width + changeValue, }
        }
        else if (itemsRight.includes(item)) {
          return { ...item, x: item.x + changeValue, width: item.width - changeValue, }
        }
        else if (item === FrameRight) {
          return { ...item, x: item.x + changeValue }
        }
        else {
          return item
        }
      }))


      setVerticalFrames(verticalFrames.map(item => {
        if (item.id === FrameRight.id) {



          return { ...item, x: item.x + changeValue }
        }
        else {
          return item
        }
      }))
    }




    // если itemsRight пустой значит рамка стоит в упор к стенке

  }


  const onBlurInputVertical = (value, containerDiv, wrap, itemSelect, height) => {

    containerDiv.removeChild(wrap);

    const itemsUp = Rectangels.filter(item => (
      ((item.y + item.height) === (itemSelect.y + height)) &&

      (((item.x + item.width) === (itemSelect.x)) || ((item.x) === (itemSelect.x + itemSelect.width)))
    )
    )



    const FrameDown = Rectangels.filter(item => (

      ((item.y) === (itemSelect.y + height))
      &&
      ((item.x < itemSelect.x) && ((item.x + item.width) > (itemSelect.x + itemSelect.width)))
    )
    )[0]




    if (FrameDown !== undefined) {

      const itemsDown = Rectangels.filter(item => (
        (item.y === (FrameDown.y + FrameDown.height)) &&
        ((item.x >= FrameDown.x) && ((item.x + item.width) <= (FrameDown.x + FrameDown.width)))
      )
      )

      let changeValue = value - height



      setRectangels(Rectangels.map(item => {
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
      }))


      setHorizontalFrames(horizontalFrames.map(item => {
        if (item.id === FrameDown.id) {
          return { ...item, y: item.y + changeValue }
        }
        else {
          return item
        }
      }))

    }









    // если itemsRight пустой значит рамка стоит в упор к стенке
    // добавлять разницу к элементам слева и убавлять разницу элементам справа


  }


  function createInput(pos, value, item) {


    const containerDiv = document.getElementById('container');

    var wrap = document.createElement('div');
    wrap.style.position = 'absolute';
    wrap.style.top = 0;
    wrap.style.left = 0;
    wrap.style.width = '100%';
    wrap.style.height = '100%';

    containerDiv.appendChild(wrap)

    const input = document.createElement('input');
    input.type = 'number';

    input.style.position = 'absolute';
    input.style.top = pos.y + 3 + 'px';
    input.style.left = pos.x + 'px';

    input.style.height = 20 + 3 + 'px';
    input.style.width = 100 + 3 + 'px';
    input.value = value * 5

    if (item.derection === 2) {
      input.onblur = (e) => onBlurInputHorizontal(e.currentTarget?.value / 5, containerDiv, wrap, item, item.width)
    }
    else {
      input.onblur = (e) => onBlurInputVertical(e.currentTarget?.value / 5, containerDiv, wrap, item, item.height)
    }




    wrap.appendChild(input);

    function removeInput(e) {


      if (e.target === wrap) {

        wrap.parentNode.removeChild(wrap);
        wrap.removeEventListener("click", removeInput);

      }

    }

    wrap.addEventListener('click', removeInput, { once: true });

  }


  const changeSizeWidth = () => {

    // 50 минимальный размер ячейки

    const lastFrame = verticalFrames.sort((itme1, item2) => itme1?.x > item2?.x ? -1 : 1)[0]?.x


    const lastItems = Rectangels.filter(item =>
      ((item.x + item.width) === ((widthCloset - 10) + widthLeftWall))
    )

    if (widthClosetChange > 5000) {
      setRectangels(Rectangels.map(item => {
        if (lastItems.includes(item)) {
          return { ...item, width: item.width + (1000 - widthCloset) }
        } else {
          return item
        }
      }))
      setWidthCloset(1000)
      setWidthClosetChange(5000)
      setRightRectangels(RightRectangels.map(item => {

        return { ...item, x: item.x + (1000 - widthCloset) }

      }))
      setMainBackRectabgles(mainBackRectangles.map(item => {
        if (item?.changeType === 'up' || item?.changeType === 'down') {
          item.points[2] = item.points[2] + (1000 - widthCloset)
          item.points[4] = item.points[4] + (1000 - widthCloset)
          return item
        } else if (item?.changeType === 'right') {
          item.points[0] = item.points[0] + (1000 - widthCloset)
          item.points[2] = item.points[2] + (1000 - widthCloset)
          item.points[4] = item.points[4] + (1000 - widthCloset)
          item.points[6] = item.points[6] + (1000 - widthCloset)
          return item
        } else {
          return { ...item, width: item.width + (1000 - widthCloset) }
        }


      }))
      setRightBackRectangles(rightBackRectangles.map(item => {


        return { ...item, x: item.x + (1000 - widthCloset) }



      }))

    } else if (widthClosetChange < 700) {

      if ((widthClosetChange / 5) < lastFrame + 50) {
        setRectangels(Rectangels.map(item => {
          if (lastItems.includes(item)) {
            return { ...item, width: item.width + ((lastFrame + 50) - widthCloset) }
          } else {
            return item
          }
        }))

        setWidthCloset(lastFrame + 50)
        setWidthClosetChange((lastFrame + 50) * 5)
        setRightRectangels(RightRectangels.map(item => {

          return { ...item, x: item.x + ((lastFrame + 50) - widthCloset) }

        }))
        setMainBackRectabgles(mainBackRectangles.map(item => {
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


        }))
        setRightBackRectangles(rightBackRectangles.map(item => {


          return { ...item, x: item.x + ((lastFrame + 50) - widthCloset) }



        }))
      } else {
        setRectangels(Rectangels.map(item => {
          if (lastItems.includes(item)) {
            return { ...item, width: item.width + (140 - widthCloset) }
          } else {
            return item
          }
        }))
        setWidthCloset(140)
        setWidthClosetChange(700)
        setRightRectangels(RightRectangels.map(item => {

          return { ...item, x: item.x + (140 - widthCloset) }

        }))
        setMainBackRectabgles(mainBackRectangles.map(item => {
          if (item?.changeType === 'up' || item?.changeType === 'down') {
            item.points[2] = item.points[2] + (140 - widthCloset)
            item.points[4] = item.points[4] + (140 - widthCloset)
            return item
          } else if (item?.changeType === 'right') {
            item.points[0] = item.points[0] + (140 - widthCloset)
            item.points[2] = item.points[2] + (140 - widthCloset)
            item.points[4] = item.points[4] + (140 - widthCloset)
            item.points[6] = item.points[6] + (140 - widthCloset)
            return item
          } {
            return { ...item, width: item.width + (140 - widthCloset) }
          }


        }))
        setRightBackRectangles(rightBackRectangles.map(item => {


          return { ...item, x: item.x + (140 - widthCloset) }



        }))
      }




    } else {

      if ((widthClosetChange / 5) < lastFrame + 50) {
        setRectangels(Rectangels.map(item => {
          if (lastItems.includes(item)) {
            return { ...item, width: item.width + ((lastFrame + 50) - widthCloset) }
          } else {
            return item
          }
        }))

        setWidthCloset(lastFrame + 50)
        setWidthClosetChange((lastFrame + 50) * 5)
        setRightRectangels(RightRectangels.map(item => {

          return { ...item, x: item.x + ((lastFrame + 50) - widthCloset) }

        }))
        setMainBackRectabgles(mainBackRectangles.map(item => {
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


        }))
        setRightBackRectangles(rightBackRectangles.map(item => {


          return { ...item, x: item.x + ((lastFrame + 50) - widthCloset) }



        }))
      }
      else {
        setRectangels(Rectangels.map(item => {
          if (lastItems.includes(item)) {
            return { ...item, width: item.width + ((widthClosetChange / 5) - widthCloset) }
          } else {
            return item
          }
        }))
        setWidthCloset((widthClosetChange / 5))
        setRightRectangels(RightRectangels.map(item => {

          return { ...item, x: item.x + ((widthClosetChange / 5) - widthCloset) }

        }))
        setMainBackRectabgles(mainBackRectangles.map(item => {
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


        }))
        setRightBackRectangles(rightBackRectangles.map(item => {


          return { ...item, x: item.x + ((widthClosetChange / 5) - widthCloset) }



        }))
      }


    }








  }


  const changeSizeHeight = () => {

    const lastFrame = horizontalFrames.sort((itme1, item2) => itme1?.y > item2?.y ? -1 : 1)[0]?.y


    const lastItems = Rectangels.filter(item =>
      ((item?.y + item.height) === heightCloset)
    )



    if (heightClosetChange > 3000) {

      setRectangels(Rectangels.map(item => {
        if (lastItems.includes(item)) {
          return { ...item, height: item.height + (600 - heightCloset) }
        } else {
          return item
        }
      }))
      setHeightCloset(600)
      setHeightClosetChange(3000)
      setLeftRectangels(leftRectangels.map(item => {

        return { ...item, height: item.height + (600 - heightCloset) }

      }))
      setRightRectangels(RightRectangels.map(item => {
        return { ...item, height: item.height + (600 - heightCloset) }
      }))
      setMainBackRectabgles(mainBackRectangles.map(item => {
        if (item?.changeType === 'right') {
          item.points[5] = item.points[5] + (600 - heightCloset)
          item.points[7] = item.points[7] + (600 - heightCloset)
          return item
        } else if (item.changeType === 'down') {
          item.points[1] = item.points[1] + (600 - heightCloset)
          item.points[3] = item.points[3] + (600 - heightCloset)
          item.points[5] = item.points[5] + (600 - heightCloset)
          item.points[7] = item.points[7] + (600 - heightCloset)
          return item
        } else if (item.changeType === 'left') {
          item.points[5] = item.points[5] + (600 - heightCloset)
          item.points[7] = item.points[7] + (600 - heightCloset)
          return item
        } else {
          return { ...item, height: item.height + (600 - heightCloset) }

        }


      }))

      setRightBackRectangles(rightBackRectangles.map(item => {
        if (item.changeType === 'down') {
          return { ...item, y: item.y + (600 - heightCloset) }
        } else if (item.type !== 'line') {
          return { ...item, height: item.height + (600 - heightCloset) }
        } else {
          return item
        }

      }))

      setLeftBackRectangles(leftBackRectangles.map(item => {
        if (item.changeType === 'down') {
          return { ...item, y: item.y + (600 - heightCloset) }
        } else if (item.type !== 'line') {
          return { ...item, height: item.height + (600 - heightCloset) }
        } else {
          return item
        }

      }))

    } else if (heightClosetChange < 1000) {

      setRectangels(Rectangels.map(item => {
        if (lastItems.includes(item)) {
          return { ...item, height: item.height + (200 - heightCloset) }
        } else {
          return item
        }
      }))
      setHeightCloset(200)
      setHeightClosetChange(1000)
      setLeftRectangels(leftRectangels.map(item => {

        return { ...item, height: item.height + (200 - heightCloset) }

      }))
      setRightRectangels(RightRectangels.map(item => {
        return { ...item, height: item.height + (200 - heightCloset) }
      }))

      setMainBackRectabgles(mainBackRectangles.map(item => {
        if (item?.changeType === 'right') {
          item.points[5] = item.points[5] + (200 - heightCloset)
          item.points[7] = item.points[7] + (200 - heightCloset)
          return item
        } else if (item.changeType === 'down') {
          item.points[1] = item.points[1] + (200 - heightCloset)
          item.points[3] = item.points[3] + (200 - heightCloset)
          item.points[5] = item.points[5] + (200 - heightCloset)
          item.points[7] = item.points[7] + (200 - heightCloset)
          return item
        } else if (item.changeType === 'left') {
          item.points[5] = item.points[5] + (200 - heightCloset)
          item.points[7] = item.points[7] + (200 - heightCloset)
          return item
        } else {
          return { ...item, height: item.height + (200 - heightCloset) }

        }


      }))

      setRightBackRectangles(rightBackRectangles.map(item => {
        if (item.changeType === 'down') {
          return { ...item, y: item.y + (200 - heightCloset) }
        } else if (item.type !== 'line') {
          return { ...item, height: item.height + (200 - heightCloset) }
        } else {
          return item
        }

      }))

      setLeftBackRectangles(leftBackRectangles.map(item => {
        if (item.changeType === 'down') {
          return { ...item, y: item.y + (200 - heightCloset) }
        } else if (item.type !== 'line') {
          return { ...item, height: item.height + (200 - heightCloset) }
        } else {
          return item
        }

      }))

    } else {
      if (heightClosetChange / 5 < lastFrame + 50) {

        setRectangels(Rectangels.map(item => {
          if (lastItems.includes(item)) {
            return { ...item, height: item.height + ((lastFrame + 50) - heightCloset) }
          } else {
            return item
          }
        }))
        setHeightCloset(lastFrame + 50)
        setHeightClosetChange((lastFrame + 50) * 5)

        setLeftRectangels(leftRectangels.map(item => {

          return { ...item, height: item.height + ((lastFrame + 50) - heightCloset) }

        }))
        setRightRectangels(RightRectangels.map(item => {
          return { ...item, height: item.height + ((lastFrame + 50) - heightCloset) }
        }))

        setMainBackRectabgles(mainBackRectangles.map(item => {
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


        }))

        setRightBackRectangles(rightBackRectangles.map(item => {
          if (item.changeType === 'down') {
            return { ...item, y: item.y + ((lastFrame + 50) - heightCloset) }
          } else if (item.type !== 'line') {
            return { ...item, height: item.height + ((lastFrame + 50) - heightCloset) }
          } else {
            return item
          }

        }))

        setLeftBackRectangles(leftBackRectangles.map(item => {
          if (item.changeType === 'down') {
            return { ...item, y: item.y + ((lastFrame + 50) - heightCloset) }
          } else if (item.type !== 'line') {
            return { ...item, height: item.height + ((lastFrame + 50) - heightCloset) }
          } else {
            return item
          }

        }))

      } else {

        setRectangels(Rectangels.map(item => {
          if (lastItems.includes(item)) {
            return { ...item, height: item.height + (heightClosetChange / 5 - heightCloset) }
          } else {
            return item
          }
        }))
        setHeightCloset(heightClosetChange / 5)
        setLeftRectangels(leftRectangels.map(item => {

          return { ...item, height: item.height + (heightClosetChange / 5 - heightCloset) }

        }))
        setRightRectangels(RightRectangels.map(item => {
          return { ...item, height: item.height + (heightClosetChange / 5 - heightCloset) }
        }))

        setMainBackRectabgles(mainBackRectangles.map(item => {
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


        }))

        setRightBackRectangles(rightBackRectangles.map(item => {
          if (item.changeType === 'down') {
            return { ...item, y: item.y + (heightClosetChange / 5 - heightCloset) }
          } else if (item.type !== 'line') {
            return { ...item, height: item.height + (heightClosetChange / 5 - heightCloset) }
          } else {
            return item
          }

        }))

        setLeftBackRectangles(leftBackRectangles.map(item => {
          if (item.changeType === 'down') {
            return { ...item, y: item.y + (heightClosetChange / 5 - heightCloset) }
          } else if (item.type !== 'line') {
            return { ...item, height: item.height + (heightClosetChange / 5 - heightCloset) }
          } else {
            return item
          }

        }))



      }

    }







  }


  const changeWidthLeftWall = () => {

    const changeValue = widthLeftWallChange / 5 - widthLeftWall


    setLeftRectangels(leftRectangels.map(item => {

      return { ...item, width: item.width + changeValue }

    }))

    setRectangels(Rectangels.map(item => {

      return { ...item, x: item.x + changeValue }

    }))

    setRightRectangels(RightRectangels.map(item => {
      return { ...item, x: item.x + changeValue }
    }))


    setMainBackRectabgles(mainBackRectangles.map(item => {
      if (item?.changeType === 'right' || item.changeType === 'left' || item.changeType === 'up' || item.changeType === 'down') {
        item.points[0] = item.points[0] + (changeValue)
        item.points[2] = item.points[2] + (changeValue)
        item.points[4] = item.points[4] + (changeValue)
        item.points[6] = item.points[6] + (changeValue)
        return item
      } else {
        return { ...item, x: item.x + changeValue }
      }


    }))

    setRightBackRectangles(rightBackRectangles.map(item => {
      return { ...item, x: item.x + changeValue }
    }))

    setLeftBackRectangles(leftBackRectangles.map(item => {
      if (item.type === 'line') {
        return { ...item, x: item.x + changeValue, radiusX: item.radiusX + changeValue }
      } else if (item.type !== 'line') {
        return { ...item, width: item.width + changeValue }
      } else {
        return item
      }
    }))


    setWidthLeftWall(widthLeftWallChange / 5)
  }

  const changeWidthRightWall = () => {

    const changeValue = widthRightWallChange / 5 - widthRightWall

    setRightRectangels(RightRectangels.map(item => {
      return { ...item, width: item.width + changeValue }
    }))

    setWidthRightWall(widthRightWallChange / 5)

    setRightBackRectangles(rightBackRectangles.map(item => {
      if (item.type === 'line') {
        return { ...item, radiusX: item.radiusX + changeValue }
      } else {
        return { ...item, width: item.width + changeValue }
      }

    }))
  }

  const changeColor = (value) => {
    const mainColor = colors[value].mainColor
    const frameColor = colors[value].frameColor

    setLeftBackRectangles(leftBackRectangles.map(item => {
      if (item.colorType === 'main') {
        item.fill = mainColor
        return item
      } else {
        item.fill = frameColor
        return item
      }

    }))

    setMainBackRectabgles(mainBackRectangles.map(item => {
      if (item.colorType === 'main') {
        item.fill = mainColor
        return item
      } else {
        item.fill = frameColor
        return item
      }

    }))
    setRightBackRectangles(rightBackRectangles.map(item => {
      if (item.colorType === 'main') {
        item.fill = mainColor
        return item
      } else {
        item.fill = frameColor
        return item
      }

    }))

    setLeftRectangels(leftRectangels.map(item => {
      if (item?.type === 'frame') {
        item.color = frameColor
        return item
      } else return item

    }))
    setRectangels(Rectangels.map(item => {
      if (item?.type === 'frame') {
        item.color = frameColor
        return item
      } else return item

    }))
    setRightRectangels(RightRectangels.map(item => {
      if (item?.type === 'frame') {
        item.color = frameColor
        return item
      } else return item
    }))

    setColorFrame(frameColor)

    setColorValue(value)
  }

  const changeLeftVisible = (value) => {
    setLeftWall(value)
    setLeftRectangels([{ id: 20, width: widthLeftWall, height: heightCloset - 60, x: 0, y: 30 }])
    setHorizontalLeftFrames([])
  }

  const changeRightVisible = (value) => {
    setRightWall(value)

    setRightRectangels([{ id: 40, width: widthRightWall, height: heightCloset - 60, x: widthLeftWall + widthCloset, y: 30 },])
    setHorizontalRightFrames([])
  }


  return (
    <div style={{
      display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
      width: '100%', position: 'relative'
    }} id='1'>
      <div style={{ display: 'flex', gap: '10px' }}>

        <div style={{
          width: 'fit-content', border: '1px solid black'
          , marginBottom: '20px'
        }} draggable={true} onDragStart={(e) => setDerection('1')}>
          <img src="./images/vertical.png" />
        </div>

        <div style={{
          width: 'fit-content', border: '1px solid black'
          , marginBottom: '20px'
        }} draggable={true} onDragStart={() => setDerection('2')}>
          <img src="./images/horizont.png" />
        </div>

        <div>
          Выбор цвета
          <select value={colorValue} onChange={(e) => changeColor(Number(e.target.value))} >
            <option value={0}>Стандартный</option>
            <option value={1}>Белый</option>
            <option value={2}>Синий</option>
          </select>
        </div>
        <div className={style.inputs}>

          <div>
            <div>
              Ширина
              <input onBlur={changeSizeWidth} onChange={(e) => setWidthClosetChange(Number(e.target.value))} value={widthClosetChange} step={100} type="number" />
            </div>

            <div>
              Высота
              <input onBlur={changeSizeHeight} onChange={(e) => setHeightClosetChange(Number(e.target.value))} value={heightClosetChange} step={50} type="number" />
            </div>




          </div>

          <div>
            <div>
              Ширина левой задней стенки
              <input onBlur={changeWidthLeftWall} onChange={(e) => setWidthLeftWallChange(Number(e.target.value))} value={widthLeftWallChange} type="number" />
            </div>

            <div>
              Ширина правой задней стенки
              <input onBlur={changeWidthRightWall} onChange={(e) => setWidthRightWallChange(Number(e.target.value))} value={widthRightWallChange} type="number" />
            </div>

          </div>
          <div>
            <div>
              Задняя левая стенка
              <input checked={LeftWall} onClick={e => changeLeftVisible(e.target.checked)} type="checkbox" />
            </div>
            <div>
              Задняя правая стенка
              <input checked={RightWall} onClick={e => changeRightVisible(e.target.checked)} type="checkbox" />
            </div>
          </div>
        </div>


      </div>
      <Stage
        width={1500}
        height={1000}
        ref={stageRef}
        onClick={(e) => handleClick(e)}
        id="container"
        className={style.container}
      >
        <Provider store={window.store}>

          <Layer x={100} y={100} ref={LayerRef} >
            <Group visible={LeftWall}>
              {
                leftBackRectangles.map((item) => {
                  if (item.type === 'line') {
                    return <Ellipse
                      x={item.x}
                      y={item.y}
                      fill={item.fill}
                      radiusX={item.radiusX}
                      radiusY={item.radiusY}
                      stroke={1}
                      strokeWidth={1}
                    />
                  } else {
                    return <Rect
                      width={item.width}
                      height={item.height}
                      fill={item.fill}
                      listening={false}
                      x={item.x}
                      y={item.y}
                      stroke="black"
                      strokeWidth={1}
                      className={style.rect}
                    />

                  }

                })
              }
            </Group>
            <Group visible={RightWall}>
              {
                rightBackRectangles.map((item) => {
                  if (item?.type === 'line') {
                    return <Ellipse
                      x={item.x}
                      y={item.y}
                      fill={item.fill}
                      radiusX={item.radiusX}
                      radiusY={item.radiusY}
                      stroke={1}
                      strokeWidth={1}
                    />
                  } else {
                    return <Rect
                      width={item.width}
                      height={item.height}
                      fill={item.fill}
                      listening={false}
                      x={item.x}
                      y={item.y}
                      stroke="black"
                      strokeWidth={1}
                      className={style.rect}
                    />

                  }

                })
              }
            </Group>

            {
              mainBackRectangles.map((item) => {
                if (item?.type === 'line') {
                  return <Line
                    points={item.points}
                    closed={true}
                    tension={item.tension}
                    fill={item.fill}
                    stroke={'black'}
                    strokeWidth={1}
                    draggable={true}
                  />
                } else {
                  return <Rect
                    width={item.width}
                    height={item.height}
                    fill={item.fill}
                    listening={false}
                    x={item.x}
                    y={item.y}
                    stroke="black"
                    strokeWidth={1}
                    className={style.rect}
                  />

                }

              })
            }


            <Group

            >
              {
                leftRectangels.map((item) => <Rect key={item.id} width={item.width} height={item.height}
                  fill={item.color || null}
                  stroke="black"
                  strokeWidth={item.type === 'frame' && 0.3}
                  x={item.x}
                  y={item.y}
                  id={item.id}
                  derection={item?.derection}
                  draggable={item.draggable || false}
                  onDragStart={() => DragStarHorizontalLeft(item)}
                  onDragEnd={(e) => onDragEndLeft(e.evt.layerX - 100, e.evt.layerY - 100, item.id)}
                />)
              }
              {
                selectedRectId && <Rect
                  x={props.store.x}
                  y={props.store.y}
                  width={10}
                  height={10}
                  fill="white"

                />
              }
            </Group>

            <Group
            >
              {
                Rectangels.map((item) => <Rect key={item.id} width={item.width} height={item.height}
                  fill={item.color || null}
                  stroke="black"
                  strokeWidth={item.type === 'frame' && 0.3}
                  x={item.x}
                  y={item.y}
                  id={item.id}

                  onClick={item.type === 'frame' && clickCheck}
                  derection={item?.derection}
                  draggable={item.draggable || false}
                  onDragStart={item.derection === 1
                    ? () => DragStarVertical(item)
                    : () => DragStarHorizontal(item)}

                  onDragEnd={(e) => onDragEndMain(e.evt.layerX - 100, e.evt.layerY - 100, item.id, item.derection)}
                />)
              }
              {
                selectedRectId && <Rect
                  x={props.store.x}
                  y={props.store.y}
                  width={10}
                  height={10}
                  fill="white"

                />
              }



            </Group>
            <Group

            >
              {
                RightRectangels.map((item) => <Rect key={item.id} width={item.width} height={item.height}
                  fill={item.color || null}
                  stroke="black"
                  strokeWidth={item.type === 'frame' && 0.3}
                  x={item.x}
                  y={item.y}
                  id={item.id}
                  derection={item?.derection}
                  draggable={item.draggable || false}
                  onDragStart={() => DragStarHorizontalRight(item)}
                  onDragEnd={(e) => onDragEndRight(e.evt.layerX - 100, e.evt.layerY - 100, item.id)}
                />)
              }
              {
                selectedRectId && <Rect
                  x={props.store.x}
                  y={props.store.y}
                  width={10}
                  height={10}
                  fill="white"

                />
              }
            </Group>

            <Metrics width={widthCloset}
              height={heightCloset}
              verticalFrames={verticalFrames}
              setVerticalFrames={setVerticalFrames}
              horizontalFrames={horizontalFrames}
              setHorizontalFrames={setHorizontalFrames}
              Rectangels={Rectangels}
              setRectangels={setRectangels}
              widthLeftWall={widthLeftWall}
              widthRightWall={widthRightWall}
              horizontalLeftFrames={horizontalLeftFrames}
              setHorizontalLeftFrames={setHorizontalLeftFrames}
              horizontalRightFrames={horizontalRightFrames}
              setHorizontalRightFrames={setHorizontalRightFrames}
              leftRectangels={leftRectangels}
              setLeftRectangels={setLeftRectangels}
              RightRectangels={RightRectangels}
              setRightRectangels={setRightRectangels}
              LeftWall={LeftWall}
              RightWall={RightWall}
            />
          </Layer>
        </Provider>
      </Stage>
    </div>
  );
}



export default inject("store")(observer(RootFrame));
