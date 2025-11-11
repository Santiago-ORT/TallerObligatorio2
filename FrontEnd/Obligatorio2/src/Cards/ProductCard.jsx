import React from "react";
import "./ProductCard.css";
import { useState } from "react";

const ProductCard = ({ id, imagen, nombre, precio, agregarAlCarrito }) => {
  const [agregado, setAgregado] = useState(false);

  const handleAgregar = () => {
    agregarAlCarrito({ id, imagen, nombre, precio });
    setAgregado(true);
    setTimeout(() => setAgregado(false), 1200); 
  };

  return (
    <div className="product-card">
      <img src={`http://localhost:3000${imagen}`} alt={nombre} className="product-image" />
      <h3 className="product-name">{nombre}</h3>
      <p className="product-price">${precio}</p>
      <button
        className={`buy-button ${agregado ? "added" : ""}`}
        onClick={handleAgregar}
        disabled={agregado}
      >
        {agregado ? "✔ Agregado" : "Agregar al carrito"}
      </button>
    </div>
  );
};

export default ProductCard;