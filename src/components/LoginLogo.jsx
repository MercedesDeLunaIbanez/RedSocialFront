import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Logotipo animado usado en las pantallas de autenticacion.
 *
 * @returns {JSX.Element} Titulo animado con el nombre de la red.
 */
export default function LoginLogo() {
  const logoRef = useRef(null);

  useEffect(() => {
    const letters = logoRef.current.querySelectorAll("span");

    // Animacion de entrada
    gsap.fromTo(
      letters,
      { y: -50, opacity: 0, color: "#6c63ff", textShadow: "0 0 0px #6c63ff" },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.7)",
        onComplete: () => animateNeon(),
      }
    );

    /**
     * Activa un brillo tipo neon oscilante sobre cada letra.
     */
    function animateNeon() {
      gsap.to(letters, {
        textShadow: "0 0 10px #6c63ff, 0 0 20px #9c5eff, 0 0 30px #6cffb8",
        color: "#fff",
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        stagger: 0.1,
        ease: "sine.inOut",
      });
    }
  }, []);

  return (
    <h1 className="login-logo" ref={logoRef}>
      {Array.from("Nebula").map((letter, index) => (
        <span key={index}>{letter}</span>
      ))}
    </h1>
  );
}
