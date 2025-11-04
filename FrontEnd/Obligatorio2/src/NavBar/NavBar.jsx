import './NavBar.css'
import logo from '../Img/Logo.png'
export default function Navbar() {
  return (
    <>
      {/* Top bar */}
      <nav className="navbar-top">
        <img src={logo} alt="SP Instrumentos" className="logo" />

        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Buscar instrumentos, marcas, accesorios..."
          />
          <button className="search-button">Buscar</button>
        </div>

        <div className="nav-icons">
          <div className="icon cart">
            🛒
            <span className="cart-badge">0</span>
          </div>
          <div className="icon user">
            👤
          </div>
        </div>
      </nav>

      {/* Bottom bar */}
      <nav className="navbar-bottom">
        <div className="nav-links">
          <div className="nav-item">Guitarras</div>
          <div className="nav-item">Bajos</div>
          <div className="nav-item">Baterías</div>
          <div className="nav-item">Teclados</div>
          <div className="nav-item">Accesorios</div>
        </div>

        <div className="contact-info">
          <span>📞 099 123 456</span>
          <span>✉️ contacto@spinstrumentos.com</span>
        </div>
      </nav>
    </>
  );
}