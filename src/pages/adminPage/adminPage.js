import { useState, useEffect } from 'react'
import axios from "axios";
import style from './adminPage.module.scss'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { changeAdmin, changeMaxHeight, changeMaxWidth, changeMinHeight, changeMinWidth } from '../../store/slice/globalVariable';



function AdminPage() {

   const dispatch=useDispatch()
   const {admin}=useSelector(state=>state.globalVariable)

   const navigate=useNavigate()
   const [arrTextures, setTextures] = useState([])
   // const [admin, setAdmin] = useState(false)
   const [login, setLogin] = useState()
   const [password, setPassword] = useState()
   const [type, setType] = useState(0)

   const [maxHeight, setMaxHeigth] = useState(3000)
   const [minHeight, setMinHeigth] = useState(1000)
   const [maxWidth, setMaxWidth] = useState(5000)
   const [minWidth, setMinWidth] = useState(2000)

   const fetchData = async () => {
      const responce = await axios.get('http://127.0.0.1:8000/api/Textures/').catch(err => console.log(err));


      if (responce !== undefined) {
         setTextures(responce.data);
      }

   }

   useEffect(() => {
      fetchData()
   }, [])

   const checkAdmin = () => {
      if (login == 'admin' && password === 'admin') {
         dispatch(changeAdmin(true))
      
      }

   }



   console.log(admin)

   return (
      <div>
         <button onClick={()=>navigate(-1)}>back</button>
         {
            !admin &&
            <div>
               admin
               <div>
                  Login
                  <input value={login} onChange={e => setLogin(e.target.value)} type="text" />
               </div>
               <div>
                  password
                  <input value={password} onChange={e => setPassword(e.target.value)} type="password" />
               </div>
               <button onClick={checkAdmin}>log in</button>

            </div>
         }


         {

            admin &&
            <div className={style.admin}>
               <div>
                  <div onClick={() => setType(0)}>Изменение ограничений</div>
                  <div onClick={() => setType(1)}>Текстуры</div>
               </div>
               {
                  type === 0 &&
                  <div>
                     <div>
                        <div>
                           Максимальная высота
                           <input onBlur={()=>dispatch(changeMaxHeight(maxHeight))} value={maxHeight} onChange={e => setMaxHeigth(e.target.value)} type="text" />
                        </div>
                        <div>
                           Минимальная высота
                           <input onBlur={()=>dispatch(changeMinHeight(minHeight))} value={minHeight} onChange={e => setMinHeigth(e.target.value)} type="text" />
                        </div>

                     </div>
                     <div>
                        <div>
                           Максимальная ширина
                           <input onBlur={()=>dispatch(changeMaxWidth(maxWidth))} value={maxWidth} onChange={e => setMaxWidth(e.target.value)} type="text" />
                        </div>
                        <div>
                           Минимальная ширина
                           <input onBlur={()=>dispatch(changeMinWidth(minWidth))} value={minWidth} onChange={e => setMinWidth(e.target.value)} type="text" />
                        </div>
                     </div>
                  </div>
               }
               {
                  type === 1 &&
                  <div>



                     <Link to={'/admin/create'}><button>Создать текстуру</button></Link>
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
         }


      </div>
   )
}

export default AdminPage
