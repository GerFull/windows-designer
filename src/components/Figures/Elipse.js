import React from 'react'
import { Ellipse } from 'react-konva'
import useImage from 'use-image'

function ElipseTexture(props) {

   const {x,y,fill,radiusX,radiusY,texture,opacity}=props

   const [textureImage]=useImage(texture)

   return (
      <Ellipse
         x={x}
         y={y}
         fill={texture ? null : fill}
         radiusX={radiusX}
         opacity={opacity}
         radiusY={radiusY}
         stroke={1}
         strokeWidth={1}
         fillPatternImage={texture && textureImage}
      />

   )
}

export default ElipseTexture