import React, { useState } from "react";
import "./Chart.css";
import Swal from "sweetalert2";
import axios from "axios";

const Chart = ({
  carrito = [],
  setCarrito,
  abierto,
  onCerrar,
  usuarioActual,
}) => {
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

  const finalizarCompra = async () => {
  if (!usuarioActual) {
    Swal.fire({
      icon: "warning",
      title: "Debes iniciar sesión",
      text: "Inicia sesión para poder realizar la compra",
      confirmButtonText: "Aceptar",
    });
    return;
  }

  try {
    // Por cada producto en el carrito, hacemos un POST individual
    for (const item of carrito) {
      const compra = {
        IdProducto: item.id,
        FechaCompra: new Date().toISOString(),
        EstadoCompra: "Pendiente",
        IdCliente: usuarioActual.id,
        Envio: metodoEnvio === "retiro" ? "Retiro en local" : "Envío a domicilio",
        Cantidad: item.cantidad,
      };

      await axios.post("http://localhost:3000/crearcompra", compra);
    }

    Swal.fire({
      icon: "success",
      title: "Compra finalizada",
      text: `Total: $${totalCarrito.toFixed(2)}`,
      confirmButtonText: "Aceptar",
    });

    vaciarCarrito();
    onCerrar();
  } catch (err) {
    console.error("Error al crear la compra:", err);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudo registrar la compra.",
      confirmButtonText: "Aceptar",
    });
  }
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
