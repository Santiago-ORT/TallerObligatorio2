import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes, Navigate} from "react-router-dom"
import Login from '../Componentes/Login'
import Home from '../Componentes/Home'
import Carrito from '../Componentes/Carrito'
function App() {

  return (
    <div>
        <Routes>
          <Route path='/' element={<Login/>}/>
          <Route path='/home' element={<Home/>}/>
          <Route path='/carrito' element={<Carrito/>}/>

        </Routes>
    </div>
  )
}

export default App
