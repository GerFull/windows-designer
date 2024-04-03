import React from 'react'
import { Line } from 'react-konva'
import useImage from 'use-image'

function Poligon(props) {

   const { points, tension, fill, texture } = props

   const [textureImage] = useImage(texture)

   return (
      <Line
         points={points}
         closed={true}
         tension={tension}
         fill={texture ? null : fill}
         stroke={'black'}
         strokeWidth={1}
         fillPatternImage={texture && textureImage}
         draggable={true}
      />

   )
}

export default Poligon
