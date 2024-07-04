import { BrowserRouter } from "react-router-dom";
import Routes from '../pages/routes';
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { limitsVariable } from "../store/slice/globalVariable";



function App() {

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(limitsVariable())
  }, [])




  return (

    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  )
}

export default App;
