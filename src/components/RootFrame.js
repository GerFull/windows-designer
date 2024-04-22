import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer, Group } from "react-konva";
import style from '../css/RootFrame.module.scss'
import { useDispatch, useSelector } from 'react-redux';
import Metrics from "./Metrics";
import Poligon from "./Figures/Poligon";
import ElipseTexture from "./Figures/Elipse";
import Rectangle from "./Figures/Rectangle";
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
  checkIntercetion, changeVisibableDown
} from "../store/slice/mainRectangles";
import {
  createHorizontalLeft, DragStarHorizontalLeft,
  deleteItemLeft, changeSizeHeightLeft,
  changeSizeLeftWall, changeColorLeft,
  changeTextureLeft, leftVisibleWall
} from "../store/slice/leftRectangles";
import {
  createHorizontalRight, DragStarHorizontalRight,
  deleteItemRight, changeSizeHeightRight,
  changeSizeWallRight, changeSizeRightWall,
  changeWidthRight, changeColorRight, changeTextureRight,
  rightVisibleWall

} from "../store/slice/rightRectangles";
import { changeWidth, changeHeight, replaceWidthRight, replaceWidthLeft, changeDepth } from "../store/slice/globalVariable";
import UrlImage from "./Figures/UrlImage";


// скрыть админку


// переделать SelectdeRectId сделать его глобальным



// делать минус 100 так как layer сдвинули на 100 по x и y
// 1 пиксель 5мм


// документация подписать за что отвечает каждый блок
// попробывать использовать useCallback для dragOver



const FRAME_SIZE = 5;


const colors = [{
  mainColor: '#efcf9f',
  name: 'Стандартный'
},
{
  mainColor: 'white',
  name: 'Белый'
},
{
  mainColor: '#3d6990',
  name: 'Синий'
}
]

function RootFrame() {
  const { maxHeight, minHeight, maxWidth, minWidth, widthCloset, heightCloset, depthCloset, widthLeftWall, widthRightWall } = useSelector(store => store.globalVariable)
  const { Rectangels, mainBackRectangles, verticalFrames, horizontalFrames, elements, intersection } = useSelector(store => store.mainRectangles)
  const { leftRectangels, leftBackRectangles } = useSelector(store => store.leftRectangels)
  const { RightRectangels, rightBackRectangles } = useSelector(store => store.rightRectangels)

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

  const [colorValue, setColorValue] = useState(0)

  const [LeftWall, setLeftWall] = useState(false)
  const [RightWall, setRightWall] = useState(false)
  const [MainWall, setMainWall] = useState(true)
  const [LeftInside, setLeftInside] = useState(true)
  const [RightInside, setRightInside] = useState(true)
  const [UpVisable, setUpVisable] = useState(true)
  const [DownVisable, setDownVisable] = useState(true)

  const [textures, setTextures] = useState([])

  const LayerRef = useRef(null)
  const [selectedRectId, setSelectedRectId] = useState(null)
  const [derection, setDerection] = useState(null)
  const [showObject, setShowObject] = useState({ fill: '#99ff99', opacity: 0.7, width: 10, height: 10, x: 0, y: 0 })


  const [showMenu, setShowMenu] = useState(true)
  const [showSize, setShowSize] = useState(false)
  const [showPartition, setShowPartition] = useState(false)
  const [showElements, setShowElements] = useState(false)


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
          // dispatch(checkIntercetion({ element: { width: FRAME_SIZE, height: item.height, x: x, y: item.y } }))
          setShowObject({ ...showObject, width: FRAME_SIZE, height: item.height, x: x, y: item.y })
          break;
        case '2':
          // dispatch(checkIntercetion({ element: { width: item.width, height: FRAME_SIZE, x: item.x, y: y } }))
          setShowObject({ ...showObject, width: item.width, height: FRAME_SIZE, x: item.x, y: y })
          break;
        case '3':
          setShowObject({ ...showObject, width: item.width, height: 20, x: item.x, y: y })
          break;
        case '4':
          // dispatch(checkIntercetion({ element: { width: 100, height: 130, x: x, y: item.y } }))
          setShowObject({ ...showObject, width: 100, height: 130, x: x, y: item.y })
          break;
        case '6':
          setShowObject({ ...showObject, width: item.width, height: 20, x: item.x, y: y })
          break;

        default:
          break;
      }

    } else setSelectedRectId(null)

  }

  const fetchData = async () => {
    await axios.get('http://127.0.0.1:8000/api/Textures/').then(res => setTextures(res.data)).catch(err => console.log(err))
  }


  // console.log(elements)



  // console.log(derection)

  useEffect(() => {
    fetchData()
  }, [])


  useEffect(() => {
    const con = stageRef.current.container()
    con.addEventListener('dragover', dragover)

    con.addEventListener('drop', drop)

    return () => {
      con.removeEventListener('dragover', dragover)
      con.removeEventListener('drop', drop)
    }

  }, [Rectangels, derection, selectedRectId, leftRectangels, RightRectangels])



  const onDragEndMain = (x, y, shadowid, mainId, derection) => {

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


  const onDragEndElements = (x, y, id, type) => {

    setShowObject({ fill: '#99ff99', opacity: 0.7, width: 0, height: 0, x: 0, y: 0 })


    if ((x > 100 && x < 100 + widthCloset) && (y > 0 && y < heightCloset)) {

      switch (type) {
        case 'element':
          dispatch(createNewBurb({ xk: x, yk: y, idd: id, widthLeftWall, widthCloset }))
          break;
        case 'hanger':
          dispatch(createHanger({ xk: x, yk: y, idd: id, widthLeftWall: widthLeftWall }))
          break;
        case 'drawer':
          dispatch(createDrawer({ xk: x, yk: y, idd: id }))
          break;
        case 'sidehanger':
          dispatch(createSideHanger({ xk: x, yk: y, idd: id, widthCloset: widthCloset }))
          break;
      }



    } else {

      dispatch(deleteElement({ id: id }))
    }

  }


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
        dispatch(DragStartHanger({ itemSelect: item }))
        break;

      default:
        break;
    }
  }


  const onDragEndLeft = (x, y, id) => {
    setShowObject({ fill: '#99ff99', opacity: 0.7, width: 0, height: 0, x: 0, y: 0 })
    if ((x > 0 && x < widthLeftWall) && (y > 20 && y < y + heightCloset - 20)) {
      dispatch(
        createHorizontalLeft(
          { xk: x, yk: y, idd: id }
        )
      )

    } else {
      dispatch(deleteItemLeft({ id: id }))
    }



  }

  const onDragEndRight = (x, y, id) => {
    setShowObject({ fill: '#99ff99', opacity: 0.7, width: 0, height: 0, x: 0, y: 0 })

    if ((x > widthLeftWall + widthCloset && x < widthLeftWall + widthCloset + widthLeftWall) && (y > 20 && y < y + heightCloset - 20)) {

      dispatch(
        createHorizontalRight(
          { xk: x, yk: y, idd: id }
        )
      )

    } else {
      dispatch(deleteItemRight({ id: id }))

    }



  }




  function clickCheck(props) {

    // console.log(props.attrs)

    if (props.attrs.type === "drawer") {
      createInput(props.getAbsolutePosition(), props.attrs.height, props.attrs)
    }
    if (props.attrs.derection === 2 && props.attrs.width < widthCloset - 10) {
      createInput(props.getAbsolutePosition(), props.attrs.width, props.attrs)
    }
    if (props.attrs.derection === 1 && props.attrs.height < heightCloset - 10) {
      createInput(props.getAbsolutePosition(), props.attrs.height, props.attrs)
    }

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
    input.className=style.input__size
    input.style.top = pos.y + 3 + 'px';
    input.style.left = pos.x + 'px';

    input.style.height = 20 + 3 + 'px';
    input.style.width = 100 + 3 + 'px';
    input.value = (value + 2) * 5

    if (item?.derection === 2) {
      input.onblur = (e) => dispatch(onBlurInputHorizontal({ value: e.currentTarget?.value / 5, containerDiv, wrap, itemSelect: item, width: item.width }))
    }
    if (item?.derection === 1) {
      input.onblur = (e) => dispatch(onBlurInputVertical({ value: e.currentTarget?.value / 5, containerDiv, wrap, itemSelect: item, height: item.height }))
    }
    if (item.type === 'drawer') {
      input.value = value * 5
      input.onblur = (e) => dispatch(onBlurInputDrawer({ value: e.currentTarget?.value / 5, containerDiv, wrap, itemSelect: item, height: item.height }))
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

    const copyVerticalFrames = [...verticalFrames]

    const lastFrame = copyVerticalFrames.sort((itme1, item2) => itme1?.x > item2?.x ? -1 : 1)[0]?.x



    dispatch(changeSizeWidthMain({ widthClosetChange, widthCloset, maxWidth, minWidth, widthLeftWall, lastFrame }))
    dispatch(changeSizeWallRight({ widthClosetChange, widthCloset, maxWidth, minWidth, lastFrame }))

    // 50 минимальный размер ячейки

    if (widthClosetChange > maxWidth) {

      dispatch(changeWidth(maxWidth / 5))
      setWidthClosetChange(maxWidth)
      setWidthCanvas(widthCanvas + (maxWidth / 5 - widthCloset))

    } else if (widthClosetChange < minWidth) {

      if ((widthClosetChange / 5) < lastFrame + 50) {

        dispatch(changeWidth((lastFrame + 50)))
        setWidthClosetChange((lastFrame + 50) * 5)
        setWidthCanvas(widthCanvas + ((lastFrame + 50) - widthCloset))
      } else {
        dispatch(changeWidth(minWidth / 5))
        setWidthClosetChange(minWidth)
        setWidthCanvas(widthCanvas + (minWidth / 5 - widthCloset))

      }

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


  // console.log(Rectangels)

  const changeSizeHeight = () => {

    const copyHorizontalFrames = [...horizontalFrames]

    const lastFrame = copyHorizontalFrames.sort((itme1, item2) => itme1?.y > item2?.y ? -1 : 1)[0]?.y

    dispatch(changeSizeHeightMain({ heightCloset, heightClosetChange, maxHeight, minHeight, lastFrame }))
    dispatch(changeSizeHeightLeft({ heightCloset, heightClosetChange, maxHeight, minHeight, lastFrame }))
    dispatch(changeSizeHeightRight({ heightCloset, heightClosetChange, maxHeight, minHeight, lastFrame }))


    if (heightClosetChange > maxHeight) {


      dispatch(changeHeight(maxHeight / 5))
      setHeightClosetChange(maxHeight)

    } else if (heightClosetChange < minHeight) {
      if (heightClosetChange / 5 < lastFrame + 50) {


        dispatch(changeHeight(lastFrame + 50))
        setHeightClosetChange((lastFrame + 50) * 5)

      } else {


        dispatch(changeHeight(minHeight / 5))
        setHeightClosetChange(minHeight)

      }

    } else {
      if (heightClosetChange / 5 < lastFrame + 50) {


        dispatch(changeHeight(lastFrame + 50))
        setHeightClosetChange((lastFrame + 50) * 5)

      } else {


        dispatch(changeHeight(heightClosetChange / 5))

      }
    }
  }

  const changeSizeDepth = () => {
    dispatch(changeDepth(depthClosetChange / 5))
  }



  const changeWidthLeftWall = () => {

    const changeValue = widthLeftWallChange / 5 - widthLeftWall

    dispatch(changeSizeLeftWall({ changeValue: changeValue }))
    dispatch(changeSizeMainWall({ changeValue: changeValue }))
    dispatch(changeSizeRightWall({ changeValue: changeValue }))
    dispatch(replaceWidthLeft(widthLeftWallChange / 5))
  }



  const changeWidthRightWall = () => {

    const changeValue = widthRightWallChange / 5 - widthRightWall

    dispatch(changeWidthRight({ changeValue: changeValue }))
    dispatch(replaceWidthRight(widthRightWallChange / 5))
  }

  const changeColor = (value) => {


    if (value.includes('Images')) {
      dispatch(changeTextureMain({ value }))
      dispatch(changeTextureLeft({ value }))
      dispatch(changeTextureRight({ value }))
    } else {

      const mainColor = colors[value].mainColor

      dispatch(changeColorMain({ mainColor: mainColor }))
      dispatch(changeColorLeft({ mainColor: mainColor }))
      dispatch(changeColorRight({ mainColor: mainColor }))


    }

    setColorValue(value)
  }



  const changeLeftVisible = (value) => {
    setLeftWall(value)
    dispatch(leftVisibleWall({ widthLeftWall: widthLeftWall, heightCloset: heightCloset }))
  }

  const changeRightVisible = (value) => {
    setRightWall(value)
    dispatch(rightVisibleWall({ widthRightWall: widthRightWall, widthLeftWall: widthLeftWall, heightCloset: heightCloset, widthCloset: widthCloset }))
  }

  const changeMainWall = (value) => {
    setMainWall(value)
    dispatch(changeVisionMainWall({ value }))

  }

  const changeLeftInside = (value) => {
    setLeftInside(value)
    dispatch(changeWallInside({ value, type: 'left' }))
  }

  const changeRightInside = (value) => {
    setRightInside(value)
    dispatch(changeWallInside({ value, type: 'right' }))
  }

  const changeUpVisable = (value) => {
    setUpVisable(value)
    dispatch(changeVisibableUp({ value, }))
  }
  const changeDownVisable = (value) => {
    setDownVisable(value)
    dispatch(changeVisibableDown({ value }))
  }


  const onDragStartFrame = (item) => {

    if (item.derection === 1) {
      setDerection('1')
      dispatch(DragStarVertical({ itemSelect: item }))
    } else {
      setDerection('2')
      dispatch(DragStarHorizontal({ itemSelect: item }))
    }


  }
  {/* <button onClick={() => navigate('/admin')}>admin</button> */ }


  return (
    <div className={style.homePage} id='1'>

      <div className={style.container}>
        <Stage
          width={widthCanvas}
          height={700}
          ref={stageRef}
          id="container"
          style={{ position: 'relative' }}
        >
          <Layer x={100} y={50} ref={LayerRef} >
            <Group visible={LeftWall}
            >
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
            </Group>
            <Group visible={RightWall}>
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
            </Group>

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

            <Group

            >
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

            </Group>

            <Group
            >
              {
                Rectangels.map((item) =>

                  <Rectangle
                    key={item.id}
                    width={item.width}
                    height={item.height}
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
                    onDragEnd={(e) => onDragEndMain(e.evt.layerX - 100, e.evt.layerY - 50, item.id, item.frameID, item.derection)}
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
                    onDragEnd={(e) => onDragEndElements(e.evt.layerX - 100, e.evt.layerY - 50, item.id, item.type)}
                  />

                )

              }




            </Group>


            <Group

            >
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
            </Group>

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
              }} className={style.menu__item}><img src="./images/arrow_down.png" /><p>Перегородки</p></div>
              <div onClick={() => {
                setShowMenu(false)
                setShowElements(true)
              }} className={style.menu__item}><img src="./images/arrow_down.png" /><p>Доп. элементы</p></div>
            </div>
          }</div>


        {showMenu && <div className={style.menu__btnContainer}>
          <div className={style.menu__backBtn} onClick={() => navigate('/door')}><p>Далее</p></div>
        </div>}

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
                <div className={style.menu__inputSize_container}>

                  <div className={style.menu__inputSize_item}>
                    <p>Ширина лев. стенки</p>
                    <input className={style.input__size} onBlur={changeWidthLeftWall} onChange={(e) => setWidthLeftWallChange(Number(e.target.value))} value={widthLeftWallChange} step={10} type="number" />

                  </div>
                  <div className={style.menu__inputSize_item}>
                    <p>Ширина пр. стенки</p>
                    <input className={style.input__size} onBlur={changeWidthRightWall} onChange={(e) => setWidthRightWallChange(Number(e.target.value))} value={widthRightWallChange} step={10} type="number" />

                  </div>
                </div>
              </div>
              <div className={style.menu__checkboxContainer}>

                <label class={style.checkbox}>
                  <input checked={LeftWall} onChange={e => changeLeftVisible(e.target.checked)} type="checkbox" />
                  <div class={style.checkbox__checkmark}></div>
                  <div class={style.checkbox__body}>Задняя левая стенка</div>
                </label>
                <label class={style.checkbox}>
                  <input checked={RightWall} onChange={e => changeRightVisible(e.target.checked)} type="checkbox" />
                  <div class={style.checkbox__checkmark}></div>
                  <div class={style.checkbox__body}>  Задняя правая стенка</div>
                </label>
                <label class={style.checkbox}>
                  <input checked={MainWall} onChange={e => changeMainWall(e.target.checked)} type="checkbox" />
                  <div class={style.checkbox__checkmark}></div>
                  <div class={style.checkbox__body}>  Задняя стенка</div>
                </label>
                <label class={style.checkbox}>
                  <input checked={LeftInside} onChange={e => changeLeftInside(e.target.checked)} type="checkbox" />
                  <div class={style.checkbox__checkmark}></div>
                  <div class={style.checkbox__body}>     Левая стенка</div>
                </label>
                <label class={style.checkbox}>
                  <input checked={RightInside} onChange={e => changeRightInside(e.target.checked)} type="checkbox" />
                  <div class={style.checkbox__checkmark}></div>
                  <div class={style.checkbox__body}>  Правая стенка</div>
                </label>
                <label class={style.checkbox}>
                  <input checked={UpVisable} onChange={e => changeUpVisable(e.target.checked)} type="checkbox" />
                  <div class={style.checkbox__checkmark}></div>
                  <div class={style.checkbox__body}>   Потолок</div>
                </label>
                <label class={style.checkbox}>
                  <input checked={DownVisable} onChange={e => changeDownVisable(e.target.checked)} type="checkbox" />
                  <div class={style.checkbox__checkmark}></div>
                  <div class={style.checkbox__body}> Дно</div>
                </label>





              </div>


              <p className={style.menu__colorsTitle}>Цвет</p>

              <div className={style.menu__colorsContainer}>
                {
                  colors.map((item, index) => <div onClick={() => changeColor(String(index))} style={{ backgroundColor: item.mainColor, border: index == colorValue ? '2px solid black' : null }} className={style.menu__colorsContainer_item} ></div>)
                }
                {
                  textures?.map(item => <div onClick={() => changeColor(item.img)} style={{ backgroundImage: `url(http://127.0.0.1:8000/${item.img})`, backgroundColor: item.mainColor, border: item.img == colorValue ? '2px solid black' : null }} className={style.menu__colorsContainer_item} ></div>)
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
                    <img draggable={true} onDragStart={() => setDerection('1')} src="./images/vertical.png" />
                    <p>Вертикальная перегородка</p>
                  </div>

                  <div className={style.menu__partitionItem}>
                    <img draggable={true} onDragStart={() => setDerection('2')} src="./images/horizont.png" />
                    <p>Горизонталная перегородка</p>
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
                    <img draggable={true} onDragStart={() => setDerection('3')} src="./images/штанга.png" />
                    <p>Штанга</p>
                  </div>

                  <div className={style.menu__partitionItem}>
                    <img draggable={true} onDragStart={() => setDerection('4')} src="./images/вешалка.jpg" />
                    <p>Вешалка</p>
                  </div>
                  <div className={style.menu__partitionItem}>
                    <img draggable={true} onDragStart={() => setDerection('6')} src="./images/horizont.png" />
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



export default RootFrame
