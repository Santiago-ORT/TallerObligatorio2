import React, { useState, useEffect } from "react";
import "./NavBar.css";
import Chart from "../Chart/Chart";
import logo from "../Img/Logo.png";
import Login from "../Usuarios/Login";
import Registros from "../Usuarios/Registros";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Navbar({
  onCategoriaSeleccionada,
  onBuscar,
  productos,
  cantidadCarrito,
  carrito,
  setCarrito,
}) {
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegistroAbierto, setRegistroAbierto] = useState(false);
  const navigate = useNavigate();
  const categoriasBase = [
    "Todos",
    "Guitarras",
    "Bajos",
    "Baterías",
    "Teclados",
    "Accesorios",
  ];

  const categorias = usuarioActual
    ? [...categoriasBase, "Administrar Usuarios", "Administrar Productos", "Administrar Compras"]
    : categoriasBase;
  useEffect(() => {
    const usuarioLS = localStorage.getItem("usuario");
    if (!usuarioLS) return;

    const usuarioObj = JSON.parse(usuarioLS);

    // Llamada al backend para validar
    axios
      .get(`http://localhost:3000/consultarusuario/${usuarioObj.id}`)
      .then((res) => {
        const usuarioDB = res.data;

        if (
          usuarioDB.nombre === usuarioObj.nombre &&
          usuarioDB.apellido === usuarioObj.apellido &&
          usuarioDB.email === usuarioObj.email &&
          usuarioDB.rol === usuarioObj.rol
        ) {
          setUsuarioActual(usuarioDB);
        }
      })
      .catch((err) => console.error("Error al validar usuario:", err));
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim() === "") {
      setSuggestions([]);
    } else {
      // 🔹 Ahora filtramos por el nombre de cada producto
      const filtered = productos
        .filter((item) =>
          item.nombre.toLowerCase().includes(value.toLowerCase())
        )
        .map((item) => item.nombre); // solo dejamos los nombres
      setSuggestions(filtered);
    }
  };

  const handleSelect = (item) => {
    setSearch(item);
    setSuggestions([]);
    onBuscar(item);
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const handleOpenRegistroModal = () => setRegistroAbierto(true);
  const handleCloseRegistroModal = () => {
    setRegistroAbierto(false);
  };

  return (
    <>
      <nav className="navbar-top">
        <img src={logo} alt="SP Instrumentos" className="logo" />

        <div className="search-container" style={{ position: "relative" }}>
          <input
            type="text"
            className="search-input"
            placeholder="Buscar instrumentos, marcas, accesorios..."
            value={search}
            onChange={handleSearchChange}
          />
          <button className="search-button" onClick={() => onBuscar(search)}>
            Buscar
          </button>

          {suggestions.length > 0 && (
            <div className="suggestions-list">
              {suggestions.map((item) => (
                <div
                  key={item}
                  className="suggestion-item"
                  onClick={() => handleSelect(item)}
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="nav-icons">
          <div className="icon cart" onClick={() => setCarritoAbierto(true)}>
            🛒
            {cantidadCarrito > 0 && (
              <span className="cart-badge">{cantidadCarrito}</span>
            )}
          </div>

          {usuarioActual ? (
            <div
              className="icon logout"
              onClick={() => {
                localStorage.removeItem("usuario");
                setUsuarioActual(null);
                navigate("/");
              }}
              aria-label="Cerrar Sesión"
            >
              ➡️
            </div>
          ) : (
            <div
              className="icon user"
              onClick={() => setIsLoginModalOpen(true)}
              aria-label="Iniciar Sesión"
            >
              👤
            </div>
          )}
        </div>

        <div className="nav-links">
          {categorias.map((cat) => (
            <div
              key={cat}
              className="nav-item"
              onClick={() => {
                if (cat === "Administrar Usuarios") {
                  navigate("/usuarios"); // redirecciona
                }
                if (cat === "Administrar Compras") {
                  navigate("/compras"); // redirecciona
                }
                if (cat === "Administrar Productos") {
                  navigate("/productos");
                } else {
                  onCategoriaSeleccionada(cat);
                }
              }}
            >
              {cat}
            </div>
          ))}
        </div>
      </nav>
      <Chart
        abierto={carritoAbierto}
        onCerrar={() => setCarritoAbierto(false)}
        carrito={carrito}
        setCarrito={setCarrito}
        usuarioActual={usuarioActual}
      />

      <Login
        isShowing={isLoginModalOpen}
        hide={handleCloseLoginModal}
        handleOpenRegistroModal={handleOpenRegistroModal}
        onLoginExitoso={(usuarioDB) => setUsuarioActual(usuarioDB)} // <-- nueva prop
      />
      <Registros
        registroAbierto={isRegistroAbierto}
        registroCerrado={handleCloseRegistroModal}
      />
    </>
  );
}
