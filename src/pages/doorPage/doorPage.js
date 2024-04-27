import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer, Group, Rect } from "react-konva";
import style from './doorPage.module.scss'
import { useDispatch, useSelector } from 'react-redux';
import Poligon from "../../components/Figures/Poligon";
import ElipseTexture from "../../components/Figures/Elipse";
import Rectangle from "../../components/Figures/Rectangle";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
   createDoorsHorizontal, createDoorsVertical,
   createDoors, DragStarDoorsVertical,
   DragStarDoorsHorizontal, deleteDoorsRectangle, onBlurInputDoorsVertical, onBlurInputDoorsHorizontal, changeColorStroke, changeColorRect
} from "../../store/slice/doorSlice";
import MetricsDoors from "../../components/MetricsDoors";
import UrlImage from "../../components/Figures/UrlImage";

const FRAME_SIZE = 5;


const colors = [{
   mainColor: '#efcf9f',
},
{
   mainColor: 'white',
},
{
   mainColor: '#3d6990',
},
{
   mainColor: 'black',
}
]


function DoorPage() {
   const { widthCloset, heightCloset, widthLeftWall, widthRightWall } = useSelector(store => store.globalVariable)
   const { Rectangels, mainBackRectangles, verticalFrames, horizontalFrames, elements } = useSelector(store => store.mainRectangles)
   const { leftRectangels, leftBackRectangles, LeftWallVisible } = useSelector(store => store.leftRectangels)
   const { RightRectangels, rightBackRectangles, RightWallVisible } = useSelector(store => store.rightRectangels)
   const { doors, doorRectangles, NumberOfDoors } = useSelector(store => store.doors)

   const state = useSelector(store => store)

   const dispatch = useDispatch()

   const stageRef = useRef(null)

   const navigate = useNavigate()

   const [widthCanvas, setWidthCanvas] = useState(widthCloset + widthRightWall + 300)
   const [color, setColor] = useState(null)
   const [colorValue, setColorValue] = useState(3)
   const [countDoors, setCountDoors] = useState(3)
   const [showObject, setShowObject] = useState({ fill: '#99ff99', opacity: 0.7, width: 10, height: 10, x: 0, y: 0 })


   const [textures, setTextures] = useState([])

   const LayerRef = useRef(null)
   const [selectedRectId, setSelectedRectId] = useState(null)
   const [derection, setDerection] = useState(null)


   const [showMenu, setShowMenu] = useState(true)
   const [showDoors, setShowDoors] = useState(false)
   const [showPartition, setShowPartition] = useState(false)




   const fetchData = async () => {
      await axios.get('http://127.0.0.1:8000/api/Textures/').then(res => setTextures(res.data)).catch(err => console.log(err))
   }

   useEffect(() => {
      // fetchData()
      if (doors?.length == 0) {
         dispatch(createDoors({ countDoors: countDoors, widthCloset: widthCloset, heightCloset, widthLeftWall }))
      }
   }, [])


   console.log(doors.length)
   console.log()



   useEffect(() => {



      const con = stageRef.current.container()
      con.addEventListener('dragover', dragover)

      con.addEventListener('drop', drop)

      return () => {
         con.removeEventListener('dragover', dragover)
         con.removeEventListener('drop', drop)
      }

   }, [doorRectangles, derection, selectedRectId, doors])

   const drop = (e) => {

      e.preventDefault();


      if (selectedRectId !== null) {
         setShowObject({ fill: '#99ff99', opacity: 0.7, width: 0, height: 0, x: 0, y: 0 })
         if (derection !== null) {
            if (doorRectangles.includes(selectedRectId)) {
               if (derection === '1') {
                  dispatch(createDoorsVertical({ xk: e.layerX - 100, yk: e.layerY - 50, widthLeftWall: widthLeftWall }))
               }
               if (derection === '2') {
                  dispatch(createDoorsHorizontal({ xk: e.layerX - 100, yk: e.layerY - 50 }))
               }
            }
            setDerection(null)
         } else if (color !== null) {
            dispatch(changeColorRect({ color: color, id: selectedRectId.id }))
         }
      }

      setSelectedRectId(null)

   }


   const changeCountDoors = (value) => {
      setCountDoors(value)
      dispatch(createDoors({ countDoors: value, widthCloset: widthCloset, heightCloset, widthLeftWall }))
   }


   const dragover = (e) => {



      e.preventDefault();
      const x = e.layerX - 100
      const y = e.layerY - 50



      const item = doorRectangles.filter(item => (
         (x > item.x && x < (item.x + item.width)) &&
         (y > item.y && y < (item.y + item.height))
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

         }
      } else setSelectedRectId(null)




   }


   const onDragEndMain = (x, y, id, derection) => {

      setShowObject({ fill: '#99ff99', opacity: 0.7, width: 0, height: 0, x: 0, y: 0 })

      if ((x > 100 && x < 100 + widthCloset) && (y > 0 && y < y + heightCloset)) {

         if (derection === 1) {
            dispatch(createDoorsVertical({ xk: x, yk: y, idd: id, widthLeftWall: widthLeftWall }))
         } else {
            dispatch(createDoorsHorizontal({ xk: x, yk: y, idd: id }))
         }

      } else {
         dispatch(deleteDoorsRectangle({ id: id }))
      }


   }


   function clickCheck(props) {

      if (props.attrs.derection === 2 && props.attrs.width < widthCloset / countDoors - 10) {
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
         input.onblur = (e) => dispatch(onBlurInputDoorsHorizontal({ value: e.currentTarget?.value / 5, containerDiv, wrap, itemSelect: item, width: item.width }))
      }
      else {
         input.onblur = (e) => dispatch(onBlurInputDoorsVertical({ value: e.currentTarget?.value / 5, containerDiv, wrap, itemSelect: item, height: item.height }))
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


   const changeColor = (value) => {

      if (value.includes('Images')) {

      } else {
         const mainColor = colors[value].mainColor
         dispatch(changeColorStroke({ mainColor: mainColor }))
      }

      setColorValue(value)
   }


   const onDragStartFrame = (item) => {

      if (item.derection === 1) {
         setDerection('1')
         dispatch(DragStarDoorsVertical({ itemSelect: item }))
      } else {
         setDerection('2')
         dispatch(DragStarDoorsHorizontal({ itemSelect: item }))
      }


   }

   return (
      <div className={style.doorsPage} id='1'>


         <div className={style.doorsPage__container}>
            <div className={style.doorsPage__backbtn} onClick={() => navigate(-1)}><img src="./images/arrowBack.png" /></div>
            <Stage
               width={widthCanvas}
               height={700}
               ref={stageRef}
               id="container"
               style={{ position: 'relative' }}
            >

               <Layer x={100} y={50} ref={LayerRef}
                  listening={false}
               >
                  <Group visible={LeftWallVisible}
                  >
                     {
                        leftBackRectangles.map((item) => {
                           if (item.type === 'line') {
                              return <ElipseTexture
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
                  <Group visible={RightWallVisible}>
                     {
                        rightBackRectangles.map((item) => {
                           if (item?.type === 'line') {
                              return <ElipseTexture
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
                  {
                     elements.map(item =>

                        <UrlImage
                           key={item.id}
                           image={item}

                        />

                     )

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
                              draggable={false}
                              strokeWidth={item.type === 'frame' && 0.3}
                              type={item.type}
                              texture={item?.texture && item?.texture}
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
                              fill={item.color}
                              listening={false}
                              x={item.x}
                              y={item.y}
                              id={item.id}
                              stroke="black"
                              opacity={item?.opacity}
                              derection={item?.derection}
                              draggable={false}
                              strokeWidth={item.type === 'frame' && 0.3}
                              type={item.type}
                              texture={item?.texture && item?.texture}

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
                              draggable={false}
                              strokeWidth={item.type === 'frame' && 0.3}
                              type={item.type}
                              texture={item?.texture && item?.texture}
                           />
                        )
                     }

                  </Group>


               </Layer>
               <Layer x={100} y={50}>
                  {
                     doors.map(item =>

                        <Rect
                           x={item.x}
                           y={2.5}
                           stroke={item.stroke}
                           listening={false}
                           strokeWidth={5}
                           width={(widthCloset / NumberOfDoors) - 5}
                           height={heightCloset - 5}
                        />
                     )
                  }
                  {
                     doorRectangles.map(rect =>

                        <Rectangle
                           key={rect.id}
                           id={rect.id}
                           x={rect.x}
                           y={rect.y}
                           fill={rect.color}
                           opacity={rect.opacity}
                           clickCheck={clickCheck}
                           width={rect.width}
                           strokeWidth={1}
                           draggable={rect.draggable}
                           height={rect.height}
                           type={rect.type}
                           dragover={dragover}
                           derection={rect.derection}
                           onDragStart={() => onDragStartFrame(rect)}
                           texture={rect?.texture && rect?.texture}
                           onDragEnd={(e) => onDragEndMain(e.evt.layerX - 100, e.evt.layerY - 50, rect.id, rect.derection)}
                        />
                     )
                  }
                  {
                     selectedRectId && <Rectangle
                        x={showObject.x}
                        y={showObject.y}
                        width={showObject.width}
                        height={showObject.height}
                        fill={'#99ff99'}
                        opacity={showObject.opacity}

                     />
                  }
                  <MetricsDoors width={widthCloset}
                     height={heightCloset}
                     widthLeftWall={widthLeftWall}
                     widthRightWall={widthRightWall}
                     LeftWall={LeftWallVisible}
                     RightWall={RightWallVisible}
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

                  showMenu &&
                  <div className={style.menu__container}>
                     <div onClick={() => {
                        setShowMenu(false)
                        setShowDoors(true)
                     }} className={style.menu__item}><img src="./images/arrow_down.png" /><p>Двери</p></div>
                     <div onClick={() => {
                        setShowMenu(false)
                        setShowPartition(true)
                     }} className={style.menu__item}><img src="./images/arrow_down.png" /><p>Перегородки</p></div>

                  </div>
               }</div>


            {
               showDoors &&
               <div className={style.menu__inputs}>
                  <div>
                     <div className={style.menu__inputSize}>

                        <p className={style.menu__inputSize_title}>Двери</p>

                        <div className={style.menu__inputSize_container}>

                           <div className={style.menu__inputSize_item}>
                              <p>Количество дверей</p>
                              <input className={style.input__size} step={1} min={2} max={10} value={countDoors} onChange={(e) => changeCountDoors(Number(e.target.value))} type="number" />

                           </div>

                        </div>

                     </div>

                     <p className={style.menu__colorsTitle}>Цвет рамки</p>

                     <div className={style.menu__colorsContainer}>
                        {
                           colors.map((item, index) => <div onClick={() => changeColor(String(index))} style={{ backgroundColor: item.mainColor, border: index == colorValue ? '2px solid black' : null }} className={style.menu__colorsContainer_item} ></div>)
                        }

                     </div>



                  </div>



                  <div className={style.menu__btnContainer}>
                     <div className={style.menu__backBtn} onClick={() => {
                        setShowMenu(true)
                        setShowDoors(false)
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
                     <div >
                        <p className={style.menu__colorsTitle}>Цвета дверей</p>
                        <div className={style.menu__colors}>
                           {colors.map(item =>

                              <div draggable={true} onDragStart={() => setColor(item.mainColor)}>
                                 <div className={style.menu__colors_item} style={{ backgroundColor: item.mainColor }} />
                              </div>
                           )

                           }

                           {
                              textures.map(item =>
                                 <div draggable={true} onDragStart={() => setColor(item.img)}>
                                    <img className={style.menu__colors_item} src={`http://127.0.0.1:8000/${item.img}`} />
                                 </div>
                              )
                           }

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

            {showMenu &&
               <div className={style.menu__btnContainer}>
                  <div className={style.menu__backBtn} onClick={() => navigate('/cost')}><p>Далее</p></div>
               </div>
            }
         </div>

      </div>
   );
}



export default DoorPage
