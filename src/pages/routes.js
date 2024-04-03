import { Routes, Route } from "react-router-dom";
import HomePage from "./homePage/homePage";
import ErrorPage from "./ErrorPage/errorPage";
import AdminPage from "./adminPage/adminPage";
import TexturePage from "./TexturePage/texturePage";
import CreateTexturePage from "./CreateTexurePage/CreateTexturePage";
import DoorPage from "./doorPage/doorPage";


export default () => (
   <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/door" element={<DoorPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/admin/:id" element={<TexturePage />} />
      <Route path="/admin/create" element={<CreateTexturePage />} />
      <Route path="*" element={<ErrorPage />} />
   </Routes>
)