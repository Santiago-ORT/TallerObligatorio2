import React, { useState } from "react";
import "./Login.css"; 

const Login = ({ isShowing, hide, onSwitchToRegistro }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const err = {};

    if (!email.trim()) err.email = "El email es requerido.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      err.email = "Email inválido.";

    if (!password.trim()) err.password = "La contraseña es requerida.";
    if (password.length < 6)
      err.password = "Debe tener mínimo 6 caracteres.";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    console.log("Login OK ✅", { email, password });
    // Aquí iría la lógica de autenticación y luego hide()
  };
  
  // Función para alternar al modal de Registro
  const handleRegisterClick = (e) => {
    e.preventDefault();
    if (onSwitchToRegistro) {
        onSwitchToRegistro(); // Alterna a Registro
    } else {
        hide(); // Si no hay prop de alternar, simplemente cierra
    }
  };

  // 🚨 CLAVE: Si no está visible, no renderiza nada.
  if (!isShowing) {
    return null; 
  }

  return (
    // Usamos modal-overlay para el fondo oscuro
    <div className="modal-overlay" onClick={hide}> 
      {/* Usamos login-card para el contenido, e.stopPropagation() evita que el clic en el formulario cierre el modal */}
      <form 
        className="login-card modal-content animado" 
        onSubmit={handleSubmit} 
        noValidate
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Botón de cerrar, posicionado absolutamente por CSS */}
        <button
            type="button"
            className="modal-close-button btn-cerrar-superior"
            onClick={hide} 
            aria-label="Cerrar Modal"
        >
            <span aria-hidden="true">&times;</span>
        </button>
        
        <h2 className="login-title">Iniciar sesión</h2>

        <label className="login-label">Email</label>
        <input
          type="email"
          className={`login-input ${errors.email ? "input-error" : ""}`}
          placeholder="tu@correo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <p className="error-text">{errors.email}</p>}

        <label className="login-label">Contraseña</label>
        <div className="password-row">
          <input
            type={showPassword ? "text" : "password"}
            className={`login-input ${errors.password ? "input-error" : ""}`}
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="toggle-pass"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Ocultar" : "Ver"}
          </button>
        </div>
        {errors.password && <p className="error-text">{errors.password}</p>}

        <button type="submit" className="login-btn">
          Ingresar
        </button>
      </form>
    </div>
  );
};

export default Login;