import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer, Rect, Group, Image } from "react-konva";
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
  createNewBurb, DragStarElement,
  createHanger, createSideHanger, DragStartHanger,
  deleteElement,createDrawer
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
import { changeWidth, changeHeight, replaceWidthRight, replaceWidthLeft } from "../store/slice/globalVariable";
import UrlImage from "./Figures/UrlImage";


// скрыть админку
// Stroke рамое меняется при установке новый рядом

// переделать SelectdeRectId сделать его глобальным




// делать минус 100 так как layer сдвинули на 100 по x и y
// баг с input выделение с выходом за пределы 
// 1 пиксель 5мм


// документация подписать за что отвечает каждый блок

// баг вешалка ставиться за шкаф если край внутри шкафа
// менять x у элементов при увеличении ширины левой стенки


// ширина и высота футболки измерить)
// по умолчанию 3 метра

// цвет кромки внутри цвет одинаковый внешне
// ящик прямуголник( с изменяемой высотой) по умолчанию 100 мм без углубления


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

function RootFrame() {
  const { maxHeight, minHeight, maxWidth, minWidth, widthCloset, heightCloset, widthLeftWall, widthRightWall } = useSelector(store => store.globalVariable)
  const { Rectangels, mainBackRectangles, verticalFrames, horizontalFrames, elements } = useSelector(store => store.mainRectangles)
  const { leftRectangels, leftBackRectangles } = useSelector(store => store.leftRectangels)
  const { RightRectangels, rightBackRectangles } = useSelector(store => store.rightRectangels)

  const state = useSelector(store => store)

  const dispatch = useDispatch()

  const stageRef = useRef(null)

  const navigate = useNavigate()

  const [widthClosetChange, setWidthClosetChange] = useState(widthCloset * 5)

  const [heightClosetChange, setHeightClosetChange] = useState(heightCloset * 5)

  const [widthLeftWallChange, setWidthLeftWallChange] = useState(widthLeftWall * 5)

  const [widthRightWallChange, setWidthRightWallChange] = useState(widthRightWall * 5)

  const [colorValue, setColorValue] = useState(0)

  const [LeftWall, setLeftWall] = useState(false)
  const [RightWall, setRightWall] = useState(false)
  const [MainWall, setMainWall] = useState(true)

  const [textures, setTextures] = useState([])

  const LayerRef = useRef(null)
  const [selectedRectId, setSelectedRectId] = useState(null)
  const [derection, setDerection] = useState(null)



  const drop = (e) => {

    e.preventDefault();


    if (selectedRectId !== null) {

      if (Rectangels.includes(selectedRectId)) {
        if (derection === '1') {
          dispatch(
            createVertical(
              { xk: e.layerX - 100, yk: e.layerY - 100, widthLeftWall: widthLeftWall }
            )
          )
        }
        if (derection === '2') {
          dispatch(
            createHorizontal(
              { xk: e.layerX - 100, yk: e.layerY - 100, selectedRectId: selectedRectId }
            )
          )
        }
        if (derection === '3') {
          dispatch(
            createNewBurb({ xk: e.layerX - 100, yk: e.layerY - 100 })
          )
        }
        if (derection === '4') {
          dispatch(
            createHanger({ xk: e.layerX - 100, yk: e.layerY - 100, widthLeftWall: widthLeftWall })
          )
        }
        if (derection === '5') {
          dispatch(
            createSideHanger({ xk: e.layerX - 100, yk: e.layerY - 100, widthCloset: widthCloset })
          )
        }
        if (derection === '6') {
          dispatch(
            createDrawer({ xk: e.layerX - 100, yk: e.layerY - 100, widthCloset: widthCloset })
          )
        }
      }

      else if (leftRectangels.includes(selectedRectId) && LeftWall && derection === '2') {

        dispatch(
          createHorizontalLeft(
            { xk: e.layerX - 100, yk: e.layerY - 100, }
          )
        )
      } else if (RightRectangels.includes(selectedRectId) && RightWall && derection === '2') {
        dispatch(
          createHorizontalRight(
            { xk: e.layerX - 100, yk: e.layerY - 100, }
          )
        )
      }



      setSelectedRectId(null)

    }


  }


  const dragover = (e) => {



    e.preventDefault();
    const x = e.layerX - 100
    const y = e.layerY - 100
    //props.store.mousePosition(x, y);

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

  const fetchData = async () => {
    await axios.get('http://127.0.0.1:8000/api/Textures/').then(res => setTextures(res.data)).catch(err => console.log(err))
  }


  // console.log(elements)

  useEffect(() => {
    // fetchData()
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



  const onDragEndMain = (x, y, id, derection) => {


    if ((x > 100 && x < 100 + widthCloset) && (y > 0 && y < y + heightCloset)) {

      if (derection === 1) {
        dispatch(createVertical({ xk: x, yk: y, idd: id, widthLeftWall: widthLeftWall }))
      } else {
        dispatch(createHorizontal({ xk: x, yk: y, idd: id }))
      }

    } else {
      dispatch(deleteRectangle({ id: id }))
    }
  }


  const onDragEndElements = (x, y, id, type) => {




    if ((x > 100 && x < 100 + widthCloset) && (y > 0 && y < heightCloset)) {

      switch (type) {
        case 'element':
          dispatch(createNewBurb({ xk: x, yk: y, idd: id }))
          break;
        case 'hanger':
          dispatch(createHanger({ xk: x, yk: y, idd: id }))
          break;
        case 'drawer':
          dispatch(createDrawer({ xk: x, yk: y, idd: id }))
          break;
        case 'sidehanger':
          dispatch(createSideHanger({ xk: x, yk: y, idd: id, widthCloset: widthCloset }))
          break;
      }



    } else {
      console.log('за пределами')

      // сделать удаление элемента
      dispatch(deleteElement({ id: id }))
    }

  }


  const onDragStartElements = (type, item) => {
    if (type === 'element') {
      dispatch(DragStarElement({ itemSelect: item }))
    } else {
      dispatch(DragStartHanger({ itemSelect: item }))
    }


  }


  const onDragEndLeft = (x, y, id) => {

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


  const handleClick = (e) => {
    // console.log('click')
  };



  function clickCheck(props) {


    if (props.attrs.derection === 2 && props.attrs.width < widthCloset - 10) {
      createInput(props.getAbsolutePosition(), props.attrs.width, props.attrs)

    }
    else if (props.attrs.derection === 1 && props.attrs.height < heightCloset - 10) {
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
    input.style.top = pos.y + 3 + 'px';
    input.style.left = pos.x + 'px';

    input.style.height = 20 + 3 + 'px';
    input.style.width = 100 + 3 + 'px';
    input.value = (value + 2) * 5

    if (item.derection === 2) {
      input.onblur = (e) => dispatch(onBlurInputHorizontal({ value: e.currentTarget?.value / 5, containerDiv, wrap, itemSelect: item, width: item.width }))
    }
    else {
      input.onblur = (e) => dispatch(onBlurInputVertical({ value: e.currentTarget?.value / 5, containerDiv, wrap, itemSelect: item, height: item.height }))
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
    const lastFrame = verticalFrames.sort((itme1, item2) => itme1?.x > item2?.x ? -1 : 1)[0]?.x

    dispatch(changeSizeWidthMain({ widthClosetChange, widthCloset, maxWidth, minWidth, widthLeftWall, lastFrame }))
    dispatch(changeSizeWallRight({ widthClosetChange, widthCloset, maxWidth, minWidth, lastFrame }))

    // 50 минимальный размер ячейки






    if (widthClosetChange > maxWidth) {


      dispatch(changeWidth(maxWidth / 5))
      setWidthClosetChange(maxWidth)



    } else if (widthClosetChange < minWidth) {

      if ((widthClosetChange / 5) < lastFrame + 50) {


      } else {
        dispatch(changeWidth(minWidth / 5))
        setWidthClosetChange(minWidth)

      }

    } else {

      if ((widthClosetChange / 5) < lastFrame + 50) {


        dispatch(changeWidth((lastFrame + 50)))
        setWidthClosetChange((lastFrame + 50) * 5)

      }
      else {


        dispatch(changeWidth((widthClosetChange / 5)))
      }


    }








  }


  const changeSizeHeight = () => {


    const lastFrame = horizontalFrames.sort((itme1, item2) => itme1?.y > item2?.y ? -1 : 1)[0]?.y

    dispatch(changeSizeHeightMain({ heightCloset, heightClosetChange, maxHeight, minHeight, lastFrame }))
    dispatch(changeSizeHeightLeft({ heightCloset, heightClosetChange, maxHeight, minHeight, lastFrame }))
    dispatch(changeSizeHeightRight({ heightCloset, heightClosetChange, maxHeight, minHeight, lastFrame }))


    if (heightClosetChange > maxHeight) {

      // setHeightCloset(maxHeight / 5)
      dispatch(changeHeight(maxHeight / 5))
      setHeightClosetChange(maxHeight)

    } else if (heightClosetChange < minHeight) {
      if (heightClosetChange / 5 < lastFrame + 50) {

        // setHeightCloset(lastFrame + 50)
        dispatch(changeHeight(lastFrame + 50))
        setHeightClosetChange((lastFrame + 50) * 5)

      } else {

        // setHeightCloset(minHeight / 5)
        dispatch(changeHeight(minHeight / 5))
        setHeightClosetChange(minHeight)

      }

    } else {
      if (heightClosetChange / 5 < lastFrame + 50) {

        // setHeightCloset(lastFrame + 50)
        dispatch(changeHeight(lastFrame + 50))
        setHeightClosetChange((lastFrame + 50) * 5)

      } else {

        // setHeightCloset(heightClosetChange / 5)
        dispatch(changeHeight(heightClosetChange / 5))

      }
    }
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



  return (
    <div style={{
      display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
      width: '100%', position: 'relative'
    }} id='1'>
      <button onClick={() => navigate('/admin')}>admin</button>
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

        <div style={{
          width: 'fit-content', border: '1px solid black'
          , marginBottom: '20px'
        }} draggable={true} onDragStart={() => setDerection('3')}>
          <img width={55} src="./images/barbell.jpg" />
        </div>
        <div style={{
          width: 'fit-content', border: '1px solid black'
          , marginBottom: '20px'
        }} draggable={true} onDragStart={() => setDerection('4')}>
          <img width={55} height={30} src="./images/вешалка.jpg" />
        </div>
        {/* <div style={{
          width: 'fit-content', border: '1px solid black'
          , marginBottom: '20px'
        }} draggable={true} onDragStart={() => setDerection('5')}>
          <img width={55} height={30} src="./images/sideHanger.jpg" />
        </div> */}
        <div style={{
          width: 'fit-content', border: '1px solid black'
          , marginBottom: '20px'
        }} draggable={true} onDragStart={() => setDerection('6')}>
          <img width={55} height={30} src="./images/sideHanger.jpg" />
        </div>

        <div>
          Выбор цвета
          <select value={colorValue} onChange={(e) => changeColor(e.target.value)} >
            <option value={0}>Стандартный</option>
            <option value={1}>Белый</option>
            <option value={2}>Синий</option>
            {
              textures.map(item => <option value={item.img}>{item.title}</option>)
            }
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
              <input onBlur={changeWidthLeftWall} onChange={(e) => setWidthLeftWallChange(Number(e.target.value))} value={widthLeftWallChange} step={10} type="number" />
            </div>

            <div>
              Ширина правой задней стенки
              <input onBlur={changeWidthRightWall} onChange={(e) => setWidthRightWallChange(Number(e.target.value))} value={widthRightWallChange} step={10} type="number" />
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
            <div>
              Задняя стенка
              <input checked={MainWall} onClick={e => changeMainWall(e.target.checked)} type="checkbox" />
            </div>
          </div>
        </div>


        <button onClick={() => navigate('/door')} >Следующий этап</button>
      </div>


      <Stage
        width={1500}
        height={1000}
        ref={stageRef}
        onClick={(e) => handleClick(e)}
        id="container"
        className={style.container}
      >

        <Layer x={100} y={100} ref={LayerRef} >
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
                  onDragStart={() => dispatch(DragStarHorizontalLeft({ itemSelect: item }))}
                  texture={item?.texture && item?.texture}
                  onDragEnd={(e) => onDragEndLeft(e.evt.layerX - 100, e.evt.layerY - 100, item.id)}
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
                  onDragStart={item.derection === 1
                    ? () => dispatch(DragStarVertical({ itemSelect: item }))
                    : () => dispatch(DragStarHorizontal({ itemSelect: item }))}
                  texture={item?.texture && item?.texture}
                  onDragEnd={(e) => onDragEndMain(e.evt.layerX - 100, e.evt.layerY - 100, item.id, item.derection)}
                />
              )
            }
            {
              elements.map(item =>

                <UrlImage
                  key={item.id}
                  image={item}
                  onDragStart={() => onDragStartElements(item.type, item)}
                  onDragEnd={(e) => onDragEndElements(e.evt.layerX - 100, e.evt.layerY - 100, item.id, item.type)}
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
                  onDragEnd={(e) => onDragEndRight(e.evt.layerX - 100, e.evt.layerY - 100, item.id)}
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
  );
}



export default RootFrame
