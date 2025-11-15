import React, { useState } from "react";
import "./Login.css";
import { Link } from "react-router-dom";

const Login = () => {
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
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit} noValidate>
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
        <Link to="/Registro" className="registro-btn">Registrarse</Link>
      </form>
    </div>
  );
};

export default Login;
