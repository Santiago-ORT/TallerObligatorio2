import React, { useState, useEffect } from "react";
import Navbar from "../NavBar/NavBar";
import Footer from "../Footer/Footer";
import ProductCard from "../Cards/ProductCard";
import Chart from "../Chart/Chart";
import logo from "../Img/Logo.png";
import axios from "axios";
import "./Home.css";

const Home = () => {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos");
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [carrito, setCarrito] = useState([]);
  const [productos, setProductos] = useState([]);

  // Aca hago todo lo necesario para el carrito
  useEffect(() => {
    const carritoGuardado = JSON.parse(localStorage.getItem("carrito")) || [];
    setCarrito(carritoGuardado);
  }, []);
  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);
  const agregarAlCarrito = (producto) => {
    setCarrito((prev) => {
      const existe = prev.find((item) => item.id === producto.id);
      if (existe) {
        return prev.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: (item.cantidad || 1) + 1 }
            : item
        );
      } else {
        return [...prev, { ...producto, cantidad: 1 }];
      }
    });
  };
  useEffect(() => {
    axios
      .get("http://localhost:3000/productos")
      .then((res) => setProductos(res.data))
      .catch((err) => console.error("Error al obtener productos:", err));
  }, []);

  const productosFiltrados = productos.filter((p) => {
    if (terminoBusqueda.trim() !== "") {
      return p.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase());
    } else {
      return (
        categoriaSeleccionada === "Todos" ||
        p.categoria === categoriaSeleccionada
      );
    }
  });

  return (
    <div className="home-container">
      <Navbar
        onCategoriaSeleccionada={(categoria) => {
          setCategoriaSeleccionada(categoria);
          setTerminoBusqueda("");
        }}
        onBuscar={setTerminoBusqueda}
        productos={productos}
        cantidadCarrito={carrito.length}
        carrito={carrito}
        setCarrito={setCarrito}
      />

      <main className="home-main">
        <div className="product-grid">
          {productosFiltrados.map((producto) => (
            <ProductCard
              key={producto.id}
              id={producto.id}
              imagen={producto.imagen}
              nombre={producto.nombre}
              precio={producto.precio}
              agregarAlCarrito={agregarAlCarrito}
            />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
