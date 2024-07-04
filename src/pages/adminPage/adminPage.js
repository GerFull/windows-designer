import { useState, useEffect } from 'react'
import axios from "axios";
import style from './adminPage.module.scss'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
   changeAdmin, changeMaxHeight, changeMaxWidth, changeMinHeight, changeMinWidth, changeMaxDepth,
   changeMinDepth, changeCoeficentMarkUo, changeCoeficentWaste, changePriceBox, changePriceHanger, changePriceBarbel, changePriceMechanismDoor
} from '../../store/slice/globalVariable';



function AdminPage() {

   const dispatch = useDispatch()
   const { admin, minHeight, maxHeight, maxWidth, minWidth, maxDepth, minDepth, coeficentMarkUo, coeficentWaste, priceBarbel, priceBox, priceHanger, priceMechanismDoor } = useSelector(state => state.globalVariable)

   const navigate = useNavigate()
   const [arrTextures, setTextures] = useState([])
   // const [admin, setAdmin] = useState(false)
   const [login, setLogin] = useState()
   const [password, setPassword] = useState()
   const [type, setType] = useState(0)

   const [maxHeightCopy, setMaxHeigth] = useState(maxHeight)
   const [minHeightCopy, setMinHeigth] = useState(minHeight)

   const [maxWidthCopy, setMaxWidth] = useState(maxWidth)
   const [minWidthCopy, setMinWidth] = useState(minWidth)

   const [maxDepthCopy, setMaxDepth] = useState(maxDepth)
   const [minDepthCopy, setMinDepth] = useState(minDepth)

   const [coeficentMarkUoCopy, setCoeficentMarkUo] = useState(coeficentMarkUo)
   const [coeficentWasteCopy, setCoeficentWaste] = useState(coeficentWaste)


   const [priceBoxCopy, setPriceBoxCopy] = useState(priceBox)
   const [priceBarbelCopy, setPriceBarbelCopy] = useState(priceBarbel)
   const [priceHangerCopy, setPriceHangerCopy] = useState(priceHanger)
   const [priceMechanismDoorCopy, setPriceMechanismDoorCopy] = useState(priceMechanismDoor)



   const fetchData = async () => {
      const responce = await axios.get('http://127.0.0.1:8000/api/Textures/').catch(err => console.log(err));

      if (responce !== undefined) {
         setTextures(responce.data);
      }
   }

   useEffect(() => {
      fetchData()
   }, [])

   useEffect(() => {
      setMaxHeigth(maxHeight)
      setMinHeigth(minHeight)
      setMaxWidth(maxWidth)
      setMinWidth(minWidth)
      setMaxDepth(maxDepth)
      setMinDepth(minDepth)
      setCoeficentMarkUo(coeficentMarkUo)
      setCoeficentWaste(coeficentWaste)
      setPriceBoxCopy(priceBox)
      setPriceBarbelCopy(priceBarbel)
      setPriceHangerCopy(priceHanger)
      setPriceMechanismDoorCopy(priceMechanismDoor)
   }, [maxHeight])


   const checkAdmin = () => {
      if (login == 'admin' && password === 'admin') {
         dispatch(changeAdmin(true))
      }
   }


   const changeLimits = async (typeDispatch, value, nameLimit) => {
      dispatch(typeDispatch(value))

      await axios.put('http://127.0.0.1:8000/api/Limits/1', { [nameLimit]: value, }, {
         headers: {
            'Content-Type': 'application/json',
         }
      });
   }


   return (
      <>
         {
            !admin &&
            <div className={style.admin__signIn}>
               <div className={style.admin__signInContainer}>
                  <div className={style.admin__inputsItem}>
                     <p>Логин</p>
                     <input className={style.input__text} value={login} onChange={e => setLogin(e.target.value)} type="text" />
                  </div>
                  <div className={style.admin__inputsItem}>
                     <p>Пароль</p>
                     <input className={style.input__text} value={password} onChange={e => setPassword(e.target.value)} type="password" />
                  </div>
                  <button className={style.admin__btn} onClick={checkAdmin}><p>Войти</p></button>
               </div>
            </div>
         }
         {
            admin &&
            <div className={style.adminPage} id='1'>
               <div className={style.container}>
                  <button className={style.admin__btnBack} onClick={() => navigate(-1)}><img src="./images/arrowBack.png" /></button>
               </div>
               <div className={style.menu} style={{ backgroundColor: '#d9d9d9' }}>
                  <div className={style.admin__btnContainer}>
                     <div className={style.admin__btn} onClick={() => setType(0)}><p>Изменение  ограничений</p></div>
                     <div className={style.admin__btn} onClick={() => setType(1)}><p>Текстуры</p></div>
                     {type === 1 && <Link to={'/admin/create'}><div className={style.admin__btn}><p>Создать текстуру</p></div></Link>}
                  </div>
                  {
                     type === 0 &&
                     <div className={style.admin__inputs}>
                        <div className={style.admin__inputsItem}>
                           <p>Максимальная высота</p>
                           <input className={style.input__text} onBlur={() => changeLimits(changeMaxHeight, maxHeightCopy, 'maxHeight')} value={maxHeightCopy} onChange={e => setMaxHeigth(e.target.value)} type="text" />
                        </div>
                        <div className={style.admin__inputsItem}>
                           <p>Минимальная высота</p>
                           <input className={style.input__text} onBlur={() => changeLimits(changeMinHeight, minHeightCopy, 'minHeight')} value={minHeightCopy} onChange={e => setMinHeigth(e.target.value)} type="text" />
                        </div>
                        <div className={style.admin__inputsItem}>
                           <p> Максимальная ширина</p>
                           <input className={style.input__text} onBlur={() => changeLimits(changeMaxWidth, maxWidthCopy, 'maxWidth')} value={maxWidthCopy} onChange={e => setMaxWidth(e.target.value)} type="text" />
                        </div>
                        <div className={style.admin__inputsItem}>
                           <p> Минимальная ширина</p>
                           <input className={style.input__text} onBlur={() => changeLimits(changeMinWidth, minWidthCopy, 'minWidth')} value={minWidthCopy} onChange={e => setMinWidth(e.target.value)} type="text" />
                        </div>
                        <div className={style.admin__inputsItem}>
                           <p>Коофициент наценки</p>
                           <input className={style.input__text} onBlur={() => changeLimits(changeCoeficentMarkUo, coeficentMarkUoCopy, 'coeficentMarkUo')} value={coeficentMarkUoCopy} onChange={e => setCoeficentMarkUo(e.target.value)} type="text" />
                        </div>
                        <div className={style.admin__inputsItem}>
                           <p>Коофицент тех.отхода</p>
                           <input className={style.input__text} onBlur={() => changeLimits(changeCoeficentWaste, coeficentWasteCopy, 'coeficentWaste')} value={coeficentWasteCopy} onChange={e => setCoeficentWaste(e.target.value)} type="text" />
                        </div>
                        <div className={style.admin__inputsItem}>
                           <p>Максимальная глубина</p>
                           <input className={style.input__text} onBlur={() => changeLimits(changeMaxDepth, maxDepthCopy, 'maxDepth')} value={maxDepthCopy} onChange={e => setMaxDepth(e.target.value)} type="text" />
                        </div>
                        <div className={style.admin__inputsItem}>
                           <p>Минимальная глубина</p>
                           <input className={style.input__text} onBlur={() => changeLimits(changeMinDepth, minDepthCopy, 'minDepth')} value={minDepthCopy} onChange={e => setMinDepth(e.target.value)} type="text" />
                        </div>
                        <div className={style.admin__inputsItem}>
                           <p>Цена ящика</p>
                           <input className={style.input__text} onBlur={() => changeLimits(changePriceBox, priceBoxCopy, 'priceBox')} value={priceBoxCopy} onChange={e => setPriceBoxCopy(e.target.value)} type="text" />
                        </div>
                        <div className={style.admin__inputsItem}>
                           <p>Цена вешалки</p>
                           <input className={style.input__text} onBlur={() => changeLimits(changePriceHanger, priceHangerCopy, 'priceHanger')} value={priceHangerCopy} onChange={e => setPriceHangerCopy(e.target.value)} type="text" />
                        </div>
                        <div className={style.admin__inputsItem}>
                           <p>Цена штанги</p>
                           <input className={style.input__text} onBlur={() => changeLimits(changePriceBarbel, priceBarbelCopy, 'priceBarbel')} value={priceBarbelCopy} onChange={e => setPriceBarbelCopy(e.target.value)} type="text" />
                        </div>
                        <div className={style.admin__inputsItem}>
                           <p>Цена механизма двери</p>
                           <input className={style.input__text} onBlur={() => changeLimits(changePriceMechanismDoor, priceMechanismDoorCopy, 'priceMechanismDoor')} value={priceMechanismDoorCopy} onChange={e => setPriceMechanismDoorCopy(e.target.value)} type="text" />
                        </div>
                     </div>
                  }
                  {
                     type === 1 &&
                     <div className={style.admin__texture}>
                        {
                           arrTextures.map(item =>
                              <Link to={`/admin/${item.id}`}>
                                 <div className={style.texture} >
                                    <img src={`http://127.0.0.1:8000/${item.img}`}
                                    />
                                    <p>{item.title}</p>
                                 </div>
                              </Link>
                           )
                        }
                     </div>
                  }
               </div>
            </div>
         }
      </>
   )
}

export default AdminPage
