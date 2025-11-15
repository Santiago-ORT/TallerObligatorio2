import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home/Home";
import AdmUsuarios from "./Usuarios/AdmUsuarios";
import Login from "./Usuarios/Login";
import Registros from "./Usuarios/Registros";

//Este Componente maneja las rutas de toda la app, se importan componentes y se define la ruta que lo invoca.
export default function LayoutRutas() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/Usuarios" element={<AdmUsuarios/>} />
        <Route path="/Login" element={<Login/>} />
        <Route path="/Registro" element={<Registros/>}/>
      </Routes>
    </BrowserRouter>
  );
}