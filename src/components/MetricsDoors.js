import React, { useEffect, useState } from "react";
import { Group, Line, Arrow, Label, Text, Tag } from "react-konva";
import { useSelector, useDispatch } from "react-redux";
import { changeHorizontalFrames, changeVerticalFrames } from "../store/slice/mainRectangles";
import { changeHorizontalLeftFrames } from "../store/slice/leftRectangles";
import { changeHorizontalRightFrames } from "../store/slice/rightRectangles";



const METRIC_SIZE = 25;
const FRAME_SIZE = 3;



// разбить на функции создание стрелок

// добавить ограничения в рамках вертикальных и горизонтальных

function VerticalMetric({ x, y, height, itemSelect, change = true, heightShow, left = false, right = false,
   lineSize,
   type
}) {




   const [value, setValue] = useState(0)
   const [valueCopy, setValueCopy] = useState(height * 5)
   const dispatch = useDispatch()

   useEffect(() => {
      setValue(height)
      if (heightShow !== undefined) {
         setValueCopy(heightShow * 5)
      } else {
         setValueCopy(height * 5)
      }

   }, [height])

   function check() {
      createInput(this.getAbsolutePosition())
   }

   function createInput(pos) {


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
      input.onchange = (e) => setValueCopy(e.currentTarget?.value)
      input.value = valueCopy
      input.onblur = (e) => onBlurInput(e.currentTarget?.value, containerDiv, wrap)


      wrap.appendChild(input);

      function removeInput(e) {
         if (e.target === wrap) {
            containerDiv.removeChild(wrap);
            wrap.removeEventListener("click", removeInput);
         }

      }

      wrap.addEventListener('click', removeInput);

   }


   const onBlurInput = (valueInput, containerDiv, wrap) => {


      if (left === false && right === false) {
         dispatch(changeHorizontalFrames({ itemSelect, value, valueInput }))
         setValue((valueInput) / 5)

      } else if (left === true) {
         console.log('left')

         dispatch(changeHorizontalLeftFrames({ itemSelect, value, valueInput, heightShow }))



         if (heightShow !== undefined) {


            setValue((valueInput - 150) / 5)

         } else {

            setValue((valueInput) / 5)
         }



      } else if (right === true) {

         console.log('right')
         dispatch(changeHorizontalRightFrames({ itemSelect, value, valueInput, heightShow }))



         if (heightShow !== undefined) {

            setValue((valueInput - 150) / 5)
         } else {


            setValue((valueInput) / 5)
         }



      }







      containerDiv.removeChild(wrap);


   }

   return (
      <Group x={x} y={y}>
         <Arrow
            points={[METRIC_SIZE / 2, 0, METRIC_SIZE / 2, height]}
            stroke="black"
            fill="black"
            pointerAtBeginning
         />



         {type === undefined ? <>
            <Line points={[0, 0, lineSize || METRIC_SIZE, 0]} stroke="black" />
            <Line points={[0, height, lineSize || METRIC_SIZE, height]} stroke="black" />
         </> : type === 'up' ?

            <><Line points={[METRIC_SIZE, 0, lineSize, 0]} stroke="black" />
               <Line points={[0, height, METRIC_SIZE, height]} stroke="black" /></> :

            <><Line points={[0, 0, METRIC_SIZE, 0]} stroke="black" />
               <Line points={[METRIC_SIZE, height, lineSize || METRIC_SIZE, height]} stroke="black" /></>


         }

         <Label onClick={change && check} x={METRIC_SIZE / 2 - 50} y={height / 2}>
            <Tag fill="white" stroke="black" />
            <Text text={((heightShow || value) * 5).toFixed(0) + " mm"} padding={5} />
         </Label>
      </Group>
   );
}


function HorizontalMetric({ x, y, width, itemSelect, change = true, widthLeftWall }) {

   const [value, setValue] = useState(0)
   const [valueCopy, setValueCopy] = useState(width * 5)
   const dispatch = useDispatch()

   useEffect(() => {
      setValue(width)
      setValueCopy(width * 5)
   }, [width])


   function check() {
      createInput(this.getAbsolutePosition())
   }

   function createInput(pos) {


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
      input.onchange = (e) => setValueCopy(e.currentTarget?.value)
      input.value = valueCopy
      input.onblur = (e) => onBlurInput(e.currentTarget?.value, containerDiv, wrap)


      wrap.appendChild(input);

      function removeInput(e) {
         if (e.target === wrap) {
            containerDiv.removeChild(wrap);
            wrap.removeEventListener("click", removeInput);
         }

      }

      wrap.addEventListener('click', removeInput);

   }





   const onBlurInput = (valueInput, containerDiv, wrap) => {

      dispatch(changeVerticalFrames({ itemSelect, value, valueInput, widthLeftWall }))

      containerDiv.removeChild(wrap);

      setValue((valueInput / 5))
   }







   return (
      <Group x={x} y={y}>
         <Arrow
            points={[0, METRIC_SIZE / 2, width, METRIC_SIZE / 2]}
            stroke="black"
            fill="black"
            pointerAtBeginning
         />
         <Line points={[0, 0, 0, METRIC_SIZE]} stroke="black" />
         <Line points={[width, 0, width, METRIC_SIZE]} stroke="black" />
         <Label onClick={change && check} x={width / 2 - 25} y={METRIC_SIZE / 2 - 20}>
            <Tag fill="white" stroke="black" />
            <Text text={(value * 5).toFixed(0) + " mm"} padding={5} />
         </Label>
      </Group>
   );
}




function MetricsDoors(props) {

   const { width, height,
      widthLeftWall, widthRightWall,
      LeftWall,
      RightWall,
      countDoors
   } = props


   const [verticalComponents, setVerticalComponents] = useState([])
   const [horizontalComponents, setHorizontalComponents] = useState([])


   const { verticalDoorsFrame,horizontalDoorsFrames } = useSelector(store => store.doors)


   function processSection() {

      const copyHorizontalDoorsFrames=[...horizontalDoorsFrames]

      const sortedHorizontal = copyHorizontalDoorsFrames.sort((itme1, item2) => itme1['y'] > item2['y'] ? 1 : -1);

      const testArr = []
      const verticalArr = []




      if (sortedHorizontal.length === 1) {
         sortedHorizontal.forEach((item, index) => {
   
           verticalArr.push(<VerticalMetric
             x={0}
             y={0}
             height={item.y}
             itemSelect={item}
             horizontalFrames={horizontalDoorsFrames}
             widthLeftWall={widthLeftWall}
             lineSize={-150}
             type={'up'}
           />,
             <VerticalMetric
               x={0}
               y={item.y + FRAME_SIZE}
               height={height - item.y - FRAME_SIZE}
               change={false}
               lineSize={-150}
               type={'down'}
             />
   
           )
   
         })
   
   
       } else {
         sortedHorizontal.forEach((item, index) => {
           if (sortedHorizontal[0] === item) {
   
             verticalArr.push(<VerticalMetric
               x={0}
               y={0}
               height={item.y}
               itemSelect={item}
               horizontalFrames={horizontalDoorsFrames}
               widthLeftWall={widthLeftWall}
               lineSize={-150}
               type={'up'}
             />)
           }
   
           if (item !== sortedHorizontal[0] && item !== sortedHorizontal[sortedHorizontal.length - 1]) {
             verticalArr.push(<VerticalMetric
               x={0}
               y={sortedHorizontal[index - 1].y + FRAME_SIZE}
               height={item.y - sortedHorizontal[index - 1].y - FRAME_SIZE}
               itemSelect={item}
               horizontalFrames={horizontalDoorsFrames}
               widthLeftWall={widthLeftWall}
             />)
           }
   
           if (item === sortedHorizontal[sortedHorizontal.length - 1]) {
   
             verticalArr.push(<VerticalMetric
               x={0}
               y={sortedHorizontal[index - 1].y + FRAME_SIZE}
               height={item.y - sortedHorizontal[index - 1].y - FRAME_SIZE}
               itemSelect={item}
               horizontalFrames={horizontalDoorsFrames}
               widthLeftWall={widthLeftWall}
             />,
               <VerticalMetric
                 x={0}
                 y={item.y + FRAME_SIZE}
                 height={height - item.y - FRAME_SIZE}
                 change={false}
                 lineSize={-150}
                 type={'down'}
               />
   
             )
   
           }
         });
       }



      setHorizontalComponents(testArr)

      setVerticalComponents(verticalArr)
   }






   useEffect(() => {
      processSection()

   }, [width, height, widthLeftWall, widthRightWall,horizontalDoorsFrames,verticalDoorsFrame])



   return (
      <Group
         x={100}>
         <VerticalMetric
            height={height}
            x={LeftWall ? -(60 + 100) : -60}
            y={0}
            change={false}
            lineSize={160}

         />
         <HorizontalMetric
            x={widthLeftWall - 100}
            y={-25}
            width={width}
            change={false}
         />
         <Group visible={LeftWall}>
            <HorizontalMetric

               x={-100}
               y={-25}
               width={widthLeftWall}
               change={false}
            />
         </Group>
         <Group visible={RightWall}>
            <HorizontalMetric
               x={width + (widthLeftWall - 100)}
               y={-25}
               width={widthRightWall}
               change={false}
            />
         </Group>
         {/* <Group x={width + (RightWall ? widthRightWall : 0) + (widthLeftWall - 100) + 50}>{verticalComponents}</Group> */}
         {/* <HorizontalMetric
            x={widthLeftWall - 100}
            y={height}
            width={width / 3}
            change={false}
         />
         <HorizontalMetric
            x={widthLeftWall - 100 + (width / 3 * 1)}
            y={height}
            width={width / 3}
            change={false}
         />
         <HorizontalMetric
            x={widthLeftWall - 100 + (width / 3 * 2)}
            y={height}
            width={width / 3}
            change={false}
         /> */}


      </Group>
   );
}



export default MetricsDoors
