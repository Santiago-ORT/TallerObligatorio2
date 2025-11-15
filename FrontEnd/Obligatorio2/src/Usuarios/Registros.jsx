import React, { useState, useEffect} from "react";
import "./Registros.css"; 
import axios from "axios";
import Swal from "sweetalert2";


const Registros = ({ registroAbierto, registroCerrado }) => { 
  

  const [formData, setFormData] = useState({ 
    usuario: "",
    email: "",
    password: "",
    confirmPassword: "",
    nombre: "",
    apellido: "",
    ci: "",
  });
  
  const [errors, setErrors] = useState({});

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const err = {};
    
  
    if (!formData.usuario.trim()) err.usuario = "El usuario es requerido.";
    
    if (!formData.email.trim()) err.email = "El email es requerido.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      err.email = "Email inválido.";

    if (!formData.password.trim() || formData.password.length < 6)
      err.password = "La contraseña debe tener mínimo 6 caracteres.";
      
    if (formData.password !== formData.confirmPassword)
      err.confirmPassword = "Las contraseñas no coinciden.";
      
    if (!formData.nombre.trim()) err.nombre = "El nombre es requerido.";
    if (!formData.apellido.trim()) err.apellido = "El apellido es requerido.";
    if (!formData.ci.trim()) err.ci = "El CI es requerido.";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  try {
    const response = await axios.post("http://localhost:3000/registro", {
      usuario: formData.usuario,
      email: formData.email,
      password: formData.password,
      nombre: formData.nombre,
      apellido: formData.apellido,
      ci: formData.ci,
    });

    console.log("Registro OK:", response.data);

     await Swal.fire({
      icon: "success",
      title: "Usuario registrado con éxito",
      text: "Vuelve a iniciar sesión",
      confirmButtonText: "Aceptar",
    });

    // Cierra el modal
    if (registroCerrado) registroCerrado();

    // Limpia el formulario
    setFormData({
      usuario: "",
      email: "",
      password: "",
      confirmPassword: "",
      nombre: "",
      apellido: "",
      ci: "",
    });

  } catch (error) {
    console.error("Error en registro:", error);

    if (error.response) {
      Swal.fire({
        icon: "error",
        title: "Error en el registro",
        text: error.response.data.error,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error conectando al servidor",
      });
    }
  }
};
  
  
  if (!registroAbierto) {
    return null; 
  }

  return (
  
    <div className="modal-overlay"> 
      <div className="modal-wrapper">
        <div className="login-card"> 
          
         
          <div className="modal-header">
            <h1 className="login-title">Crear Cuenta</h1>
            <button
              type="button"
              className="modal-close-button"
              onClick={registroCerrado} 
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          
          <form onSubmit={handleSubmit} noValidate>
            
            
            <div>
              <label htmlFor="usuario" className="login-label">Usuario</label>
              <input
                id="usuario"
                name="usuario" 
                type="text"
                placeholder="Escribe tu Usuario"
                className={`login-input ${errors.usuario ? "input-error" : ""}`}
                value={formData.usuario}
                onChange={handleChange}
              />
              {errors.usuario && <p className="error-text">{errors.usuario}</p>}
            </div>

          
            <div>
              <label htmlFor="email" className="login-label">Correo Electrónico</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="ejemplo@dominio.com"
                className={`login-input ${errors.email ? "input-error" : ""}`}
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>

           
            <div>
              <label htmlFor="password" className="login-label">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                className={`login-input ${errors.password ? "input-error" : ""}`}
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <p className="error-text">{errors.password}</p>}
            </div>

           
            <div>
              <label htmlFor="confirmPassword" className="login-label">Confirmar Contraseña</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Repite tu contraseña"
                className={`login-input ${errors.confirmPassword ? "input-error" : ""}`}
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
            </div>
            
            <div>
              <label htmlFor="nombre" className="login-label">Nombre</label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                placeholder="Escribe tu Nombre"
                className={`login-input ${errors.nombre ? "input-error" : ""}`}
                value={formData.nombre}
                onChange={handleChange}
              />
              {errors.nombre && <p className="error-text">{errors.nombre}</p>}
            </div>

          
            <div>
              <label htmlFor="apellido" className="login-label">Apellido</label>
              <input
                id="apellido"
                name="apellido"
                type="text"
                placeholder="Escribe tu Apellido"
                className={`login-input ${errors.apellido ? "input-error" : ""}`}
                value={formData.apellido}
                onChange={handleChange}
              />
              {errors.apellido && <p className="error-text">{errors.apellido}</p>}
            </div>

           
            <div>
              <label htmlFor="ci" className="login-label">CI</label>
              <input
                id="ci"
                name="ci"
                type="number"
                placeholder="Escribe tu CI"
                className={`login-input ${errors.ci ? "input-error" : ""}`}
                value={formData.ci}
                onChange={handleChange}
              />
              {errors.ci && <p className="error-text">{errors.ci}</p>}
            </div>
            
            <button type="submit" className="login-btn">
              Registrarse
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Registros;