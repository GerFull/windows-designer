import React from 'react'
import { Line } from 'react-konva'
import useImage from 'use-image'

function Poligon(props) {

   const { points, tension, fill, texture } = props

   const [textureImage] = useImage(texture,'Anonymous')

   return (
      <Line
         points={points}
         closed={true}
         tension={tension}
         fill={texture ? null : fill}
         stroke={'black'}
         strokeWidth={1}
         fillPatternImage={textureImage && textureImage}
         draggable={true}
      />

   )
}

export default Poligon
