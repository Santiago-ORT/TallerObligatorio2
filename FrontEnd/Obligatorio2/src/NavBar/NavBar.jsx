import React, { useState } from "react";
import "./NavBar.css";
import Chart from "../Chart/Chart";
import logo from "../Img/Logo.png";
import Login from "../Usuarios/Login";
import Registros from "../Usuarios/Registros";

export default function Navbar({
  onCategoriaSeleccionada,
  onBuscar,
  productos,
  cantidadCarrito,
  carrito,
  setCarrito,
}) {
  const categorias = [
    "Todos",
    "Guitarras",
    "Bajos",
    "Baterías",
    "Teclados",
    "Accesorios",
  ];

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegistroAbierto, setRegistroAbierto] = useState(false);

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

          <div
            className="icon user"
            onClick={() => setIsLoginModalOpen(true)}
            aria-label="Iniciar Sesión"
          >
            👤
          </div>
        </div>

        <div className="nav-links">
          {categorias.map((cat) => (
            <div
              key={cat}
              className="nav-item"
              onClick={() => onCategoriaSeleccionada(cat)}
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
      />

      <Login
        isShowing={isLoginModalOpen}
        hide={handleCloseLoginModal}
        handleOpenRegistroModal={handleOpenRegistroModal}
      />
      <Registros
        registroAbierto={isRegistroAbierto}
        registroCerrado={handleCloseRegistroModal}
      />
    </>
  );
}
