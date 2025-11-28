import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { apiFetch } from "../api/client";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";


/**
 * Componente que renderiza una publicación.
 * Recibe como props el identificador de la publicación, el nombre del autor, el texto de la publicación y la fecha de creación.
 * Si el usuario autenticado es el dueño de la publicación, se muestra un botón para borrar la publicación.
 * La publicación se anima con GSAP cuando se hace scroll hasta ella.
 * @param {Object} props - Propiedades para renderizar la publicación.
 * @param {string} props.id - Identificador de la publicación.
 * @param {string} props.authorName - Nombre del autor de la publicación.
 * @param {string} props.text - Texto de la publicación.
 * @param {string} props.createDate - Fecha de creación de la publicación.
 */
export default function GetPublication({ id, authorName, text, createDate }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const cardRef = useRef(null);

  
  const deleteMutation = useMutation({
    /**
     * Elimina la publicación con el identificador especificado.
     * Se utiliza fetch con el método DELETE para borrar la publicación.
     * @returns {Promise<void>} Promesa que resuelve cuando se completa la eliminación.
     */
    mutationFn: async () => {
      await apiFetch(`/publications/${id}`, { method: "DELETE" });
    },

    
    /**
     * Se llama cuando se completa la eliminación de la publicación.
     * Invalida todas las queries que contengan "/publications" en su queryKey, para que se refresquen automáticamente.
     */
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0]?.includes("/publications"),
      });
    },

    
  /**
   * Se llama cuando ocurre un error al eliminar la publicación.
   * Muestra un mensaje de alerta con el mensaje de error.
   * @param {Error} error - Error que ocurrió al eliminar la publicación.
   */
    onError: (error) => {
      alert(`Error al borrar publicación: ${error.message}`);
    },
  });

  
  /**
   * Elimina la publicación actual si se confirma.
   * Se muestra un diálogo de confirmación con el mensaje "¿Seguro que quieres borrar esta publicación?".
   * Si se confirma, se llama a deleteMutation.mutate() para eliminar la publicación.
   */
  const handleDelete = () => {
    if (window.confirm("¿Seguro que quieres borrar esta publicación?")) {
      deleteMutation.mutate();
    }
  };

  
  /**
   * Función que se llama cuando se hace click en el nombre del autor de la publicación.
   * Redirige a la página de perfil del usuario autenticado si el nombre del autor coincide con el nombre del usuario autenticado.
   * De lo contrario, redirige a la página de perfil del usuario cuyo nombre coincide con el nombre del autor.
   */
  const handleAuthorClick = () => {
    if (user?.username === authorName) navigate("/me");
    else navigate(`/profile/${authorName}`);
  };

  // --- ANIMACIÓN GSAP + ScrollTrigger + CLEANUP ---
  useEffect(() => {
    const el = cardRef.current;

    // Animación de entrada
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

    // Cleanup para evitar animaciones duplicadas
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
        — {new Date(createDate).toLocaleString("es-ES", { timeZone: "Europe/Madrid" })}
      </p>

      <p className="publication-text">{text}</p>

      {user?.username === authorName && (
        <button
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
          className="publication-delete-button"
        >
          {deleteMutation.isPending ? "Borrando..." : "Borrar publicación"}
        </button>
      )}
    </div>
  );
}
