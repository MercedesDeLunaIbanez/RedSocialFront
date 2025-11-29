import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { apiFetch } from "../api/client";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";

/**
 * Componente que renderiza una publicacion.
 * Si el usuario autenticado es el duenio se muestra la opcion de borrar.
 *
 * @param {object} props - Propiedades para renderizar la publicacion.
 * @param {string} props.id - Identificador de la publicacion.
 * @param {string} props.authorName - Nombre del autor de la publicacion.
 * @param {string} props.text - Texto de la publicacion.
 * @param {string} props.createDate - Fecha de creacion de la publicacion.
 * @returns {JSX.Element} Tarjeta de publicacion.
 */
export default function GetPublication({ id, authorName, text, createDate }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const cardRef = useRef(null);

  const deleteMutation = useMutation({
    /**
     * Elimina la publicacion con el identificador especificado.
     *
     * @returns {Promise<void>} Promesa que resuelve cuando se completa la eliminacion.
     */
    mutationFn: async () => {
      await apiFetch(`/publications/${id}`, { method: "DELETE" });
    },

    /**
     * Invalida queries de publicaciones para refrescar listados tras borrar.
     */
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0]?.includes("publication"),
      });
    },

    /**
     * Muestra un error claro al eliminar la publicacion.
     *
     * @param {Error} error - Error al eliminar.
     */
    onError: (error) => {
      alert(`Error al borrar publicacion: ${error.message}`);
    },
  });

  /**
   * Elimina la publicacion actual si el usuario confirma.
   */
  const handleDelete = () => {
    if (window.confirm("Seguro que quieres borrar esta publicacion?")) {
      deleteMutation.mutate();
    }
  };

  /**
   * Navega al perfil adecuado segun el autor.
   */
  const handleAuthorClick = () => {
    if (user?.username === authorName) navigate("/me");
    else navigate(`/profile/${authorName}`);
  };

  // Animacion de entrada de la tarjeta con GSAP
  useEffect(() => {
    const el = cardRef.current;

    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 90%",
        once: true
      }
    });

    return () => {
      gsap.killTweensOf(el);
    };
  }, []);

  return (
    <div className="publication-card" ref={cardRef}>
      <p className="publication-author">
        <strong className="author-link" onClick={handleAuthorClick}>
          {authorName}
        </strong>{" "}
        - {new Date(createDate).toLocaleString("es-ES", { timeZone: "Europe/Madrid" })}
      </p>

      <p className="publication-text">{text}</p>

      {user?.username === authorName && (
        <button
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
          className="publication-delete-button"
        >
          {deleteMutation.isPending ? "Borrando..." : "Borrar publicacion"}
        </button>
      )}
    </div>
  );
}
