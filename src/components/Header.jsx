import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";


/**
 * Componente que representa la barra de navegación
 * de la aplicación.
 * Muestra el nombre de la red, enlaces de navegación y
 * el usuario logueado con un botón para cerrar sesión.
 *
 * @returns {JSX.Element} Un JSX Element que representa la barra de navegación.
 */
export default function Header() {
  const { user, logout } = useAuth();


  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        borderBottom: "1px solid #ccc",
      }}
    >
      {/* Izquierda: nombre de la red */}
      <h2 style={{ margin: 0 }}>Nebula</h2>


      {/* Centro: enlaces de navegación */}
      <nav style={{ display: "flex", gap: 20 }}>
        <Link to="/">Inicio</Link>
        <Link to="/all">Todas</Link>
        <Link to="/me">Mi perfil</Link>
      </nav>


      {/* Derecha: usuario logueado + botón logout */}
      <div>
        <span style={{ marginRight: 10 }}>
          {user?.username ?? "Usuario"}
        </span>
        <button onClick={logout}>Cerrar sesión</button>
      </div>
    </header>
  );
}
