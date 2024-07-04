import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import style from './CreateTexturePage.module.scss'


function CreateTexturePage() {

   const { id } = useParams()
   const navigate = useNavigate()

   const [file, setFile] = useState(null);
   const [artcle, setArticle] = useState()
   const [cost, setCost] = useState()
   const [nameTexture, setNameTexture] = useState()
   const [imgsrc, setImgSrc] = useState()


   const UPLOAD_ENDPOINT =
      "http://127.0.0.1:8000/api/Textures/";


   const handleSubmit = async e => {
      e.preventDefault();
      let res = await uploadFile(file);

   };

   const uploadFile = async (file) => {
      const formData = new FormData();
      formData.append("img", file);
      formData.append("title", nameTexture)
      formData.append("cost", cost)
      formData.append("article", artcle)
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

      <div className={style.adminPage} id='1'>

         <div className={style.container}>
            <button className={style.adminPage__btnBack} onClick={() => navigate(-1)}><img src="../images/arrowBack.png" /></button>

         </div>


         <div className={style.menu} style={{ backgroundColor: '#d9d9d9' }}>
            <div className={style.container_inputs}>
               <input type="file" onChange={handleOnChange} accept="image/png, image/jpeg, image/jpg" multiple={false}/>
               <div className={style.adminPage__inputsItem}>
                  <p> Название текстуры</p>
                  <input className={style.input__text} value={nameTexture} onChange={e => setNameTexture(e.target.value)} type='text' />
               </div>
               <div className={style.adminPage__inputsItem}>
                  <p>Цена</p>
                  <input className={style.input__text} value={cost} onChange={e => setCost(e.target.value)} type='number' />
               </div>
               <div className={style.adminPage__inputsItem}>
                  <p> Артикул</p>
                  <input className={style.input__text} value={artcle} onChange={e => setArticle(e.target.value)} type='text' />
               </div>
               <button className={style.btn__item} onClick={handleSubmit} >Создать</button>
               <img className={style.container_inputs_img} src={imgsrc} />
            </div>

         </div>














      </div>
   )
}

export default CreateTexturePage