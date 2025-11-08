import React from "react";
import "./ProductCard.css";

const ProductCard = ({ image, name, price }) => {
  return (
    <div className="product-card">
      <img src={image} alt={name} className="product-image" />
      <h3 className="product-name">{name}</h3>
      <p className="product-price">${price}</p>
      <button className="buy-button">Agregar al carrito</button>
    </div>
  );
};

export default ProductCard;