import React, { useState } from "react";
import "./Chart.css";


const Chart = ({ carrito = [], setCarrito, abierto, onCerrar }) => {
  const [metodoEnvio, setMetodoEnvio] = useState("retiro");

  const eliminarDelCarrito = (id) => {
    setCarrito((prev) => prev.filter((item) => item.id !== id));
  };

  const vaciarCarrito = () => {
    setCarrito([]);
  };

  const totalCarrito = carrito?.reduce(
    (total, item) => total + item.precio * item.cantidad,
    0
  );

  const finalizarCompra = () => {
    alert(
      `Compra finalizada. Método de entrega: ${
        metodoEnvio === "retiro" ? "Retiro en local" : "Envío a domicilio"
      }. Total: $${totalCarrito.toFixed(2)}`
    );
    vaciarCarrito();
    onCerrar();
  };

  if (!abierto) return null;

  return (
    <div className="modal-carrito">
      <div className="carrito-contenido animado">
        <button className="btn-cerrar-superior" onClick={onCerrar}>
          ❌
        </button>

        <h2>Tu Carrito</h2>

        {carrito.length === 0 ? (
          <p className="carrito-vacio">El carrito está vacío.</p>
        ) : (
          <div className="carrito-grid">
            {/* Columna izquierda */}
            <div className="columna-productos">
              <ul className="lista-carrito">
                {carrito.map((item) => (
                  <li key={item.id} className="item-carrito">
                    <img
                      src={`http://localhost:3000${item.imagen}`}
                      alt={item.nombre}
                      className="item-imagen"
                    />
                    <div className="item-info">
                      <span className="item-nombre">{item.nombre}</span>
                      <span className="item-detalle">
                        Cantidad: {item.cantidad}
                      </span>
                      <span className="item-precio">
                        ${(item.precio * item.cantidad).toFixed(2)}
                      </span>
                    </div>
                    <button
                      onClick={() => eliminarDelCarrito(item.id)}
                      className="btn-eliminar"
                    >
                      ❌
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Columna derecha */}
            <div className="columna-resumen">
              <div className="resumen-total">
                <h3>Total: ${totalCarrito.toFixed(2)}</h3>
              </div>

              <div className="metodo-envio">
                <h4>Método de entrega</h4>
                <label>
                  <input
                    type="radio"
                    value="retiro"
                    checked={metodoEnvio === "retiro"}
                    onChange={(e) => setMetodoEnvio(e.target.value)}
                  />
                  Retiro en local
                </label>
                <label>
                  <input
                    type="radio"
                    value="envio"
                    checked={metodoEnvio === "envio"}
                    onChange={(e) => setMetodoEnvio(e.target.value)}
                  />
                  Envío a domicilio
                </label>
              </div>

              <div className="acciones-carrito">
                <button onClick={vaciarCarrito} className="btn-vaciar">
                  Vaciar carrito
                </button>
                <button onClick={finalizarCompra} className="btn-finalizar">
                  Finalizar compra
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chart;