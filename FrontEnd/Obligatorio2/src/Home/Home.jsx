import React, { useState } from "react";
import Navbar from "../NavBar/NavBar";
import Footer from "../Footer/Footer";
import ProductCard from "../Cards/ProductCard";
import logo from "../Img/Logo.png";
import "./Home.css";

const Home = () => {
  // 🔹 Estado de categoría seleccionada
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos");
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  // 🔹 Array de productos
  const productos = [
    // 🎸 Guitarras
    {
      id: 1,
      nombre: "Guitarra Eléctrica Fender Stratocaster",
      precio: 1200,
      descuento: 10,
      categoria: "Guitarras",
      imagen: logo,
    },
    {
      id: 2,
      nombre: "Guitarra Acústica Yamaha F310",
      precio: 450,
      descuento: 5,
      categoria: "Guitarras",
      imagen: logo,
    },
    {
      id: 3,
      nombre: "Guitarra Eléctrica Gibson Les Paul",
      precio: 1800,
      descuento: 15,
      categoria: "Guitarras",
      imagen: logo,
    },

    // 🎸 Bajos
    {
      id: 4,
      nombre: "Bajo Fender Precision Bass",
      precio: 1400,
      descuento: 10,
      categoria: "Bajos",
      imagen: logo,
    },
    {
      id: 5,
      nombre: "Bajo Ibanez SR300E",
      precio: 850,
      descuento: 7,
      categoria: "Bajos",
      imagen: logo,
    },
    {
      id: 6,
      nombre: "Bajo Yamaha TRBX174",
      precio: 600,
      descuento: 5,
      categoria: "Bajos",
      imagen: logo,
    },

    // 🥁 Baterías
    {
      id: 7,
      nombre: "Batería Yamaha Stage Custom",
      precio: 2500,
      descuento: 20,
      categoria: "Baterías",
      imagen: logo,
    },
    {
      id: 8,
      nombre: "Batería Electrónica Roland TD-07KV",
      precio: 1800,
      descuento: 10,
      categoria: "Baterías",
      imagen: logo,
    },
    {
      id: 9,
      nombre: "Batería Pearl Roadshow",
      precio: 1100,
      descuento: 8,
      categoria: "Baterías",
      imagen: logo,
    },

    // 🎹 Teclados
    {
      id: 10,
      nombre: "Teclado Roland GO:KEYS",
      precio: 700,
      descuento: 5,
      categoria: "Teclados",
      imagen: logo,
    },
    {
      id: 11,
      nombre: "Teclado Yamaha PSR-E373",
      precio: 600,
      descuento: 10,
      categoria: "Teclados",
      imagen: logo,
    },
    {
      id: 12,
      nombre: "Teclado Casio Privia PX-S1100",
      precio: 900,
      descuento: 12,
      categoria: "Teclados",
      imagen: logo,
    },

    // 🎧 Accesorios
    {
      id: 13,
      nombre: "Pedal de distorsión Boss DS-1",
      precio: 120,
      descuento: 10,
      categoria: "Accesorios",
      imagen: logo,
    },
    {
      id: 14,
      nombre: "Auriculares Audio-Technica ATH-M50X",
      precio: 180,
      descuento: 15,
      categoria: "Accesorios",
      imagen: logo,
    },
    {
      id: 15,
      nombre: "Cable de Instrumento Planet Waves",
      precio: 35,
      descuento: 5,
      categoria: "Accesorios",
      imagen: logo,
    },
    {
      id: 16,
      nombre: "Soporte para Guitarra Hercules GS414B",
      precio: 65,
      descuento: 8,
      categoria: "Accesorios",
      imagen: logo,
    },
  ];

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
        Ï
        productos={productos} 
      />

      <main className="home-main">
        <h1>Tienda Online</h1>

        <div className="product-grid">
          {productosFiltrados.map((producto) => (
            <ProductCard
              key={producto.id}
              image={producto.imagen}
              name={producto.nombre}
              price={producto.precio}
            />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
