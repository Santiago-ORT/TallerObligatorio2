import React from 'react'
import './Registros.css'
import { Link } from "react-router-dom";
const Registros = () => {
  return (
    <div class="login-page">
        <div class="login-card">
            <h1 class="login-title">
                Crear Cuenta
            </h1>
            <form class="flex flex-col gap-4">
                
                <div>
                    <label for="name" class="login-label">
                        Nombre Completo
                    </label>
                    <div class="input-row">
                        <input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Escribe tu nombre"
                            class="login-input"
                        />
                    </div>
                </div>
                <div>
                    <label for="email" class="login-label">
                        Correo Electrónico
                    </label>
                    <div class="input-row">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="ejemplo@dominio.com"
                            class="login-input"
                        />
                    </div>
                </div>
                <div>
                    <label for="password" class="login-label">
                        Contraseña
                    </label>
                    <div class="input-row">
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Mínimo 6 caracteres"
                            class="login-input"
                        />
                    </div>
                </div>
                <div>
                    <label for="confirmPassword" class="login-label">
                        Confirmar Contraseña
                    </label>
                    <div class="input-row">
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="Repite tu contraseña"
                            class="login-input"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    class="login-btn"
                >
                    Registrarse
                </button>
            </form>
            
            <p class="login-footer">
                ¿Ya tienes cuenta? <Link to = '/Login' aria-label="Ir a la página de inicio de sesión">Inicia sesión</Link>
            </p>

        </div>
    </div>
  )
}

export default Registros
