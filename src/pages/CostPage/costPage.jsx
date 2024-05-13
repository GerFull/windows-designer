import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer, Group, Rect } from "react-konva";
import style from './costPage.module.scss'
import { useDispatch, useSelector } from 'react-redux';
import Poligon from "../../components/Figures/Poligon";
import ElipseTexture from "../../components/Figures/Elipse";
import Rectangle from "../../components/Figures/Rectangle";
import { useNavigate } from "react-router-dom";
import MetricsDoors from "../../components/MetricsDoors";
import UrlImage from "../../components/Figures/UrlImage";



function CostPage() {

   const { widthCloset, heightCloset, widthLeftWall, widthRightWall, depthCloset } = useSelector(store => store.globalVariable)
   const { Rectangels, mainBackRectangles, elements, countBox, selectedTextura } = useSelector(store => store.mainRectangles)
   const { leftRectangels, leftBackRectangles, LeftWallVisible } = useSelector(store => store.leftRectangels)
   const { RightRectangels, rightBackRectangles, RightWallVisible } = useSelector(store => store.rightRectangels)
   const { doors, doorRectangles, NumberOfDoors } = useSelector(store => store.doors)



   const stageRef = useRef(null)

   const navigate = useNavigate()

   const [widthCanvas, setWidthCanvas] = useState(widthCloset + widthRightWall + 300)


   const LayerRef = useRef(null)

   const [showMenu, setShowMenu] = useState(true)
   const [tag, setTag] = useState(0)


   const changeTag = (number) => {

      setTag(number)
   }


   const sumSquare = () => {

      const summVerticatal = Rectangels.filter(item => item.derection == 1 && item.type == 'frame').reduce(
         (accumulator, item) => accumulator + ((item.height * 5) * ((depthCloset * 5) - 100)),
         0,
      );
      const summVerticatalAr = Rectangels.filter(item => item.derection == 1 && item.type == 'frame')

      const summHorizontalAr = Rectangels.filter(item => item.derection == 2 && item.type == 'frame')

      const summHorizontal = Rectangels.filter(item => item.derection == 2 && item.type == 'frame').reduce(
         (accumulator, item) => accumulator + ((item.width * 5) * ((depthCloset * 5) - 100)),
         0,
      )


      // P=S/0.8*1200+2500



      const SquareElements = (summVerticatal + summHorizontal) / 1000000

      // 1200 разбить на переменные

      const cost = ((SquareElements / 0.8 * (700 + selectedTextura.cost)) + 2500) + (countBox * 1200)

      return cost
   }

   return (
      <div className={style.doorsPage} id='1'>


         <div className={style.doorsPage__container}>
            <div className={style.doorsPage__backbtn} onClick={() => navigate(-1)}><img src="./images/arrowBack.png" /></div>
            <div className={style.doorsPage__tagsContainer}>
               <div onClick={() => changeTag(0)} className={tag == 0 ? style.doorsPage__tagItemActive : style.doorsPage__tagItem} >Внутренняя часть</div>
               <div onClick={() => changeTag(1)} className={tag == 1 ? style.doorsPage__tagItemActive : style.doorsPage__tagItem}>Двери</div>
            </div>
            <Stage
               width={widthCanvas}
               height={700}
               ref={stageRef}
               id="container"
               style={{ position: 'relative' }}
            >
               {
                  tag == 1 && <Layer x={100} y={50} ref={LayerRef}
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
                                 draggable={false}
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
               }
               {

                  tag == 1 && <Layer x={100} y={50}>
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
                              width={rect.width}
                              strokeWidth={1}
                              draggable={false}
                              height={rect.height}
                              type={rect.type}
                              derection={rect.derection}
                              texture={rect?.texture && rect?.texture}
                           />
                        )
                     }

                  </Layer>
               }

               {
                  tag == 0 && <Layer x={100} y={50} ref={LayerRef}
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
                                 draggable={false}
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
               }
               <Layer x={100} y={50} ref={LayerRef}>

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


               <div className={style.menu__header}>
                  <p className={style.menu__title}>Рассчитать стоимость
                     шкафа-купе</p>

               </div>



               <div className={style.menu__container}>
                  <div className={style.menu__inputs}>

                     <input placeholder="Имя" className={style.input__text} />
                     <input placeholder="Телефон" className={style.input__text} />
                     <input placeholder="Город" className={style.input__text} />
                  </div>


                  <div className={style.menu__costContainer}>
                     <p className={style.menu__costTitle}>Стоимость</p>
                     <p className={style.menu__costSubtitle}>{Math.round(sumSquare())}руб</p>
                  </div>
               </div>

               <div className={style.menu__btnContainer}>
                  <div className={style.menu__backBtn} ><p>Заказать</p></div>
               </div>

            </div>




         </div>

      </div>
   );
}

export default CostPage
