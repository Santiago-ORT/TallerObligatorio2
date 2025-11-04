import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home/Home";

//Este Componente maneja las rutas de toda la app, se importan componentes y se define la ruta que lo invoca.
export default function LayoutRutas() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
      </Routes>
    </BrowserRouter>
  );
}