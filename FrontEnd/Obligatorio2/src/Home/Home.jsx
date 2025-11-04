import React from 'react'
import Navbar from '../NavBar/NavBar'
import Footer from '../Footer/Footer'
import './Home.css'

const Home = () => {
  return (
  <div className="home-container">
      <Navbar />

      <main className="home-main">
        <h1>Tienda Online</h1>

        <div className="product-grid">
          {/* Próximamente reemplazás con <ProductCard /> */}
          <div className="placeholder-card"></div>
          <div className="placeholder-card"></div>
          <div className="placeholder-card"></div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Home
