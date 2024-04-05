import React, { useEffect, useState } from 'react'
import { Rect } from 'react-konva'
import useImage from 'use-image'

function Rectangle(props) {

   const { width, height, x, y, fill, texture, opacity, strokeWidth, clickCheck, type, id, derection, draggable,onDragStart,onDragEnd,dragover } = props

   const [textureImage] = useImage(texture)


   function checkClick() {

      if (type === 'frame') {
         clickCheck(this)
      }
   }

   return (
      <Rect
         id={id}
         width={width}
         height={height}
         onClick={checkClick}
         fill={texture ? null : fill}
         x={x}
         y={y}
         onDragMove={e=>dragover(e.evt)}
         derection={derection}
         stroke="black"
         opacity={opacity}
         draggable={draggable}
         onDragStart={onDragStart}
         onDragEnd={(e)=>onDragEnd(e)}
         strokeWidth={strokeWidth ||0}
         fillPatternImage={textureImage && textureImage}
      />

   )
}

export default Rectangle