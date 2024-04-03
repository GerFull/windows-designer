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


// скрыть админку
// Stroke рамое меняется при установке новый рядом


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
   const { Rectangels, mainBackRectangles, verticalFrames, horizontalFrames ,elements} = useSelector(store => store.mainRectangles)
   const { leftRectangels, leftBackRectangles } = useSelector(store => store.leftRectangels)
   const { RightRectangels, rightBackRectangles } = useSelector(store => store.rightRectangels)
   const { doors, doorRectangles } = useSelector(store => store.doors)

   const state = useSelector(store => store)

   const dispatch = useDispatch()

   const stageRef = useRef(null)

   const navigate = useNavigate()


   const [color, setColor] = useState(null)
   const [colorValue, setColorValue] = useState(3)
   const [countDoors, setCountDoors] = useState(3)

   const [LeftWall, setLeftWall] = useState(false)
   const [RightWall, setRightWall] = useState(false)

   const [textures, setTextures] = useState([])

   const LayerRef = useRef(null)
   const [selectedRectId, setSelectedRectId] = useState(null)
   const [derection, setDerection] = useState(null)




   const fetchData = async () => {
      await axios.get('http://127.0.0.1:8000/api/Textures/').then(res => setTextures(res.data)).catch(err => console.log(err))
   }

   useEffect(() => {
      fetchData()
   }, [])


   useEffect(() => {
      dispatch(createDoors({ countDoors: countDoors, widthCloset: widthCloset, heightCloset, widthLeftWall }))
   }, [countDoors])


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

         if (derection !== null) {
            if (doorRectangles.includes(selectedRectId)) {
               if (derection === '1') {
                  dispatch(createDoorsVertical({ xk: e.layerX - 100, yk: e.layerY - 100, widthLeftWall: widthLeftWall }))
               }
               if (derection === '2') {
                  dispatch(createDoorsHorizontal({ xk: e.layerX - 100, yk: e.layerY - 100 }))
               }
            }
            setDerection(null)
         } else if (color !== null) {
            dispatch(changeColorRect({ color: color, id: selectedRectId.id }))
         }
      }

      setSelectedRectId(null)

   }



   const dragover = (e) => {



      e.preventDefault();
      const x = e.layerX - 100
      const y = e.layerY - 100



      const item = doorRectangles.filter(item => (
         (x > item.x && x < (item.x + item.width)) &&
         (y > item.y && y < (item.y + item.height))
      )
      )[0]

      if (item !== undefined) {

         setSelectedRectId(item)

      } else setSelectedRectId(null)




   }


   const onDragEndMain = (x, y, id, derection) => {



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

   const handleClick = (e) => {
      // console.log('click')
   };


   const changeColor = (value) => {

      if (value.includes('Images')) {

      } else {
         const mainColor = colors[value].mainColor
         dispatch(changeColorStroke({ mainColor: mainColor }))
      }

      setColorValue(value)
   }

   return (
      <div style={{
         display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
         width: '100%', position: 'relative'
      }} id='1'>

         <button onClick={() => navigate('/admin')}>admin</button>

         <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => navigate(-1)} >Назад</button>
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
               Количество дверей
               <input type="number" step={1} min={1} max={10} value={countDoors} onChange={(e) => setCountDoors(Number(e.target.value))} />
            </div>
            <div>
               Цвет рамки
               <select value={colorValue} onChange={e => changeColor(e.target.value)}>
                  <option value={0}>Стандартный</option>
                  <option value={1}>Белый</option>
                  <option value={2}>Синий</option>
                  <option value={3}>Черный</option>
               </select>
            </div>
            <div className={style.colors}>

               {colors.map(item =>

                  <div draggable={true} onDragStart={(e) => setColor(item.mainColor)}>
                     <div className={style.colors__item} style={{ backgroundColor: item.mainColor }} />
                  </div>
               )

               }

               {
                  textures.map(item =>
                     <div draggable={true} onDragStart={(e) => setColor(item.img)}>
                        <img className={style.colors__item} src={`http://127.0.0.1:8000/${item.img}`} />
                     </div>
                  )
               }


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

            <Layer x={100} y={100} ref={LayerRef}
               listening={false}
            >
               <Group visible={LeftWall}
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
               <Group visible={RightWall}>
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
            <Layer x={100} y={100}>
               {
                  doors.map(item =>

                     <Rect
                        x={item.x}
                        y={2.5}
                        stroke={item.stroke}
                        listening={false}
                        strokeWidth={5}
                        width={(widthCloset / countDoors) - 5}
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
                        derection={rect.derection}
                        onDragStart={rect.derection === 1
                           ? () => dispatch(DragStarDoorsVertical({ itemSelect: rect }))
                           : () => dispatch(DragStarDoorsHorizontal({ itemSelect: rect }))}
                        texture={rect?.texture && rect?.texture}
                        onDragEnd={(e) => onDragEndMain(e.evt.layerX - 100, e.evt.layerY - 100, rect.id, rect.derection)}
                     />
                  )
               }
               <MetricsDoors width={widthCloset}
                  height={heightCloset}
                  widthLeftWall={widthLeftWall}
                  widthRightWall={widthRightWall}
                  LeftWall={LeftWall}
                  RightWall={RightWall}
                  countDoors={countDoors}
               />



            </Layer>
         </Stage>
      </div>
   );
}



export default DoorPage
