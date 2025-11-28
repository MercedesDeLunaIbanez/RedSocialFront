import { useEffect, useRef } from "react";
import gsap from "gsap";


/**
 * Componente que muestra el nombre de la red "Nebula" con animación.
 * 
 * @returns {JSX.Element} Componente de nombre de la red con animación.
 */

export default function LoginLogo() {
  const logoRef = useRef(null);

  useEffect(() => {
    const letters = logoRef.current.querySelectorAll("span");

    // Animación de entrada
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
   * Animación de la letra "N" en el nombre de la red "Nebula".
   * Se encarga de hacer una animación de texto con efecto de neón.
   * La animación se repite indefinidamente.
   * 
   * @param {Element[]} letters - Elementos span que contienen las letras de la red "Nebula".
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
        <span key={index}>{letter}</span> // Muestra cada letra con un span
      ))}
    </h1>
  );
}
