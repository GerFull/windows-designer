import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Group, Rect } from "react-konva";
import style from './homePage.module.scss'
import { useDispatch, useSelector } from 'react-redux';
import Metrics from "../../components/Metrics";
import Poligon from "../../components/Figures/Poligon";
// import ElipseTexture from "./Figures/Elipse";
import Rectangle from "../../components/Figures/Rectangle";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  createVertical, createHorizontal,
  DragStarVertical, DragStarHorizontal,
  deleteRectangle, onBlurInputVertical,
  onBlurInputHorizontal,
  changeSizeWidthMain, changeSizeHeightMain,
  changeColorMain, changeVisionMainWall,
  changeTextureMain, changeSizeMainWall,
  createNewBurb,
  createHanger, createSideHanger, DragStartHanger,
  deleteElement, createDrawer, onBlurInputDrawer,
  changeWallInside, changeVisibableUp,
  changeVisibableDown,
  changeSizeWidthElements, changeSizeFrame
} from "../../store/slice/mainRectangles";
import {
  createHorizontalLeft, DragStarHorizontalLeft,
  deleteItemLeft, changeSizeHeightLeft,
  changeSizeLeftWall, changeColorLeft,
  changeTextureLeft, leftVisibleWall
} from "../../store/slice/leftRectangles";
import {
  createHorizontalRight, DragStarHorizontalRight,
  deleteItemRight, changeSizeHeightRight,
  changeSizeWallRight, changeSizeRightWall,
  changeWidthRight, changeColorRight, changeTextureRight,
  rightVisibleWall

} from "../../store/slice/rightRectangles";
import { changeWidth, changeHeight, replaceWidthRight, replaceWidthLeft, changeDepth } from "../../store/slice/globalVariable";
import UrlImage from "../../components/Figures/UrlImage";




// переделать SelectdeRectId сделать его глобальным

// делать минус 100 так как layer сдвинули на 100 по x и y
// 1 пиксель 5мм


// документация подписать за что отвечает каждый блок



// не меняется размер вертикальных перегородок при включении отключении пола,потлок тоже.
// нельзя создать текстуру без заполнения


const FRAME_SIZE = 5;


const colors = [
  {
    id: 'std',
    mainColor: '#efcf9f',
    name: 'Стандартный',
    cost: 500
  },
  {
    id: 'wh',
    mainColor: 'white',
    name: 'Белый',
    cost: 500
  },
]


function HomePage() {
  const { maxHeight, minHeight, maxWidth, minWidth, widthCloset, heightCloset, depthCloset, widthLeftWall,
    widthRightWall, maxDepth, minDepth, coeficentMarkUo, coeficentWaste, } = useSelector(store => store.globalVariable)
  const { Rectangels, mainBackRectangles, verticalFrames, horizontalFrames, elements,
    intersection, countBox, countHanger, countBarbel, selectedTextura,
    downVisible, upVisible, mainVisible } = useSelector(store => store.mainRectangles)
  const { leftRectangels, leftBackRectangles, LeftWallVisible } = useSelector(store => store.leftRectangels)
  const { RightRectangels, rightBackRectangles, RightWallVisible } = useSelector(store => store.rightRectangels)

  // const state = useSelector(store => store)

  const dispatch = useDispatch()

  const stageRef = useRef(null)

  const navigate = useNavigate()

  const [widthClosetChange, setWidthClosetChange] = useState(widthCloset * 5)
  const [heightClosetChange, setHeightClosetChange] = useState(heightCloset * 5)
  const [depthClosetChange, setDepthClosetChange] = useState(depthCloset * 5)
  const [widthLeftWallChange, setWidthLeftWallChange] = useState(widthLeftWall * 5)
  const [widthRightWallChange, setWidthRightWallChange] = useState(widthRightWall * 5)

  const [widthCanvas, setWidthCanvas] = useState(widthCloset + widthRightWall + 300)
  const [heightCanvas, setHeightCanvas] = useState(heightCloset + 100)

  const [LeftWall, setLeftWall] = useState(LeftWallVisible)
  const [RightWall, setRightWall] = useState(RightWallVisible)

  const [MainWall, setMainWall] = useState(mainVisible)
  const [LeftInside, setLeftInside] = useState(!LeftWallVisible)
  const [RightInside, setRightInside] = useState(!RightWallVisible)
  const [UpVisable, setUpVisable] = useState(upVisible)
  const [DownVisable, setDownVisable] = useState(downVisible)

  const [textures, setTextures] = useState([])

  const LayerRef = useRef(null)
  const [selectedRectId, setSelectedRectId] = useState(null)
  const [derection, setDerection] = useState(null)
  const [heightDrawer, setheightDrawer] = useState(40)
  const [showObject, setShowObject] = useState({ fill: '#99ff99', opacity: 0.7, width: 10, height: 10, x: 0, y: 0 })


  const [showMenu, setShowMenu] = useState(true)
  const [showSize, setShowSize] = useState(false)
  const [showPartition, setShowPartition] = useState(false)
  const [showElements, setShowElements] = useState(false)

  // создание элемнтов и перегородок на шкафу через координаты 

  const drop = (e) => {

    e.preventDefault();

    if (selectedRectId !== null) {
      if (Rectangels.includes(selectedRectId)) {
        setShowObject({ fill: '#99ff99', opacity: 0.7, width: 0, height: 0, x: 0, y: 0 })
        if (derection === '1') {
          dispatch(
            createVertical(
              { xk: e.layerX - 100, yk: e.layerY - 50, widthLeftWall: widthLeftWall }
            )
          )
        }
        if (derection === '2') {
          dispatch(
            createHorizontal(
              { xk: e.layerX - 100, yk: e.layerY - 50, selectedRectId: selectedRectId }
            )
          )
        }
        if (derection === '3') {
          dispatch(
            createNewBurb({ xk: e.layerX - 100, yk: e.layerY - 50, widthLeftWall, widthCloset })
          )
        }
        if (derection === '4') {
          dispatch(
            createHanger({ xk: e.layerX - 100, yk: e.layerY - 50, widthLeftWall: widthLeftWall })
          )
        }
        if (derection === '5') {
          dispatch(
            createSideHanger({ xk: e.layerX - 100, yk: e.layerY - 50, widthCloset: widthCloset })
          )
        }
        if (derection === '6') {
          dispatch(
            createDrawer({ xk: e.layerX - 100, yk: e.layerY - 50, widthCloset: widthCloset })
          )
        }
      }

      else if (leftRectangels.includes(selectedRectId) && LeftWall && derection === '2') {

        dispatch(
          createHorizontalLeft(
            { xk: e.layerX - 100, yk: e.layerY - 50, }
          )
        )
      } else if (RightRectangels.includes(selectedRectId) && RightWall && derection === '2') {
        dispatch(
          createHorizontalRight(
            { xk: e.layerX - 100, yk: e.layerY - 50, }
          )
        )
      }
      setSelectedRectId(null)
    }
  }

  // функция для подсвечивания места куда встанет элемент или перегородка на шкафу
  const dragover = (e) => {

    e.preventDefault();
    const x = e.layerX - 100
    const y = e.layerY - 50

    let newArr = [...Rectangels]

    if (LeftWall && RightWall) {
      newArr = [...Rectangels, ...leftRectangels, ...RightRectangels]
    } else if (RightWall) {
      newArr = [...Rectangels, ...RightRectangels]
    } else if (LeftWall) {
      newArr = [...Rectangels, ...leftRectangels]
    }

    const item = newArr.filter(item => (
      (x > item.x && x < (item.x + item.width)) &&
      (y > item.y && y < (item.y + item.height)) && item?.type !== 'frame'
    )
    )[0]

    if (item !== undefined) {

      setSelectedRectId(item)

      switch (derection) {
        case '1':
          setShowObject({ ...showObject, width: FRAME_SIZE, height: item.height, x: x, y: item.y })
          break;
        case '2':
          setShowObject({ ...showObject, width: item.width, height: FRAME_SIZE, x: item.x, y: y })
          break;
        case '3':
          setShowObject({ ...showObject, width: item.width, height: 20, x: item.x, y: y })
          break;
        case '4':
          setShowObject({ ...showObject, width: 100, height: 130, x: x, y: item.y })
          break;
        case '6':
          setShowObject({ ...showObject, width: item.width, height: heightDrawer, x: item.x, y: y })
          break;
        default:
          break;
      }

    } else setSelectedRectId(null)

  }

  const fetchData = async () => {
    await axios.get('http://127.0.0.1:8000/api/Textures/').then(res => setTextures(res.data)).catch(err => err)
  }



  useEffect(() => {
    fetchData()
  }, [])

  // закрепеление слушателей на Canvas для отслеживания перемещений
  useEffect(() => {
    const con = stageRef.current.container()
    con.addEventListener('dragover', dragover)

    con.addEventListener('drop', drop)

    return () => {
      con.removeEventListener('dragover', dragover)
      con.removeEventListener('drop', drop)
    }

  }, [Rectangels, derection, selectedRectId, leftRectangels, RightRectangels])

  //когда пользователь начал перетаскивать установленный перегородку, она меняет размер для подстветки в зависимсоти от выбранного направления

  const onDragStartFrame = (item) => {
    if (item.derection === 1) {
      setDerection('1')
      dispatch(DragStarVertical({ itemSelect: item }))
    } else {
      setDerection('2')
      dispatch(DragStarHorizontal({ itemSelect: item }))
    }
  }


  // когда пользователь закончил перетаскивать установленную перегородку, функция создает новую перегородку
  const onDragEndFrame = (x, y, shadowid, mainId, derection) => {

    setShowObject({ fill: '#99ff99', opacity: 0.7, width: 0, height: 0, x: 0, y: 0 })

    if ((x > 100 && x < 100 + widthCloset) && (y > 0 && y < y + heightCloset)) {

      if (derection === 1) {
        dispatch(createVertical({ xk: x, yk: y, shadowid, mainId, widthLeftWall: widthLeftWall }))
      } else {
        dispatch(createHorizontal({ xk: x, yk: y, shadowid, mainId }))
      }

    } else {
      dispatch(deleteRectangle({ id: shadowid }))
    }
  }

  // когда пользователь закончил перетаскивать установленный дополнительный элемент, функция создает дополнительный элемент
  const onDragEndElements = (x, y, id, type, height) => {

    setShowObject({ fill: '#99ff99', opacity: 0.7, width: 0, height: 0, x: 0, y: 0 })

    if ((x > 100 && x < 100 + widthCloset) && (y > 0 && y < heightCloset)) {
      switch (type) {
        case 'element':
          dispatch(createNewBurb({ xk: x, yk: y, idd: id, widthLeftWall, widthCloset, start: true }))
          break;
        case 'hanger':
          dispatch(createHanger({ xk: x, yk: y, idd: id, widthLeftWall: widthLeftWall, start: true }))
          break;
        case 'drawer':
          dispatch(createDrawer({ xk: x, yk: y, idd: id, heightDrawer: height }))
          break;
        case 'sidehanger':
          dispatch(createSideHanger({ xk: x, yk: y, idd: id, widthCloset: widthCloset }))
          break;
      }
    } else {
      dispatch(deleteElement({ id: id, type }))
    }
  }
  //когда пользователь начал перетаскивать установленный дополнительный элемент, она меняет размер для подстветки в зависимсоти от выбранного элемента
  const onDragStartElements = (type, item) => {
    switch (type) {
      case 'element':
        setDerection('3')
        dispatch(DragStartHanger({ itemSelect: item }))
        break;
      case 'hanger':
        setDerection('4')
        dispatch(DragStartHanger({ itemSelect: item }))
        break;
      case 'drawer':
        setDerection('6')
        setheightDrawer(item.height)
        dispatch(DragStartHanger({ itemSelect: item }))
        break;

      default:
        break;
    }
  }


  // const onDragEndLeft = (x, y, id) => {
  //   setShowObject({ fill: '#99ff99', opacity: 0.7, width: 0, height: 0, x: 0, y: 0 })
  //   if ((x > 0 && x < widthLeftWall) && (y > 20 && y < y + heightCloset - 20)) {
  //     dispatch(
  //       createHorizontalLeft(
  //         { xk: x, yk: y, idd: id }
  //       )
  //     )

  //   } else {
  //     dispatch(deleteItemLeft({ id: id }))
  //   }



  // }

  // const onDragEndRight = (x, y, id) => {
  //   setShowObject({ fill: '#99ff99', opacity: 0.7, width: 0, height: 0, x: 0, y: 0 })

  //   if ((x > widthLeftWall + widthCloset && x < widthLeftWall + widthCloset + widthLeftWall) && (y > 20 && y < y + heightCloset - 20)) {

  //     dispatch(
  //       createHorizontalRight(
  //         { xk: x, yk: y, idd: id }
  //       )
  //     )

  //   } else {
  //     dispatch(deleteItemRight({ id: id }))

  //   }



  // }



  // функция создает поля ввода в зависимости от типа или направления перегородки
  function clickCheck(props) {

    if (props.attrs.type === "drawer") {
      createInput(props.getAbsolutePosition(), props.attrs.height, props.attrs)
    }
    if (props.attrs.derection === 2 && props.attrs.width < widthCloset - 10) {
      createInput(props.getAbsolutePosition(), props.attrs.widthShow, props.attrs)
    }
    if (props.attrs.derection === 1 && props.attrs.height < heightCloset - 10) {
      createInput(props.getAbsolutePosition(), props.attrs.heightShow, props.attrs)
    }

  }


  // функиция созданий поля ввода
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
    input.className = style.input__size
    input.style.top = pos.y + 3 + 'px';
    input.style.left = pos.x + 'px';
    input.style.height = 20 + 3 + 'px';
    input.style.width = 100 + 3 + 'px';
    input.value = (value * 5).toFixed(0)

    let focusInput = false

    input.onfocus = (e) => {
      focusInput = true
    }

    if (item?.derection === 2) {
      input.onblur = (e) => {
        focusInput = false
        dispatch(onBlurInputHorizontal({
          value: e.currentTarget?.value / 5,
          containerDiv, wrap,
          itemSelect: item,
          widthShow: item.widthShow,
          width: item.width
        }))
      }
    }
    if (item?.derection === 1) {
      focusInput = false
      input.onblur = (e) => dispatch(onBlurInputVertical(
        {
          value: e.currentTarget?.value / 5,
          containerDiv, wrap, itemSelect: item,
          heightShow: item.heightShow,
          height: item.height
        }))
    }
    if (item.type === 'drawer') {
      focusInput = false
      input.value = value * 5
      input.onblur = (e) => dispatch(onBlurInputDrawer({ value: e.currentTarget?.value / 5, containerDiv, wrap, itemSelect: item, height: item.height }))
    }

    wrap.appendChild(input);

    function removeInput(e) {


      if (e.target === wrap) {

        if (!focusInput) containerDiv?.removeChild(wrap)

      }

    }

    wrap.addEventListener('click', removeInput);

  }

  // функиця по обработки изменений ширины шкафа-купе
  const changeSizeWidth = () => {

    const copyVerticalFrames = [...verticalFrames]

    const lastFrame = copyVerticalFrames.sort((itme1, item2) => itme1?.x > item2?.x ? -1 : 1)[0]?.x

    dispatch(changeSizeWidthMain({
      widthClosetChange,
      widthCloset,
      maxWidth, minWidth, widthLeftWall, lastFrame
    }))
    dispatch(changeSizeWallRight({
      widthClosetChange,
      widthCloset,
      maxWidth, minWidth, lastFrame
    }))

    // 50 минимальный размер ячейки

    if (widthClosetChange > maxWidth) {

      dispatch(changeWidth(maxWidth / 5))
      setWidthClosetChange(maxWidth)
      setWidthCanvas(widthCanvas + (maxWidth / 5 - widthCloset))

    } else if (widthClosetChange < minWidth) {

      dispatch(changeWidth(minWidth / 5))
      setWidthClosetChange(minWidth)
      setWidthCanvas(widthCanvas + (minWidth / 5 - widthCloset))


    } else {
      if ((widthClosetChange / 5) < lastFrame + 50) {
        dispatch(changeWidth((lastFrame + 50)))
        setWidthClosetChange((lastFrame + 50) * 5)
        setWidthCanvas(widthCanvas + ((lastFrame + 50) - widthCloset))

      } else {

        dispatch(changeWidth((widthClosetChange / 5)))
        setWidthClosetChange((widthClosetChange))
        setWidthCanvas(widthCanvas + ((widthClosetChange / 5) - widthCloset))
      }


    }

  }


  // функиця по обработки изменений высоты шкафа-купе
  const changeSizeHeight = () => {

    const copyHorizontalFrames = [...horizontalFrames]

    const lastFrame = copyHorizontalFrames.sort((itme1, item2) => itme1?.y > item2?.y ? -1 : 1)[0]?.y

    dispatch(changeSizeHeightMain({ heightCloset, heightClosetChange, maxHeight, minHeight, lastFrame }))
    dispatch(changeSizeHeightLeft({ heightCloset, heightClosetChange, maxHeight, minHeight, lastFrame }))
    dispatch(changeSizeHeightRight({ heightCloset, heightClosetChange, maxHeight, minHeight, lastFrame }))


    if (heightClosetChange > maxHeight) {


      dispatch(changeHeight(maxHeight / 5))
      setHeightClosetChange(maxHeight)
      setHeightCanvas(heightCanvas + (maxHeight / 5 - heightCloset))

    } else if (heightClosetChange < minHeight) {

      if (heightClosetChange / 5 < lastFrame + 50) {


        dispatch(changeHeight(lastFrame + 50))
        setHeightClosetChange((lastFrame + 50) * 5)
        setHeightCanvas(heightCanvas + ((lastFrame + 50) - heightCloset))

      } else {


        dispatch(changeHeight(minHeight / 5))
        setHeightClosetChange(minHeight)
        setHeightCanvas(heightCanvas + (minHeight / 5 - heightCloset))
      }

    } else {
      if (heightClosetChange / 5 < lastFrame + 50) {


        dispatch(changeHeight(lastFrame + 50))
        setHeightClosetChange((lastFrame + 50) * 5)
        setHeightCanvas(heightCanvas + ((lastFrame + 50) - heightCloset))

      } else {


        dispatch(changeHeight(heightClosetChange / 5))
        setHeightClosetChange(heightClosetChange)
        setHeightCanvas(heightCanvas + ((heightClosetChange / 5) - heightCloset))

      }
    }
  }

  // функиця по обработки изменений глубины шкафа-купе
  const changeSizeDepth = () => {
    if (depthClosetChange > maxDepth) {
      dispatch(changeDepth(maxDepth / 5))
      setDepthClosetChange(maxDepth)
    } else if (depthClosetChange < minDepth) {
      dispatch(changeDepth(minDepth / 5))
      setDepthClosetChange(minDepth)
    } else {
      dispatch(changeDepth(depthClosetChange / 5))
      setDepthClosetChange(depthClosetChange)
    }
  }



  // const changeWidthLeftWall = () => {

  //   const changeValue = widthLeftWallChange / 5 - widthLeftWall

  //   dispatch(changeSizeLeftWall({ changeValue: changeValue }))
  //   dispatch(changeSizeMainWall({ changeValue: changeValue }))
  //   dispatch(changeSizeRightWall({ changeValue: changeValue }))
  //   dispatch(replaceWidthLeft(widthLeftWallChange / 5))
  // }



  // const changeWidthRightWall = () => {

  //   const changeValue = widthRightWallChange / 5 - widthRightWall

  //   dispatch(changeWidthRight({ changeValue: changeValue }))
  //   dispatch(replaceWidthRight(widthRightWallChange / 5))
  // }

  // функция для смены цвета, текстры шкафа
  const changeColor = (value, item) => {

    if (value.includes('Images')) {
      dispatch(changeTextureMain({ value, texture: item, LeftInside, RightInside, DownVisable, UpVisable, MainWall }))
      // dispatch(changeTextureLeft({ value }))
      // dispatch(changeTextureRight({ value }))
    } else {
      const mainColor = colors[value].mainColor
      dispatch(changeColorMain({ mainColor: mainColor, texture: colors[value], LeftInside, RightInside, DownVisable, UpVisable, MainWall }))
      // dispatch(changeColorLeft({ mainColor: mainColor }))
      // dispatch(changeColorRight({ mainColor: mainColor }))
    }
  }



  // const changeLeftVisible = (value) => {
  //   setLeftWall(value)
  //   dispatch(leftVisibleWall({ widthLeftWall: widthLeftWall, heightCloset: heightCloset, value }))
  // }

  // const changeRightVisible = (value) => {
  //   setRightWall(value)
  //   dispatch(rightVisibleWall({ widthRightWall: widthRightWall, widthLeftWall: widthLeftWall, heightCloset: heightCloset, widthCloset: widthCloset, value }))
  // }

  const changeMainWall = (value) => {
    setMainWall(value)
    dispatch(changeVisionMainWall({ value }))
  }

  const changeLeftInside = (value) => {
    setLeftInside(value)
    setLeftWall(!value)
    dispatch(changeWallInside({ value, type: 'left' }))
    dispatch(leftVisibleWall({ widthLeftWall: widthLeftWall, heightCloset: heightCloset, value: !value }))
    dispatch(changeSizeFrame({width:widthCloset,type:'left',value}))



  }

  const changeRightInside = (value) => {
    setRightInside(value)
    setRightWall(!value)
    dispatch(changeWallInside({ value, type: 'right' }))
    dispatch(rightVisibleWall({ widthRightWall: widthRightWall, widthLeftWall: widthLeftWall, heightCloset: heightCloset, widthCloset: widthCloset, value: !value }))
    dispatch(changeSizeFrame({width:widthCloset,type:'right',value}))
  }

  const changeUpVisable = (value) => {
    setUpVisable(value)
    dispatch(changeVisibableUp({ value, width: widthCloset }))
  }

  const changeDownVisable = (value) => {
    setDownVisable(value)
    dispatch(changeVisibableDown({ value, height: heightCloset, width: widthCloset }))
  }





  return (
    <div className={style.homePage} id='1'>
      <div className={style.container}>
        <Stage
          width={widthCanvas}
          height={heightCanvas}
          ref={stageRef}
          id="container"
          style={{ position: 'relative' }}
        >
          <Layer x={100} y={50} ref={LayerRef} >
            {/* <Group visible={LeftWall}>
              
              {
                leftBackRectangles.map((item) => {
                  if (item.type === 'line') {
                    return <ElipseTexture
                      key={item.id}
                      x={item.x}
                      y={item.y}
                      fill={item.fill}
                      radiusX={item.radiusX}
                      radiusY={item.radiusY}
                      stroke={1}
                      opacity={item.opacity}
                      strokeWidth={1}
                      texture={item.texture}
                    />
                  } else {
                    return <Rectangle
                      key={item.id}
                      width={item.width}
                      height={item.height}
                      fill={item.fill}
                      listening={false}
                      x={item.x}
                      y={item.y}
                      stroke="black"
                      opacity={item?.opacity}
                      strokeWidth={1}
                      texture={item?.texture && item?.texture}
                    />

                  }

                })
              }
            </Group> */}



            {/* <Group visible={RightWall}>
              {
                rightBackRectangles.map((item, index) => {
                  if (item?.type === 'line') {
                    return <ElipseTexture
                      key={item.id}
                      x={item.x}
                      y={item.y}
                      fill={item.fill}
                      radiusX={item.radiusX}
                      radiusY={item.radiusY}
                      stroke={1}
                      opacity={item.opacity}
                      strokeWidth={1}
                      texture={item.texture}
                    />
                  } else {
                    return <Rectangle
                      key={item.id}
                      width={item.width}
                      height={item.height}
                      fill={item.fill}
                      listening={false}
                      x={item.x}
                      y={item.y}
                      stroke="black"
                      opacity={item?.opacity}
                      strokeWidth={1}
                      texture={item?.texture && item?.texture}
                    />

                  }

                })
              }
            </Group> */}

            <Group>
              {
                mainBackRectangles.map((item) => {
                  if (item?.type === 'line') {
                    return <Poligon
                      key={item.id}
                      points={item.points}
                      closed={true}
                      tension={item.tension}
                      fill={item.fill}
                      stroke={'black'}
                      texture={item?.texture}
                      draggable={true}
                    />
                  } else {
                    return <Rectangle
                      key={item.id}
                      width={item.width}
                      height={item.height}
                      fill={item.fill}
                      listening={false}
                      x={item.x}
                      y={item.y}
                      stroke="black"
                      opacity={item?.opacity}
                      strokeWidth={1}
                      texture={item?.texture && item?.texture}
                    />
                  }
                })
              }


            </Group>

            <Group visible={LeftWall}>

              <Rect
                x={0}
                y={0}
                height={heightCloset}
                width={105}
                fill="gray"
                stroke='black'
                strokeWidth={1}
              />

            </Group>
            <Group visible={RightWall}>
              <Rect
                x={95 + widthCloset}
                y={0}
                height={heightCloset}
                width={100}
                fill="gray"
                stroke='black'
                strokeWidth={1}
              />
            </Group>

            {/* <Group>
              {
                leftRectangels.map((item) =>

                  <Rectangle
                    key={item.id}
                    width={item.width}
                    height={item.height}
                    fill={item.color || null}
                    x={item.x}
                    y={item.y}
                    id={item.id}
                    stroke="black"
                    opacity={item?.opacity}
                    derection={item?.derection}
                    draggable={item.draggable || false}
                    strokeWidth={item.type === 'frame' && 0.3}
                    type={item.type}
                    dragover={dragover}
                    onDragStart={() => dispatch(DragStarHorizontalLeft({ itemSelect: item }))}
                    texture={item?.texture && item?.texture}
                    onDragEnd={(e) => onDragEndLeft(e.evt.layerX - 100, e.evt.layerY - 50, item.id)}
                  />
                )
              }

            </Group> */}

            <Group>
              {
                Rectangels.map((item) =>

                  <Rectangle
                    key={item.id}
                    width={item.width}
                    widthShow={item.widthShow}
                    height={item.height}
                    heightShow={item.heightShow}
                    // fill={item.color || 'black'}
                    fill={item.color}
                    listening={false}
                    x={item.x}
                    y={item.y}
                    id={item.id}
                    stroke="black"
                    // stroke='white'
                    opacity={item?.opacity}
                    clickCheck={clickCheck}
                    derection={item?.derection}
                    draggable={item.draggable || false}
                    strokeWidth={item.type === 'frame' && 0.3}
                    // strokeWidth={1}
                    type={item.type}
                    dragover={dragover}
                    onDragStart={() => onDragStartFrame(item)}
                    texture={item?.texture && item?.texture}
                    onDragEnd={(e) => onDragEndFrame(e.evt.layerX - 100, e.evt.layerY - 50, item.id, item.frameID, item.derection)}
                  />
                )
              }

              {
                selectedRectId && <Rectangle
                  x={showObject.x}
                  y={showObject.y}
                  width={showObject.width}
                  height={showObject.height}
                  fill={!intersection ? '#99ff99' : 'red'}
                  opacity={showObject.opacity}

                />
              }
              {
                elements.map(item =>

                  <UrlImage
                    key={item.id}
                    image={item}
                    dragover={dragover}
                    clickCheck={clickCheck}
                    onDragStart={() => onDragStartElements(item.type, item)}
                    onDragEnd={(e) => onDragEndElements(e.evt.layerX - 100, e.evt.layerY - 50, item.id, item.type, item?.copyHeight)}
                  />

                )

              }




            </Group>


            {/* <Group>
              {
                RightRectangels.map((item) =>

                  <Rectangle
                    key={item.id}
                    width={item.width}
                    height={item.height}
                    fill={item.color || null}
                    x={item.x}
                    dragover={dragover}
                    y={item.y}
                    id={item.id}
                    stroke="black"
                    opacity={item?.opacity}
                    derection={item?.derection}
                    draggable={item.draggable || false}
                    strokeWidth={item.type === 'frame' && 0.3}
                    type={item.type}
                    onDragStart={() => dispatch(DragStarHorizontalRight({ itemSelect: item }))}
                    texture={item?.texture && item?.texture}
                    onDragEnd={(e) => onDragEndRight(e.evt.layerX - 100, e.evt.layerY - 50, item.id)}
                  />
                )
              }
            </Group> */}

            <Metrics width={widthCloset}
              height={heightCloset}
              widthLeftWall={widthLeftWall}
              widthRightWall={widthRightWall}
              LeftWall={LeftWall}
              RightWall={RightWall}

            />
          </Layer>
        </Stage>
      </div>


      <div className={style.menu} style={{ backgroundColor: !showMenu ? 'white' : '#d9d9d9' }}>
        <div>
          {

            showMenu && <div className={style.menu__header}>
              <p className={style.menu__title}>Шкаф</p>
              <p className={style.menu__subtitle}>Стандратное описание</p>
            </div>
          }

          {

            showMenu && <div className={style.menu__container}>
              <div onClick={() => {
                setShowMenu(false)
                setShowSize(true)
              }} className={style.menu__item}><img src="./images/arrow_down.png" /><p>Размеры</p></div>
              <div onClick={() => {
                setShowMenu(false)
                setShowPartition(true)
              }} className={style.menu__item}><img src="./images/arrow_down.png" /><p>Наполнение</p></div>
              <div onClick={() => {
                setShowMenu(false)
                setShowElements(true)
              }} className={style.menu__item}><img src="./images/arrow_down.png" /><p>Доп. элементы</p></div>
            </div>
          }</div>


        {showMenu && <div className={style.menu__btnContainer}>
          <div className={style.menu__backBtn} onClick={() => navigate('/door')}><p>Далее</p></div>
        </div>}

        {/* {showMenu && <div className={style.menu__btnContainer}>
          <div className={style.menu__backBtn} onClick={sumSquare}><p>Далее</p></div>
        </div>} */}

        {
          showSize &&
          <div className={style.menu__inputs}>
            <div>
              <div className={style.menu__inputSize}>

                <p className={style.menu__inputSize_title}>Размеры</p>

                <div className={style.menu__inputSize_container}>

                  <div className={style.menu__inputSize_item}>
                    <p>Ширина</p>
                    <input className={style.input__size} onBlur={changeSizeWidth} onChange={(e) => setWidthClosetChange(Number(e.target.value))} value={widthClosetChange} step={100} type="number" />

                  </div>
                  <div className={style.menu__inputSize_item}>
                    <p>Высота</p>
                    <input className={style.input__size} onBlur={changeSizeHeight} onChange={(e) => setHeightClosetChange(Number(e.target.value))} value={heightClosetChange} step={50} type="number" />

                  </div>
                  <div className={style.menu__inputSize_item}>
                    <p>Глубина</p>
                    <input className={style.input__size} onBlur={changeSizeDepth} onChange={(e) => setDepthClosetChange(Number(e.target.value))} value={depthClosetChange} step={100} type="number" />

                  </div>
                </div>
                {/* <div className={style.menu__inputSize_container}>

                  <div className={style.menu__inputSize_item}>
                    <p>Ширина лев. стенки</p>
                    <input className={style.input__size} onBlur={changeWidthLeftWall} onChange={(e) => setWidthLeftWallChange(Number(e.target.value))} value={widthLeftWallChange} step={10} type="number" />

                  </div>
                  <div className={style.menu__inputSize_item}>
                    <p>Ширина пр. стенки</p>
                    <input className={style.input__size} onBlur={changeWidthRightWall} onChange={(e) => setWidthRightWallChange(Number(e.target.value))} value={widthRightWallChange} step={10} type="number" />

                  </div>
                </div> */}
              </div>
              <div className={style.menu__checkboxContainer}>

                {/* <label className={style.checkbox}>
                  <input checked={LeftWall} onChange={e => changeLeftVisible(e.target.checked)} type="checkbox" />
                  <div className={style.checkbox__checkmark}></div>
                  <div className={style.checkbox__body}>Задняя левая стенка</div>
                </label>
                <label className={style.checkbox}>
                  <input checked={RightWall} onChange={e => changeRightVisible(e.target.checked)} type="checkbox" />
                  <div className={style.checkbox__checkmark}></div>
                  <div className={style.checkbox__body}>  Задняя правая стенка</div>
                </label> */}
                <label className={style.checkbox}>
                  <input checked={MainWall} onChange={e => changeMainWall(e.target.checked)} type="checkbox" />
                  <div className={style.checkbox__checkmark}></div>
                  <div className={style.checkbox__body}>  Задняя стенка</div>
                </label>
                <label className={style.checkbox}>
                  <input checked={LeftInside} onChange={e => changeLeftInside(e.target.checked)} type="checkbox" />
                  <div className={style.checkbox__checkmark}></div>
                  <div className={style.checkbox__body}> Левая боковая стенка</div>
                </label>
                <label className={style.checkbox}>
                  <input checked={RightInside} onChange={e => changeRightInside(e.target.checked)} type="checkbox" />
                  <div className={style.checkbox__checkmark}></div>
                  <div className={style.checkbox__body}>  Правая боковая стенка</div>
                </label>
                <label className={style.checkbox}>
                  <input checked={UpVisable} onChange={e => changeUpVisable(e.target.checked)} type="checkbox" />
                  <div className={style.checkbox__checkmark}></div>
                  <div className={style.checkbox__body}>   Верхняя крышка</div>
                </label>
                <label className={style.checkbox}>
                  <input checked={DownVisable} onChange={e => changeDownVisable(e.target.checked)} type="checkbox" />
                  <div className={style.checkbox__checkmark}></div>
                  <div className={style.checkbox__body}> Дно</div>
                </label>





              </div>


              <p className={style.menu__colorsTitle}>Цвет корпуса</p>

              <div className={style.menu__colorsContainer}>
                {

                  colors.map((item, index) =>
                    <div className={style.menu__colorsContainer_item}>
                      <div
                        onClick={() => changeColor(String(index))}
                        style={{ backgroundColor: item.mainColor, border: item.id == selectedTextura.id ? '2px solid black' : null }}
                        className={style.menu__colorsContainer_img} >
                      </div>
                      <p>{item.title}</p>
                    </div>

                  )
                }
                {
                  textures?.map(item =>
                    <div className={style.menu__colorsContainer_item}>
                      <div onClick={() => changeColor(item.img, item)}
                        style={{
                          backgroundImage: `url(http://127.0.0.1:8000/${item.img})`,
                          backgroundColor: item.mainColor,
                          border: item.id == selectedTextura.id ? '2px solid black' : null
                        }}
                        className={style.menu__colorsContainer_img} >

                      </div>
                      <p className={style.menu__colorsContainer_title} >{item.title}</p>
                    </div>
                  )
                }
              </div>



            </div>



            <div className={style.menu__btnContainer}>
              <div className={style.menu__backBtn} onClick={() => {
                setShowMenu(true)
                setShowSize(false)
              }}><img src="./images/cross.png" /><p>Свернуть</p></div>
            </div>

          </div>
        }

        {
          showPartition &&
          <div className={style.menu__inputs}>

            <div>
              <div className={style.menu__inputSize}>

                <p className={style.menu__inputSize_title}>Перегородки</p>
                <div className={style.menu__partitionContainer}>
                  <div className={style.menu__partitionItem} >
                    <div className={style.menu__imgContainer}>
                      <img draggable={true} onDragStart={() => setDerection('1')} src="./images/vertical.png" />
                    </div>

                    <p>Вертикальная перегородка</p>
                  </div>

                  <div className={style.menu__partitionItem}>
                    <div className={style.menu__imgContainer}>

                      <img draggable={true} onDragStart={() => setDerection('2')} src="./images/horizont.png" />
                    </div>

                    <p>Полка</p>
                  </div>
                </div>


              </div>

            </div>

            <div className={style.menu__btnContainer}>
              <div className={style.menu__backBtn} onClick={() => {
                setShowMenu(true)
                setShowPartition(false)
              }}><img src="./images/cross.png" /><p>Свернуть</p></div>
            </div>
          </div>
        }
        {
          showElements &&
          <div className={style.menu__inputs}>


            <div>
              <div className={style.menu__inputSize}>

                <p className={style.menu__inputSize_title}>Дополнительные элементы</p>
                <div className={style.menu__partitionContainer}>

                  <div className={style.menu__partitionItem} >
                    <div className={style.menu__imgContainer}>
                      <img draggable={true} onDragStart={() => setDerection('3')} src="./images/штанга.png" />
                    </div>
                    <p>Штанга</p>
                  </div>

                  <div className={style.menu__partitionItem}>
                    <div className={style.menu__imgContainer}>
                      <img draggable={true} onDragStart={() => setDerection('4')} src="./images/hanger.png" />
                    </div>
                    <p>Вешалка</p>
                  </div>
                  <div className={style.menu__partitionItem}>
                    <div className={style.menu__imgContainer}>
                      <img draggable={true} onDragStart={() => {
                        setheightDrawer(40)
                        setDerection('6')
                      }} src="./images/box.png" />
                    </div>
                    <p>Ящик</p>
                  </div>
                </div>


              </div>

            </div>



            <div className={style.menu__btnContainer}>
              <div className={style.menu__backBtn} onClick={() => {
                setShowMenu(true)
                setShowElements(false)
              }}><img src="./images/cross.png" /><p>Свернуть</p></div>
            </div>
          </div>
        }
      </div>

    </div>
  );
}



export default HomePage
