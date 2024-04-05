import React from 'react'
import { Image } from 'react-konva';
import useImage from 'use-image';

function UrlImage({ image, onDragStart, onDragEnd, clickCheck, dragover }) {
   const [img] = useImage(image.src);

   function checkClick() {
      clickCheck(this)
   }

   return (

      <Image
         image={img}
         x={image.x}
         y={image.y}
         width={image.width}
         height={image.height}
         stroke={'white'}
         strokeWidth={1}
         draggable={true}
         onDragMove={e => dragover(e.evt)}
         id={image.id}
         type={image.type}
         onClick={checkClick}
         onDragStart={onDragStart}
         onDragEnd={(e) => onDragEnd(e)}
   
      />


   )
}

export default UrlImage
