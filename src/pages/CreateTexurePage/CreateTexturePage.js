import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import style from './CreateTexturePage.module.scss'


function CreateTexturePage() {

   const { id } = useParams()
   const navigate = useNavigate()

   const [file, setFile] = useState(null);
   const [newTexture, setNewTexture] = useState()
   const [nameTexture, setNameTexture] = useState()
   const [imgsrc, setImgSrc] = useState()


   const UPLOAD_ENDPOINT =
      "http://127.0.0.1:8000/api/Textures/";




   const img = 'http://127.0.0.1:8000/Images/метод.png'

   const handleSubmit = async e => {
      e.preventDefault();
      let res = await uploadFile(file);
      console.log(res.data);
   };



   const uploadFile = async file => {
      const formData = new FormData();
      formData.append("img", file);
      formData.append("title", nameTexture)



      return await axios.post(UPLOAD_ENDPOINT, formData, {
         headers: {
            "content-type": "multipart/form-data",
         }
      });
   };

   const handleOnChange = e => {
      const fileReader = new FileReader()

      fileReader.onload = function changeImg() {
         setImgSrc(fileReader.result)
      }

      fileReader.readAsDataURL(e.target.files[0]);
      setFile(e.target.files[0]);
   };


   return (
      <div>
         <button onClick={() => navigate(-1)}>Back</button>
         <div className={style.container_inputs}>
            <input type="file" onChange={handleOnChange} accept="image/png, image/jpeg, image/jpg" />
            <div>
               Название текстуры
               <input value={nameTexture} onChange={e => setNameTexture(e.target.value)} type='text' />
            </div>
            <button onClick={handleSubmit} >Создать</button>
            <img className={style.container_inputs_img} src={imgsrc} />
         </div>
      </div>
   )
}

export default CreateTexturePage