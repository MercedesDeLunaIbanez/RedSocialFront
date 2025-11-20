import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function Header() {
  const { user, logout } = useAuth();
  const logoRef = useRef(null);

  useEffect(() => {
    if (!logoRef.current) return;

    const letters = logoRef.current.querySelectorAll("span");

    gsap.to(letters, {
      color: "#fff",
      textShadow: "0 0 8px #6c63ff, 0 0 15px #9c5eff",
      duration: 1.2,
      repeat: -1,
      yoyo: true,
      stagger: 0.08,
      ease: "sine.inOut",
    });
  }, []);

  return (
    <header>
      {/* Izquierda: nombre de la red con animación */}
      <h2 ref={logoRef} style={{ margin: 0, cursor: "default" }}>
        {Array.from("Nebula").map((letter, index) => (
          <span key={index}>{letter}</span>
        ))}
      </h2>

      {/* Centro: enlaces de navegación */}
      <nav style={{ display: "flex", gap: 20 }}>
        <Link to="/">Inicio</Link>
        <Link to="/all">Todas</Link>
        <Link to="/me">Mi perfil</Link>
      </nav>

      {/* Derecha: usuario logueado + botón logout */}
      <div>
        <span style={{ marginRight: 10 }}>{user?.username ?? "Usuario"}</span>
        <button onClick={logout}>Cerrar sesión</button>
      </div>
    </header>
  );
}
