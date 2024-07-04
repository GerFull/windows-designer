import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import style from './texturePage.module.scss'
import { set } from 'mobx'

function TexturePage() {

   const { id } = useParams()
   const navigate = useNavigate()

   const [file, setFile] = useState(null);
   const [costTexture, setCostTexture] = useState()
   const [nameTexture, setNameTexture] = useState()
   const [imgsrc, setImgSrc] = useState()
   const [typePage, setTypePage] = useState(0)



   const UPLOAD_ENDPOINT =
      `http://127.0.0.1:8000/api/Textures/${id}`;



   const handleSubmit = async e => {
      e.preventDefault();

      if (file !== null) {
         let res = await changeTexture(file);
         console.log(res.data);
      } else {

         let res = await changeNameTexture()
         console.log(res.data)
      }

      setTypePage(0)
   };

   const changeNameTexture = async () => {

      return await axios.put(UPLOAD_ENDPOINT, { "title": nameTexture, 'cost': costTexture }, {
         headers: {
            'Content-Type': 'application/json',
         }
      });
   }

   const fetchData = async () => {
      const responce = await axios.get(`http://127.0.0.1:8000/api/Textures/${id}`);
      // const json = await data.json();

      setNameTexture(responce.data.title)
      setImgSrc(responce.data.img)
      setCostTexture(responce.data.cost)
   }

   useEffect(() => {
      fetchData()
   }, [])


   const changeTexture = async file => {
      const formData = new FormData();
      formData.append("img", file);
      formData.append("title", nameTexture)



      return await axios.put(UPLOAD_ENDPOINT, formData, {
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


   const deleteTexture = async () => {

      return await axios.delete(UPLOAD_ENDPOINT, {
         headers: {
            "content-type": "multipart/form-data",
         }
      }).then(res => console.log(res)).catch(err => console.log(err))
   }


   return (


      <div className={style.adminPage} id='1'>
         <div className={style.container}>
            <button className={style.adminPage__btnBack} onClick={() => navigate(-1)}><img src="../images/arrowBack.png" /></button>
         </div>
         <div className={style.menu} style={{ backgroundColor: '#d9d9d9' }}>
            <div className={style.btn__container}>
               <button className={style.btn__item} onClick={() => setTypePage(1)}><p>Изменить</p></button>
               <button className={style.btn__item} onClick={() => setTypePage(0)}><p>Просмотр</p></button>
               <button className={style.btn__item} onClick={deleteTexture}><p>Удалить</p></button>
            </div>
            {
               typePage == 0 &&
               <div className={style.adminPage__container}>
                  <p className={style.title}>{nameTexture}</p>
                  <p className={style.title}>{costTexture} rub</p>
                  <img className={style.container_inputs_img} src={imgsrc} />

               </div>
            }
            {
               typePage == 1 &&
               <div className={style.changeContainer}>
                  <input type="file" onChange={handleOnChange} />
                  <div>
                     <p className={style.title}>Название текстуры</p>
                     <input className={style.input__text} value={nameTexture} onChange={e => setNameTexture(e.target.value)} type='text' />
                  </div>
                  <div>
                     <p className={style.title}>Цена</p>
                     <input className={style.input__text} value={costTexture} onChange={e => setCostTexture(e.target.value)} type='number' />
                  </div>
                  <img className={style.container_inputs_img} src={imgsrc} />
                  <button className={style.btn__item} onClick={handleSubmit} >Изменить</button>

               </div>
            }
         </div>
      </div>
   )
}

export default TexturePage