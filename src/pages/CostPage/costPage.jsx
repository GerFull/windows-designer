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
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer'
import html2canvas from 'html2canvas';
import PdfFile from "../PDFFile/pdfFile";
import Metrics from "../../components/Metrics";
import { newImage } from "../../store/slice/mainRectangles";



function CostPage() {



   const { widthCloset, heightCloset, widthLeftWall, widthRightWall, depthCloset } = useSelector(store => store.globalVariable)
   const { Rectangels, mainBackRectangles, elements, countBox, selectedTextura, mainVisible, countHanger, countBarbel } = useSelector(store => store.mainRectangles)
   const { leftRectangels, leftBackRectangles, LeftWallVisible } = useSelector(store => store.leftRectangels)
   const { RightRectangels, rightBackRectangles, RightWallVisible } = useSelector(store => store.rightRectangels)
   const { doors, doorRectangles, NumberOfDoors, styleFrame, nameColorFrame } = useSelector(store => store.doors)



   const stageRef = useRef(null)
   const canvasRef = useRef(null)
   const canvasInsideRef = useRef(null)
   const [image, setImage] = useState()
   const [imageInside, setImageInside] = useState()
   const dispath = useDispatch()
   const navigate = useNavigate()

   const [widthCanvas, setWidthCanvas] = useState(widthCloset + widthRightWall + 150)
   const [widthCanvasInside, setWidthCanvasInside] = useState(widthCloset + widthRightWall + 200)


   const LayerRefMain = useRef(null)
   const LayerRef = useRef(null)
   const LayerRefMetrics = useRef(null)
   const LayerRefDoors = useRef(null)

   const [showMenu, setShowMenu] = useState(true)
   const [tag, setTag] = useState(0)
   const [box, setBox] = useState(false)




   useEffect(() => {
      console.log('asd')
      setImage((pref) => canvasRef.current.toDataURL())
      setImageInside((pref) => canvasInsideRef.current.toDataURL())

   },)





   const changeTag = (number) => {

      setTag(number)
   }


   const convertToPDF = () => {
      // capture the element that you want to convert to pdf
      const targetElement = document.getElementById('pdfDocInside');
      if (targetElement) {
         // convert that Element to canvas
         html2canvas(targetElement, {
            logging: true,
            useCORS: true
         }).then((canvas) => {
            // once the Element has been successfully converted to canvas
            // set the width and height of canvas
            const imgWidth = 290;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            // convert canvas to png image 
            const imgData = canvas.toDataURL();
            // initialize a new PDF object
            setImageInside(imgData)
            // const pdf = new jsPDF('l', 'mm', 'a4');
            // // convert that png image into pdf
            // pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            // // download the pdf 
            // pdf.save('name-of-pdf-here');
         });
      }
   };


   const countTYpeDoors = () => {
      let mir = 0
      let glass = 0
      let ldsp = 0

      doorRectangles.forEach(element => {

         if (element.color === 'white') glass += 1
         if (element.texture?.includes('images')) mir += 1
         if (element.texture?.includes('Images')) ldsp += 1
      });

      return `Зеркало ${mir} стекло ${glass} ЛДСП ${ldsp}`

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

   const currentDay = () => {

      const currentDate = new Date();
      let day = currentDate.getDate();
      let month = currentDate.getMonth() + 1; // Месяцы начинаются с 0, поэтому добавляем 1
      const year = currentDate.getFullYear();

      // Преобразуем числовые значения в строки и добавляем ведущий ноль, если число меньше 10
      if (day < 10) {
         day = '0' + day;
      }
      if (month < 10) {
         month = '0' + month;
      }

      return day + '.' + month + '.' + year;

   }

   const InfoProduct = {
      size: `${widthCloset * 5}x${depthCloset * 5} x ${heightCloset * 5}`,
      cost: Math.round(sumSquare()),
      material: selectedTextura.title,
      doors: countTYpeDoors(),
      system: styleFrame,
      colorFrame: nameColorFrame,
      mainVisible: mainVisible,
      countBox: countBox,
      countBarbel: countBarbel,
      countHanger: countHanger,
      date: currentDay(),
      box:box
   }


   return (
      <div className={style.doorsPage} id='1'>

         <div className={style.doorsPage__pdf} id="pdfDoc">
            <Stage
               width={widthCanvas}
               height={600}
               ref={canvasRef}
               id="container"
               scale={{ x: 0.9, y: 0.9 }}
               style={{ position: 'relative' }}
            >

               <Layer x={100} y={50} ref={LayerRefDoors}
                  listening={false}
               >
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
                                 texture={item?.texture && item?.texture}
                                 draggable={false}
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
                     {
                        elements.map(item =>

                           <UrlImage
                              key={item.id}
                              image={item}
                           />
                        )
                     }
                  </Group>

                  <Group visible={LeftWallVisible}>

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
                  <Group visible={RightWallVisible}>
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
                           key={item.id}
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
               <Layer x={100} y={50} ref={LayerRefMetrics}>

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

         <div className={style.doorsPage__pdf} id="pdfDocInside">
            <Stage
               width={widthCanvasInside}
               height={600}
               ref={canvasInsideRef}
               id="container"
               scale={{ x: 0.9, y: 0.9 }}
               style={{ position: 'relative' }}
            >

               <Layer x={100} y={50} ref={LayerRefMain}
                  listening={false}
               >

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
                                 texture={item?.texture && item?.texture}
                                 draggable={false}
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
                     {
                        elements.map(item =>

                           <UrlImage
                              key={item.id}
                              image={item}

                           />

                        )

                     }
                  </Group>

                  <Group visible={LeftWallVisible}>

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
                  <Group visible={RightWallVisible}>
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
                  <Metrics width={widthCloset}
                     height={heightCloset}
                     widthLeftWall={widthLeftWall}
                     widthRightWall={widthRightWall}
                     LeftWall={LeftWallVisible}
                     RightWall={RightWallVisible}
                  />

               </Layer>
            </Stage>

         </div>


         <div className={style.doorsPage__container}>
            <div className={style.doorsPage__backbtn} onClick={() => navigate(-1)}><img src="./images/arrowBack.png" /></div>
            <div className={style.doorsPage__tagsContainer}>
               <div onClick={() => changeTag(0)} className={tag == 0 ? style.doorsPage__tagItemActive : style.doorsPage__tagItem} >Наполнение</div>
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
                  tag == 1 &&
                  <Layer x={100} y={50} ref={LayerRef}
                     listening={false}
                  >
                     <Group>
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

                     </Group>

                     <Group visible={LeftWallVisible}>

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
                     <Group visible={RightWallVisible}>
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

                  tag == 1 &&
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
                  tag == 0 &&
                  <Layer x={100} y={50} ref={LayerRef}
                     listening={false}
                  >

                     <Group>
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
                     </Group>

                     <Group visible={LeftWallVisible}>

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
                     <Group visible={RightWallVisible}>
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
                  <label className={style.checkbox}>
                     <input checked={box} onChange={e => setBox(e.target.checked)} type="checkbox" />
                     <div className={style.checkbox__checkmark}></div>
                     <div className={style.checkbox__body}>Ящик для зеркальных\стекльянных дверей</div>
                  </label>

                  <div className={style.menu__costContainer}>
                     <p className={style.menu__costTitle}>Стоимость</p>
                     <p className={style.menu__costSubtitle}>{Math.round(sumSquare())}руб</p>
                  </div>
               </div>

               <div className={style.menu__btnContainer}>
                  <PDFDownloadLink onClick={() => setImageInside((pref) => canvasInsideRef?.current?.toDataURL())} document={<PdfFile InfoProduct={InfoProduct} image={image} imageInside={imageInside} />} filename="FORM">
                     {({ loading }) => (loading ?
                        <div className={style.menu__backBtn} ><p>Загрузка</p></div> :
                        <div className={style.menu__backBtn} ><p>Заказать</p></div>)}
                  </PDFDownloadLink>
               </div>
            </div>
         </div>
         {/* <img src={imageInside} /> */}
         {/* <PDFViewer width={1200} height={800}>

            <PdfFile InfoProduct={InfoProduct} image={image} imageInside={imageInside} />

         </PDFViewer> */}
      </div>
   );
}

export default CostPage
