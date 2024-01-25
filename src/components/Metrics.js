import React, { useEffect, useState } from "react";
import { Group, Line, Arrow, Label, Text, Tag } from "react-konva";
import { observer, inject } from "mobx-react";

const METRIC_SIZE = 25;
const FRAME_SIZE = 3;

// разбить на функции создание стрелок

// добавить ограничения в рамках вертикальных и горизонтальных

function VerticalMetric({ x, y, height, itemSelect, Rectangels, horizontalFrames, setRectangels,
  setHorizontalFrames, change = true, heightShow, left = false, right = false,

  horizontalLeftFrames,
  setHorizontalLeftFrames,
  leftRectangels,
  setLeftRectangels,

  horizontalRightFrames,
  setHorizontalRightFrames,
  RightRectangels,
  setRightRectangels,

  lineSize,
  type
}) {


  const [value, setValue] = useState(0)
  const [valueCopy, setValueCopy] = useState(height * 5)

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

    // console.log(itemSelect)

    console.log(valueInput)

    if (left === false && right === false) {
      const itemsDown = Rectangels.filter(item => (
        (item.x >= itemSelect.x && ((item.x + item.width) <= (itemSelect.x + itemSelect.width))) &&
        (item.y === (itemSelect.y + itemSelect.height))
      )
      )

      const itemsUp = Rectangels.filter(item => (
        (item.x >= itemSelect.x && ((item.x + item.width) <= (itemSelect.x + itemSelect.width))) &&
        ((item.y + item.height) === itemSelect.y)
      )
      )




      setRectangels(Rectangels.map(item => {
        if (item.id === itemSelect.id) {
          return { ...item, y: item.y + ((valueInput / 5) - value) }
        }
        else if (itemsUp.includes(item)) {
          return { ...item, height: item.height + ((valueInput / 5) - value), }
        }
        else if (itemsDown.includes(item)) {
          return { ...item, y: item.y + ((valueInput / 5) - value), height: item.height - ((valueInput / 5) - value), }
        }
        else {
          return item
        }
      }))

      setHorizontalFrames(horizontalFrames.map(item => {
        if (item.id === itemSelect.id) {
          return { ...item, y: item.y + ((valueInput / 5) - value) }
        }
        else {
          return item
        }
      }))

      setValue((valueInput) / 5)
    } else if (left === true) {
      console.log('left')
      const itemsDown = leftRectangels.filter(item => (
        (item.x >= itemSelect.x && ((item.x + item.width) <= (itemSelect.x + itemSelect.width))) &&
        (item.y === (itemSelect.y + itemSelect.height))
      )
      )

      const itemsUp = leftRectangels.filter(item => (
        (item.x >= itemSelect.x && ((item.x + item.width) <= (itemSelect.x + itemSelect.width))) &&
        ((item.y + item.height) === itemSelect.y)
      )
      )


      if (heightShow !== undefined) {
        setLeftRectangels(leftRectangels.map(item => {
          if (item.id === itemSelect.id) {
            return { ...item, y: item.y + (((valueInput - 150) / 5) - value) }
          }
          else if (itemsUp.includes(item)) {
            return { ...item, height: item.height + (((valueInput - 150) / 5) - value), }
          }
          else if (itemsDown.includes(item)) {
            return { ...item, y: item.y + (((valueInput - 150) / 5) - value), height: item.height - (((valueInput - 150) / 5) - value), }
          }
          else {
            return item
          }
        }))

        setHorizontalLeftFrames(horizontalLeftFrames.map(item => {
          if (item.id === itemSelect.id) {
            return { ...item, y: item.y + (((valueInput - 150) / 5) - value) }
          }
          else {
            return item
          }
        }))
        setValue((valueInput - 150) / 5)

      } else {
        setLeftRectangels(leftRectangels.map(item => {
          if (item.id === itemSelect.id) {
            return { ...item, y: item.y + (((valueInput) / 5) - value) }
          }
          else if (itemsUp.includes(item)) {
            return { ...item, height: item.height + (((valueInput) / 5) - value), }
          }
          else if (itemsDown.includes(item)) {
            return { ...item, y: item.y + (((valueInput) / 5) - value), height: item.height - (((valueInput) / 5) - value), }
          }
          else {
            return item
          }
        }))

        setHorizontalLeftFrames(horizontalLeftFrames.map(item => {
          if (item.id === itemSelect.id) {
            return { ...item, y: item.y + (((valueInput) / 5) - value) }
          }
          else {
            return item
          }
        }))
        setValue((valueInput) / 5)
      }



    } else if (right === true) {
      console.log('right')
      const itemsDown = RightRectangels.filter(item => (
        (item.x >= itemSelect.x && ((item.x + item.width) <= (itemSelect.x + itemSelect.width))) &&
        (item.y === (itemSelect.y + itemSelect.height))
      )
      )

      const itemsUp = RightRectangels.filter(item => (
        (item.x >= itemSelect.x && ((item.x + item.width) <= (itemSelect.x + itemSelect.width))) &&
        ((item.y + item.height) === itemSelect.y)
      )
      )


      if (heightShow !== undefined) {
        setRightRectangels(RightRectangels.map(item => {
          if (item.id === itemSelect.id) {
            return { ...item, y: item.y + (((valueInput - 150) / 5) - value) }
          }
          else if (itemsUp.includes(item)) {
            return { ...item, height: item.height + (((valueInput - 150) / 5) - value), }
          }
          else if (itemsDown.includes(item)) {
            return { ...item, y: item.y + (((valueInput - 150) / 5) - value), height: item.height - (((valueInput - 150) / 5) - value), }
          }
          else {
            return item
          }
        }))

        setHorizontalRightFrames(horizontalRightFrames.map(item => {
          if (item.id === itemSelect.id) {
            return { ...item, y: item.y + ((valueInput - 150) / 5 - value) }
          }
          else {
            return item
          }
        }))
        setValue((valueInput - 150) / 5)
      } else {

        setRightRectangels(RightRectangels.map(item => {
          if (item.id === itemSelect.id) {
            return { ...item, y: item.y + (((valueInput) / 5) - value) }
          }
          else if (itemsUp.includes(item)) {
            return { ...item, height: item.height + (((valueInput) / 5) - value), }
          }
          else if (itemsDown.includes(item)) {
            return { ...item, y: item.y + (((valueInput) / 5) - value), height: item.height - (((valueInput) / 5) - value), }
          }
          else {
            return item
          }
        }))

        setHorizontalRightFrames(horizontalRightFrames.map(item => {
          if (item.id === itemSelect.id) {
            return { ...item, y: item.y + ((valueInput) / 5 - value) }
          }
          else {
            return item
          }
        }))
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


function HorizontalMetric({ x, y, width, itemSelect, Rectangels, verticalFrames, setRectangels, setVerticalFrames, change = true, widthLeftWall }) {

  const [value, setValue] = useState(0)
  const [valueCopy, setValueCopy] = useState(width * 5)


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


    const itemsLeft = Rectangels.filter(item => (
      (item.y >= itemSelect.y && ((item.y + item.height) <= (itemSelect.y + itemSelect.height))) &&
      ((item.x + item.width) === (itemSelect.x + widthLeftWall))
    )
    )

    const itemsRight = Rectangels.filter(item => (
      (item.y >= itemSelect.y && ((item.y + item.height) <= (itemSelect.y + itemSelect.height))) &&
      (item.x === ((itemSelect.x + widthLeftWall) + itemSelect.width))
    )
    )

    setRectangels(Rectangels.map(item => {
      if (item.id === itemSelect.id) {
        return { ...item, x: item.x + ((valueInput / 5) - value) }
      }
      else if (itemsLeft.includes(item)) {
        return { ...item, width: item.width + ((valueInput / 5) - value), }
      }
      else if (itemsRight.includes(item)) {
        return { ...item, x: item.x + ((valueInput / 5) - value), width: item.width - ((valueInput / 5) - value), }
      }
      else {
        return item
      }
    }))

    setVerticalFrames(verticalFrames.map(item => {
      if (item.id === itemSelect.id) {
        return { ...item, x: item.x + ((valueInput / 5) - value) }
      }
      else {
        return item
      }
    }))

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




function Metrics(props) {

  const { width, height,
    verticalFrames,
    setVerticalFrames,
    horizontalFrames,
    setHorizontalFrames,
    Rectangels, setRectangels, widthLeftWall, widthRightWall,
    horizontalLeftFrames,
    setHorizontalLeftFrames,
    horizontalRightFrames,
    setHorizontalRightFrames,
    leftRectangels,
    setLeftRectangels,
    RightRectangels,
    setRightRectangels,
    LeftWall,
    RightWall
  } = props


  const [verticalComponents, setVerticalComponents] = useState([])
  const [verticalLeftComponents, setVerticalLeftComponents] = useState([])
  const [verticalRightComponents, setVerticalRightComponents] = useState([])
  const [horizontalComponents, setHorizontalComponents] = useState([])


  function processSection() {

    const sortedVertical = verticalFrames.sort((itme1, item2) => itme1['x'] > item2['x'] ? 1 : -1);

    const sortedHorizontal = horizontalFrames.sort((itme1, item2) => itme1['y'] > item2['y'] ? 1 : -1);

    const testArr = []
    const verticalArr = []

    if (sortedVertical.length === 1) {

      sortedVertical.forEach((item, index) => {


        testArr.push(<HorizontalMetric
          key={sortedVertical[0].id}
          x={0}
          y={0}
          width={sortedVertical[0].x}
          itemSelect={item}
          Rectangels={Rectangels}
          setRectangels={setRectangels}
          verticalFrames={verticalFrames}
          setVerticalFrames={setVerticalFrames}
          widthLeftWall={widthLeftWall}
        />
          ,
          <HorizontalMetric
            x={sortedVertical[index].x + FRAME_SIZE}
            y={0}
            width={width - sortedVertical[index].x - FRAME_SIZE}
            change={false}
          />

        )

      });

    } else {

      sortedVertical.forEach((item, index) => {
        if (sortedVertical[0] === item) {

          testArr.push(<HorizontalMetric
            key={sortedVertical[0].id}
            x={0}
            y={0}
            width={sortedVertical[0].x}
            itemSelect={item}
            Rectangels={Rectangels}
            setRectangels={setRectangels}
            verticalFrames={verticalFrames}
            setVerticalFrames={setVerticalFrames}
            widthLeftWall={widthLeftWall}
          />)
        }

        if (item !== sortedVertical[0] && item !== sortedVertical[sortedVertical.length - 1]) {
          testArr.push(<HorizontalMetric
            key={index}
            x={sortedVertical[index - 1].x + FRAME_SIZE}
            y={0}
            width={item.x - sortedVertical[index - 1].x - FRAME_SIZE}
            itemSelect={item}
            Rectangels={Rectangels}
            setRectangels={setRectangels}
            verticalFrames={verticalFrames}
            setVerticalFrames={setVerticalFrames}
            widthLeftWall={widthLeftWall}
          />)
        }

        if (item === sortedVertical[sortedVertical.length - 1]) {

          testArr.push(<HorizontalMetric
            x={sortedVertical[index - 1].x + FRAME_SIZE}
            y={0}
            width={item.x - sortedVertical[index - 1].x - FRAME_SIZE}
            itemSelect={item}
            Rectangels={Rectangels}
            setRectangels={setRectangels}
            verticalFrames={verticalFrames}
            setVerticalFrames={setVerticalFrames}
            widthLeftWall={widthLeftWall}
          />,
            <HorizontalMetric
              x={sortedVertical[index].x + FRAME_SIZE}
              y={0}
              width={width - sortedVertical[index].x - FRAME_SIZE}
              change={false}
            />

          )

        }
      });
    }

    if (sortedHorizontal.length === 1) {
      sortedHorizontal.forEach((item, index) => {

        verticalArr.push(<VerticalMetric
          x={0}
          y={0}
          height={item.y}
          itemSelect={item}
          Rectangels={Rectangels}
          horizontalFrames={horizontalFrames}
          setRectangels={setRectangels}
          setHorizontalFrames={setHorizontalFrames}
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
            Rectangels={Rectangels}
            setRectangels={setRectangels}
            horizontalFrames={horizontalFrames}
            setHorizontalFrames={setHorizontalFrames}
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
            Rectangels={Rectangels}
            horizontalFrames={horizontalFrames}
            setRectangels={setRectangels}
            setHorizontalFrames={setHorizontalFrames}
            widthLeftWall={widthLeftWall}
          />)
        }

        if (item === sortedHorizontal[sortedHorizontal.length - 1]) {

          verticalArr.push(<VerticalMetric
            x={0}
            y={sortedHorizontal[index - 1].y + FRAME_SIZE}
            height={item.y - sortedHorizontal[index - 1].y - FRAME_SIZE}
            itemSelect={item}
            Rectangels={Rectangels}
            horizontalFrames={horizontalFrames}
            setRectangels={setRectangels}
            setHorizontalFrames={setHorizontalFrames}
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


    creataeLeftArrow()
    creataeRightArrow()


    setHorizontalComponents(testArr)

    setVerticalComponents(verticalArr)
  }


  const creataeLeftArrow = () => {

    const sortedHorizontal = horizontalLeftFrames.sort((itme1, item2) => itme1['y'] > item2['y'] ? 1 : -1);

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
          horizontalLeftFrames={horizontalLeftFrames}
          setHorizontalLeftFrames={setHorizontalLeftFrames}
          leftRectangels={leftRectangels}
          setLeftRectangels={setLeftRectangels}
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
            setHorizontalLeftFrames={setHorizontalLeftFrames}
            leftRectangels={leftRectangels}
            setLeftRectangels={setLeftRectangels}
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
            setHorizontalLeftFrames={setHorizontalLeftFrames}
            leftRectangels={leftRectangels}
            setLeftRectangels={setLeftRectangels}
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
            setHorizontalLeftFrames={setHorizontalLeftFrames}
            leftRectangels={leftRectangels}
            setLeftRectangels={setLeftRectangels}
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

    const sortedHorizontal = horizontalRightFrames.sort((itme1, item2) => itme1['y'] > item2['y'] ? 1 : -1);

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
          setHorizontalRightFrames={setHorizontalRightFrames}
          RightRectangels={RightRectangels}
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
            setHorizontalRightFrames={setHorizontalRightFrames}
            RightRectangels={RightRectangels}
            setRightRectangels={setRightRectangels}
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
            setHorizontalRightFrames={setHorizontalRightFrames}
            RightRectangels={RightRectangels}
            setRightRectangels={setRightRectangels}
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
            setHorizontalRightFrames={setHorizontalRightFrames}
            RightRectangels={RightRectangels}
            setRightRectangels={setRightRectangels}
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

  }, [verticalFrames, horizontalFrames, width, height, Rectangels, widthLeftWall,
    horizontalLeftFrames, horizontalRightFrames, leftRectangels, RightRectangels])



  return (
    <Group
      x={100}>
      <VerticalMetric
        height={height}
        x={-(60 + 100)}
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
      <Group x={-(25 + 100)}>{verticalLeftComponents}</Group>
      <Group x={width + widthRightWall + (widthLeftWall - 100) + 50}>{verticalComponents}</Group>
      <Group x={width + widthRightWall + (widthLeftWall - 100)}>{verticalRightComponents}</Group>
      <Group x={widthLeftWall - 100} y={height}>{horizontalComponents}</Group>
    </Group>
  );
}



export default inject("store")(observer(Metrics));
