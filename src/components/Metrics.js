import React, { useEffect, useState } from "react";
import { Group, Line, Arrow, Label, Text, Tag } from "react-konva";
import { useSelector, useDispatch } from "react-redux";
import { changeHorizontalFrames, changeVerticalFrames } from "../store/slice/mainRectangles";
import { changeHorizontalLeftFrames } from "../store/slice/leftRectangles";
import { changeHorizontalRightFrames } from "../store/slice/rightRectangles";
import style from '../pages/homePage/homePage.module.scss'

const METRIC_SIZE = 25;
const FRAME_SIZE = 5;
const FRAME_SIZESHOW = 3.2




function VerticalMetric({ x, y,
  height,
  itemSelect,
  change = true,
  heightShow,
  left = false, right = false,
  lineSize,
  type
}) {

  const [value, setValue] = useState(0)
  const [valueCopy, setValueCopy] = useState(height * 5)
  const dispatch = useDispatch()

  useEffect(() => {
    setValue(heightShow)
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
    input.style.top = pos.y - 3 + 'px';
    input.style.left = pos.x - 10 + 'px';
    input.className = style.input__size
    input.style.height = 20 + 6 + 'px';
    input.style.width = 100 + 3 + 'px';
    input.onchange = (e) => setValueCopy(e.currentTarget?.value)
    input.value = valueCopy.toFixed(0)
    input.onblur = (e) => {
      focusInput = false
      onBlurInput(e.currentTarget?.value, containerDiv, wrap)
    }

    let focusInput = false

    input.onfocus = (e) => {
      focusInput = true
    }


    wrap.appendChild(input);

    function removeInput(e) {


      if (e.target === wrap) {

        if (!focusInput) containerDiv?.removeChild(wrap)

      }

    }

    wrap.addEventListener('click', removeInput);

  }


  const onBlurInput = (valueInput, containerDiv, wrap) => {

    // console.log(itemSelect)
    let changeValue = 0
    type == 'down' ? changeValue = -(valueInput / 5 - value) : changeValue = (valueInput / 5 - value)

    if (left === false && right === false) {



      console.log('changeValue', -(valueInput / 5 - value))

      dispatch(changeHorizontalFrames({ itemSelect, changeValue: changeValue }))
      setValue((valueInput) / 5)

    } else if (left === true) {

      dispatch(changeHorizontalLeftFrames({ itemSelect, value, valueInput, heightShow }))

      if (heightShow !== undefined) {

        setValue((valueInput - 150) / 5)

      } else {
        setValue((valueInput) / 5)
      }

    } else if (right === true) {

      dispatch(changeHorizontalRightFrames({ itemSelect, value, valueInput, heightShow }))

      setValue((valueInput) / 5)
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


function HorizontalMetric({ x, y, width, itemSelect, change = true, widthLeftWall, widthShow, type }) {

  const [value, setValue] = useState(0)
  const [valueCopy, setValueCopy] = useState(width * 5)
  const dispatch = useDispatch()

  useEffect(() => {
    setValue(widthShow)
    setValueCopy(widthShow * 5)
  }, [width])


  function check() {
    createInput(this.getAbsolutePosition())
  }

  function createInput(pos) {


    const containerDiv = document.getElementById('container');

    let focusInput = false


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
    input.style.top = pos.y - 3 + 'px';
    input.style.left = pos.x - 10 + 'px';
    input.className = style.input__size
    input.style.height = 20 + 6 + 'px';
    input.style.width = 100 + 3 + 'px';
    input.onchange = (e) => setValueCopy(e.currentTarget?.value)
    input.value = valueCopy.toFixed(0)
    input.onblur = (e) => {
      focusInput = false
      onBlurInput(e.currentTarget?.value, containerDiv, wrap)

    }



    input.onfocus = (e) => {
      focusInput = true
    }

    wrap.appendChild(input);

    function removeInput(e) {
      if (e.target === wrap) {
        if (!focusInput) containerDiv?.removeChild(wrap)
      }

    }

    wrap.addEventListener('click', removeInput);

  }





  const onBlurInput = (valueInput, containerDiv, wrap) => {

    let changeValue = 0

    type == 'right' ? changeValue = -(valueInput / 5 - value) : changeValue = (valueInput / 5 - value)

    // ((valueInput / 5) - value)

    dispatch(changeVerticalFrames({ itemSelect, changeValue, widthLeftWall }))

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
        <Text text={((widthShow || value) * 5).toFixed(0) + " mm"} padding={5} />
      </Label>
    </Group>
  );
}




function Metrics(props) {

  const { width, height,
    widthLeftWall, widthRightWall,
    setRightRectangels,
    LeftWall,
    RightWall
  } = props


  const [verticalComponents, setVerticalComponents] = useState([])
  const [verticalLeftComponents, setVerticalLeftComponents] = useState([])
  const [verticalRightComponents, setVerticalRightComponents] = useState([])
  const [horizontalComponents, setHorizontalComponents] = useState([])


  const { verticalFrames, horizontalFrames, downVisible, upVisible } = useSelector(store => store.mainRectangles)
  const { horizontalLeftFrames, leftRectangels, LeftWallVisible } = useSelector(store => store.leftRectangels)
  const { horizontalRightFrames, RightRectangels, RightWallVisible } = useSelector(store => store.rightRectangels)


  function processSection() {

    const copyVerticalFrames = [...verticalFrames]
    const copyHorizontalFrames = [...horizontalFrames]


    const sortedVertical = copyVerticalFrames.sort((itme1, item2) => itme1['x'] > item2['x'] ? 1 : -1);

    const sortedHorizontal = copyHorizontalFrames.sort((itme1, item2) => itme1['y'] > item2['y'] ? 1 : -1);

    const horizntalArr = []
    const verticalArr = []

    if (sortedVertical.length === 1) {

      sortedVertical.forEach((item) => {
        horizntalArr.push(<HorizontalMetric
          key={item.id}
          x={5}
          y={0}
          width={item.x - 5}
          widthShow={!LeftWallVisible ? item.x-FRAME_SIZESHOW*2 : item.x - FRAME_SIZESHOW}
          itemSelect={item}
          widthLeftWall={widthLeftWall}
        />
          ,
          <HorizontalMetric
            x={item.x + FRAME_SIZE}
            y={0}
            width={width - item.x - FRAME_SIZE * 2}
            itemSelect={item}
            type={'right'}
            widthLeftWall={widthLeftWall}
            widthShow={RightWallVisible ? width - item.x : width - item.x - FRAME_SIZESHOW}
          />
        )
      });

    } else {

      sortedVertical.forEach((item, index) => {
        if (sortedVertical[0] === item) {

          horizntalArr.push(<HorizontalMetric
            key={item.id}
            x={5}
            y={0}
            width={item.x - 5}
            widthShow={!LeftWallVisible ? item.x : item.x - FRAME_SIZESHOW}
            itemSelect={item}
            widthLeftWall={widthLeftWall}
          />)
        }

        if (item !== sortedVertical[0] && item !== sortedVertical[sortedVertical.length - 1]) {
          horizntalArr.push(<HorizontalMetric
            key={index}
            x={sortedVertical[index - 1].x + FRAME_SIZE}
            y={0}
            width={item.x - sortedVertical[index - 1].x - FRAME_SIZE}
            widthShow={item.x - sortedVertical[index - 1].x - FRAME_SIZESHOW}
            itemSelect={item}

            widthLeftWall={widthLeftWall}
          />)
        }

        if (item === sortedVertical[sortedVertical.length - 1]) {

          horizntalArr.push(<HorizontalMetric
            x={sortedVertical[index - 1].x + FRAME_SIZE}
            y={0}
            width={item.x - sortedVertical[index - 1].x - FRAME_SIZE}
            widthShow={item.x - sortedVertical[index - 1].x - FRAME_SIZESHOW}
            itemSelect={item}
            widthLeftWall={widthLeftWall}
          />,
            <HorizontalMetric
              x={sortedVertical[index].x + FRAME_SIZE}
              y={0}
              width={width - sortedVertical[index].x - FRAME_SIZE * 2}
              itemSelect={item}
              type={'right'}
              widthLeftWall={widthLeftWall}
              widthShow={RightWallVisible ? width - sortedVertical[index].x : width - sortedVertical[index].x - FRAME_SIZESHOW}
            // если ширина встроенного как будто без рамок ( внутрення равна ширине)
            // widthShow={width - sortedVertical[index].x - FRAME_SIZESHOW}

            />

          )

        }
      });
    }

    if (sortedHorizontal.length === 1) {

      sortedHorizontal.forEach((item, index) => {
        verticalArr.push(<VerticalMetric
          x={0}
          y={upVisible ? 5 : 0}
          height={item.y - (upVisible ? 5 : 0)}
          heightShow={item.y - (upVisible ? FRAME_SIZESHOW : 0)}
          itemSelect={item}
          widthLeftWall={widthLeftWall}
          lineSize={-150}
          type={'up'}
        />,
          <VerticalMetric
            x={0}
            y={item.y + FRAME_SIZE}
            itemSelect={item}
            // 19.2(19,2*5 = 96 ) размер пола , а 14,2 рамзер пола визуально
            height={height - item.y - (downVisible ? FRAME_SIZE * 2 + 14.2 : FRAME_SIZE)}
            heightShow={height - item.y - (downVisible ? FRAME_SIZESHOW + 19.2 : FRAME_SIZESHOW)}
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
            y={upVisible ? 5 : 0}
            height={item.y - (upVisible ? 5 : 0)}
            heightShow={item.y - (upVisible ? FRAME_SIZESHOW : 0)}
            itemSelect={item}

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
            heightShow={item.y - sortedHorizontal[index - 1].y - FRAME_SIZESHOW}
            itemSelect={item}
            widthLeftWall={widthLeftWall}
          />)
        }

        if (item === sortedHorizontal[sortedHorizontal.length - 1]) {

          verticalArr.push(<VerticalMetric
            x={0}
            y={sortedHorizontal[index - 1].y + FRAME_SIZE}
            height={item.y - sortedHorizontal[index - 1].y - FRAME_SIZE}
            heightShow={item.y - sortedHorizontal[index - 1].y - FRAME_SIZESHOW}
            itemSelect={item}
            widthLeftWall={widthLeftWall}
          />,
            <VerticalMetric
              x={0}
              y={item.y + FRAME_SIZE}
              height={height - item.y - (downVisible ? FRAME_SIZE * 2 + 14.2 : FRAME_SIZE)}
              heightShow={height - item.y - (downVisible ? FRAME_SIZESHOW + 19.2 : FRAME_SIZESHOW)}
              itemSelect={item}
              lineSize={-150}
              type={'down'}
            />

          )

        }
      });
    }


    // creataeLeftArrow()
    // creataeRightArrow()


    setHorizontalComponents(horizntalArr)

    setVerticalComponents(verticalArr)
  }


  const creataeLeftArrow = () => {

    const horizontalLeftFramesCopy = [...horizontalLeftFrames]

    const sortedHorizontal = horizontalLeftFramesCopy.sort((itme1, item2) => itme1['y'] > item2['y'] ? 1 : -1);

    const verticalArr = []


    if (sortedHorizontal.length === 1) {
      sortedHorizontal.forEach((item, index) => {

        verticalArr.push(<VerticalMetric
          x={0}
          y={30}
          height={item.y - 30}
          heightShow={item.y}
          itemSelect={item}
          widthLeftWall={widthLeftWall}

          left={true}
        />,
          <VerticalMetric
            x={0}
            y={item.y + FRAME_SIZE}
            height={height - item.y - FRAME_SIZE - 30}
            heightShow={height - item.y - FRAME_SIZE}
            change={false}
          />

        )

      })


    } else {
      sortedHorizontal.forEach((item, index) => {
        if (sortedHorizontal[0] === item) {

          verticalArr.push(<VerticalMetric
            x={0}
            y={30}
            height={item.y - 30}
            heightShow={item.y}
            itemSelect={item}
            widthLeftWall={widthLeftWall}
            horizontalLeftFrames={horizontalLeftFrames}


            left={true}
          />)
        }

        if (item !== sortedHorizontal[0] && item !== sortedHorizontal[sortedHorizontal.length - 1]) {
          verticalArr.push(<VerticalMetric
            x={0}
            y={sortedHorizontal[index - 1].y + FRAME_SIZE}
            height={item.y - sortedHorizontal[index - 1].y - FRAME_SIZE}
            itemSelect={item}
            widthLeftWall={widthLeftWall}
            horizontalLeftFrames={horizontalLeftFrames}



            left={true}
          />)
        }

        if (item === sortedHorizontal[sortedHorizontal.length - 1]) {

          verticalArr.push(<VerticalMetric
            x={0}
            y={sortedHorizontal[index - 1].y + FRAME_SIZE}
            height={item.y - sortedHorizontal[index - 1].y - FRAME_SIZE}
            itemSelect={item}
            widthLeftWall={widthLeftWall}
            horizontalLeftFrames={horizontalLeftFrames}



            left={true}
          />,
            <VerticalMetric
              x={0}
              y={item.y + FRAME_SIZE}
              height={height - item.y - FRAME_SIZE - 30}
              heightShow={height - item.y - FRAME_SIZE}
              change={false}
            />
          )

        }
      });
    }

    setVerticalLeftComponents(verticalArr)

  }

  const creataeRightArrow = () => {

    const horizontalRightFramesCopy = [...horizontalRightFrames]

    const sortedHorizontal = horizontalRightFramesCopy.sort((itme1, item2) => itme1['y'] > item2['y'] ? 1 : -1);

    const verticalArr = []


    if (sortedHorizontal.length === 1) {
      sortedHorizontal.forEach((item, index) => {

        verticalArr.push(<VerticalMetric
          x={0}
          y={30}
          height={item.y - 30}
          heightShow={item.y}
          itemSelect={item}
          horizontalRightFrames={horizontalRightFrames}
          setRightRectangels={setRightRectangels}
          widthLeftWall={widthLeftWall}
          right={true}
        />,
          <VerticalMetric
            x={0}
            y={item.y + FRAME_SIZE}
            height={height - item.y - FRAME_SIZE - 30}
            heightShow={height - item.y - FRAME_SIZE}
            change={false}
          />

        )

      })


    } else {
      sortedHorizontal.forEach((item, index) => {
        if (sortedHorizontal[0] === item) {

          verticalArr.push(<VerticalMetric
            x={0}
            y={30}
            height={item.y - 30}
            heightShow={item.y}
            itemSelect={item}
            horizontalRightFrames={horizontalRightFrames}


            right={true}
            widthLeftWall={widthLeftWall}
          />)
        }

        if (item !== sortedHorizontal[0] && item !== sortedHorizontal[sortedHorizontal.length - 1]) {
          verticalArr.push(<VerticalMetric
            x={0}
            y={sortedHorizontal[index - 1].y + FRAME_SIZE}
            height={item.y - sortedHorizontal[index - 1].y - FRAME_SIZE}
            itemSelect={item}
            horizontalRightFrames={horizontalRightFrames}

            right={true}
            widthLeftWall={widthLeftWall}
          />)
        }

        if (item === sortedHorizontal[sortedHorizontal.length - 1]) {

          verticalArr.push(<VerticalMetric
            x={0}
            y={sortedHorizontal[index - 1].y + FRAME_SIZE}
            height={item.y - sortedHorizontal[index - 1].y - FRAME_SIZE}
            itemSelect={item}
            horizontalRightFrames={horizontalRightFrames}


            right={true}
            widthLeftWall={widthLeftWall}
          />,
            <VerticalMetric
              x={0}
              y={item.y + FRAME_SIZE}
              height={height - item.y - FRAME_SIZE - 30}
              heightShow={height - item.y - FRAME_SIZE}
              change={false}
            />
          )

        }
      });
    }

    setVerticalRightComponents(verticalArr)

  }



  useEffect(() => {
    processSection()

  }, [verticalFrames, horizontalFrames, width, height, widthLeftWall,
    horizontalLeftFrames, horizontalRightFrames, leftRectangels, RightRectangels, downVisible,upVisible, LeftWallVisible, RightWallVisible])



  return (
    <Group
      x={100}>
      <VerticalMetric
        height={height}
        heightShow={height}
        x={LeftWall ? -(60 + 100) : -60}
        y={0}
        change={false}
        lineSize={160}

      />
      <HorizontalMetric
        x={widthLeftWall - 100}
        y={-25}
        width={width}
        widthShow={width}
        change={false}
      />
      {/* <Group visible={LeftWall}>
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
      </Group> */}
      <Group x={-(25 + 100)}>{verticalLeftComponents}</Group>
      <Group x={width + (RightWall ? widthRightWall : 0) + (widthLeftWall - 100) + 40}>{verticalComponents}</Group>
      <Group x={width + widthRightWall + (widthLeftWall - 100)}>{verticalRightComponents}</Group>
      <Group x={widthLeftWall - 100} y={height}>{horizontalComponents}</Group>
    </Group>
  );
}



export default Metrics
