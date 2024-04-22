// import React, { useEffect, useRef, useState } from "react";
// import { Stage, Layer, Group, Rect } from "react-konva";
// import style from './costPage.module.scss'
// import { useDispatch, useSelector } from 'react-redux';
// import Poligon from "../../components/Figures/Poligon";
// import ElipseTexture from "../../components/Figures/Elipse";
// import Rectangle from "../../components/Figures/Rectangle";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import {
//    createDoorsHorizontal, createDoorsVertical,
//    createDoors, DragStarDoorsVertical,
//    DragStarDoorsHorizontal, deleteDoorsRectangle, onBlurInputDoorsVertical, onBlurInputDoorsHorizontal, changeColorStroke, changeColorRect
// } from "../../store/slice/doorSlice";
// import MetricsDoors from "../../components/MetricsDoors";
// import UrlImage from "../../components/Figures/UrlImage";

// const FRAME_SIZE = 5;


// const colors = [{
//    mainColor: '#efcf9f',
// },
// {
//    mainColor: 'white',
// },
// {
//    mainColor: '#3d6990',
// },
// {
//    mainColor: 'black',
// }
// ]


// function CostPage() {

//    const { widthCloset, heightCloset, widthLeftWall, widthRightWall } = useSelector(store => store.globalVariable)
//    const { Rectangels, mainBackRectangles, verticalFrames, horizontalFrames, elements } = useSelector(store => store.mainRectangles)
//    const { leftRectangels, leftBackRectangles } = useSelector(store => store.leftRectangels)
//    const { RightRectangels, rightBackRectangles } = useSelector(store => store.rightRectangels)
//    const { doors, doorRectangles } = useSelector(store => store.doors)

//    const state = useSelector(store => store)

//    const dispatch = useDispatch()

//    const stageRef = useRef(null)

//    const navigate = useNavigate()

//    const [widthCanvas, setWidthCanvas] = useState(widthCloset + widthRightWall + 300)
//    const [color, setColor] = useState(null)
//    const [colorValue, setColorValue] = useState(3)
//    const [countDoors, setCountDoors] = useState(3)
//    const [showObject, setShowObject] = useState({ fill: '#99ff99', opacity: 0.7, width: 10, height: 10, x: 0, y: 0 })

//    const [LeftWall, setLeftWall] = useState(false)
//    const [RightWall, setRightWall] = useState(false)

//    const [textures, setTextures] = useState([])

//    const LayerRef = useRef(null)
//    const [selectedRectId, setSelectedRectId] = useState(null)
//    const [derection, setDerection] = useState(null)


//    const [showMenu, setShowMenu] = useState(true)
//    const [showDoors, setShowDoors] = useState(false)
//    const [showPartition, setShowPartition] = useState(false)






//    useEffect(() => {

//    }, [])









//    return (
//       <div className={style.doorsPage} id='1'>


//          <div className={style.doorsPage__container}>
//             <div className={style.doorsPage__backbtn} onClick={() => navigate(-1)}><img src="./images/arrowBack.png"/></div>
//             <Stage
//                width={widthCanvas}
//                height={700}
//                ref={stageRef}
//                id="container"
//                style={{ position: 'relative' }}
//             >

//                <Layer x={100} y={50} ref={LayerRef}
//                   listening={false}
//                >
//                   <Group visible={LeftWall}
//                   >
//                      {
//                         leftBackRectangles.map((item) => {
//                            if (item.type === 'line') {
//                               return <ElipseTexture
//                                  x={item.x}
//                                  y={item.y}
//                                  fill={item.fill}
//                                  radiusX={item.radiusX}
//                                  radiusY={item.radiusY}
//                                  stroke={1}
//                                  opacity={item.opacity}
//                                  strokeWidth={1}
//                                  texture={item.texture}
//                               />
//                            } else {
//                               return <Rectangle
//                                  width={item.width}
//                                  height={item.height}
//                                  fill={item.fill}
//                                  listening={false}
//                                  x={item.x}
//                                  y={item.y}
//                                  stroke="black"
//                                  opacity={item?.opacity}
//                                  strokeWidth={1}
//                                  texture={item?.texture && item?.texture}
//                               />

//                            }

//                         })
//                      }
//                   </Group>
//                   <Group visible={RightWall}>
//                      {
//                         rightBackRectangles.map((item) => {
//                            if (item?.type === 'line') {
//                               return <ElipseTexture
//                                  x={item.x}
//                                  y={item.y}
//                                  fill={item.fill}
//                                  radiusX={item.radiusX}
//                                  radiusY={item.radiusY}
//                                  stroke={1}
//                                  opacity={item.opacity}
//                                  strokeWidth={1}
//                                  texture={item.texture}
//                               />
//                            } else {
//                               return <Rectangle
//                                  width={item.width}
//                                  height={item.height}
//                                  fill={item.fill}
//                                  listening={false}
//                                  x={item.x}
//                                  y={item.y}
//                                  stroke="black"
//                                  opacity={item?.opacity}
//                                  strokeWidth={1}
//                                  texture={item?.texture && item?.texture}
//                               />

//                            }

//                         })
//                      }
//                   </Group>

//                   {
//                      mainBackRectangles.map((item) => {
//                         if (item?.type === 'line') {
//                            return <Poligon
//                               points={item.points}
//                               closed={true}
//                               tension={item.tension}
//                               fill={item.fill}
//                               stroke={'black'}
//                               texture={item?.texture}
//                               draggable={true}
//                            />
//                         } else {
//                            return <Rectangle
//                               width={item.width}
//                               height={item.height}
//                               fill={item.fill}
//                               listening={false}
//                               x={item.x}
//                               y={item.y}
//                               stroke="black"
//                               opacity={item?.opacity}
//                               strokeWidth={1}
//                               texture={item?.texture && item?.texture}
//                            />
//                         }
//                      })
//                   }
//                   {
//                      elements.map(item =>

//                         <UrlImage
//                            key={item.id}
//                            image={item}

//                         />

//                      )

//                   }

//                   <Group

//                   >
//                      {
//                         leftRectangels.map((item) =>

//                            <Rectangle
//                               key={item.id}
//                               width={item.width}
//                               height={item.height}
//                               fill={item.color || null}
//                               x={item.x}
//                               y={item.y}
//                               id={item.id}
//                               stroke="black"
//                               opacity={item?.opacity}
//                               derection={item?.derection}
//                               draggable={false}
//                               strokeWidth={item.type === 'frame' && 0.3}
//                               type={item.type}
//                               texture={item?.texture && item?.texture}
//                            />
//                         )
//                      }

//                   </Group>

//                   <Group
//                   >
//                      {
//                         Rectangels.map((item) =>

//                            <Rectangle
//                               key={item.id}
//                               width={item.width}
//                               height={item.height}
//                               fill={item.color}
//                               listening={false}
//                               x={item.x}
//                               y={item.y}
//                               id={item.id}
//                               stroke="black"
//                               opacity={item?.opacity}
//                               derection={item?.derection}
//                               draggable={false}
//                               strokeWidth={item.type === 'frame' && 0.3}
//                               type={item.type}
//                               texture={item?.texture && item?.texture}

//                            />
//                         )
//                      }




//                   </Group>
//                   <Group

//                   >
//                      {
//                         RightRectangels.map((item) =>

//                            <Rectangle
//                               key={item.id}
//                               width={item.width}
//                               height={item.height}
//                               fill={item.color || null}
//                               x={item.x}
//                               y={item.y}
//                               id={item.id}
//                               stroke="black"
//                               opacity={item?.opacity}
//                               derection={item?.derection}
//                               draggable={false}
//                               strokeWidth={item.type === 'frame' && 0.3}
//                               type={item.type}
//                               texture={item?.texture && item?.texture}
//                            />
//                         )
//                      }

//                   </Group>


//                </Layer>
//                <Layer x={100} y={50}>
//                   {
//                      doors.map(item =>

//                         <Rect
//                            x={item.x}
//                            y={2.5}
//                            stroke={item.stroke}
//                            listening={false}
//                            strokeWidth={5}
//                            width={(widthCloset / countDoors) - 5}
//                            height={heightCloset - 5}
//                         />
//                      )
//                   }
//                   {
//                      doorRectangles.map(rect =>

//                         <Rectangle
//                            key={rect.id}
//                            id={rect.id}
//                            x={rect.x}
//                            y={rect.y}
//                            fill={rect.color}
//                            opacity={rect.opacity}
//                            clickCheck={clickCheck}
//                            width={rect.width}
//                            strokeWidth={1}
//                            draggable={rect.draggable}
//                            height={rect.height}
//                            type={rect.type}
//                            dragover={dragover}
//                            derection={rect.derection}
//                            onDragStart={() => onDragStartFrame(rect)}
//                            texture={rect?.texture && rect?.texture}
//                            onDragEnd={(e) => onDragEndMain(e.evt.layerX - 100, e.evt.layerY - 50, rect.id, rect.derection)}
//                         />
//                      )
//                   }
//                   {
//                      selectedRectId && <Rectangle
//                         x={showObject.x}
//                         y={showObject.y}
//                         width={showObject.width}
//                         height={showObject.height}
//                         fill={'#99ff99'}
//                         opacity={showObject.opacity}

//                      />
//                   }
//                   <MetricsDoors width={widthCloset}
//                      height={heightCloset}
//                      widthLeftWall={widthLeftWall}
//                      widthRightWall={widthRightWall}
//                      LeftWall={LeftWall}
//                      RightWall={RightWall}
//                      countDoors={countDoors}
//                   />



//                </Layer>
//             </Stage>


//          </div>

//          <div className={style.menu} style={{ backgroundColor: !showMenu ? 'white' : '#d9d9d9' }}>
//             <div>
//                {

//                   showMenu && <div className={style.menu__header}>
//                      <p className={style.menu__title}>Шкаф</p>
//                      <p className={style.menu__subtitle}>Стандратное описание</p>
//                   </div>
//                }

//                {

//                   showMenu &&
//                   <div className={style.menu__container}>
                     
                     
//                   </div>
//                }</div>


          
 
//          </div>

//       </div>
//    );
// }

// export default CostPage
