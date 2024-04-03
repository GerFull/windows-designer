import React from 'react'
import { Image } from 'react-konva';
import useImage from 'use-image';

function UrlImage({image,onDragStart,onDragEnd}) {
   const [img] = useImage(image.src);



   return (

      <Image
         image={img}
         x={image.x}
         y={image.y}
         width={image.width}
         height={image.height}
         // stroke={'white'}
         // strokeWidth={1}
         draggable={true}
         onDragStart={onDragStart}
         onDragEnd={(e)=>onDragEnd(e)}
         // offsetX={img ? img.width / 2 : 0}
         // offsetY={img ? img.height / 2 : 0}
      />


   )
}

export default UrlImage
