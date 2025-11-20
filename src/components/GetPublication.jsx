import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { apiFetch } from "../api/client";

/**
 * Muestra una publicación en una caja con bordes redondeadas y padding.
 * El autor de la publicación puede borrarla.
 *
 * @param {number} id - Identificador de la publicación.
 * @param {string} authorName - Nombre del autor de la publicación.
 * @param {string} text - Texto de la publicación.
 * @param {Date} createDate - Fecha de creación de la publicación.
 */
export default function GetPublication({ id, authorName, text, createDate }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Configuramos la mutación DELETE
  const deleteMutation = useMutation({
    /**
     * Función que borra la publicación con el ID proporcionado.
     * Se utiliza en la mutación DELETE de la publicación.
     * @returns {Promise<void>} Promesa que se resuelve cuando se completa la petición.
     */
    mutationFn: async () => {
      await apiFetch(`/publications/${id}`, { method: "DELETE" });
    },

    /**
     * Función que se ejecuta cuando se completa la mutación con éxito.
     * Invalida el listado de publicaciones para refrescarlo.
     */
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0]?.includes("/publications"),
      });
    },

    /**
     * Función que se ejecuta cuando ocurre un error al borrar la publicación.
     * Muestra un mensaje de alerta con el mensaje de error.
     * @param {Error} error - Error que ocurre al borrar la publicación.
     */
    onError: (error) => {
      alert(`Error al borrar publicación: ${error.message}`);
    },
  });


  // Handler para el click
  const handleDelete = () => {
    if (window.confirm("¿Seguro que quieres borrar esta publicación?")) {
      deleteMutation.mutate();
    }
  };

  const handleAuthorClick = () => {
    // Comprueba si el autor de la publicación es el usuario logueado
    if (user?.username === authorName) {
      navigate("/me"); // Si es, navega a /me
    } else {
      navigate(`/profile/${authorName}`); // Si no, navega al perfil público
  }
};


  return (
    <div className="publication-card">
      <p className="publication-author">
        <strong
          className="author-link"
          onClick={handleAuthorClick}
        >
          {authorName}
        </strong>{" "}
        — {new Date(createDate).toLocaleString("es-ES", { timeZone: "Europe/Madrid" })}
      </p>

      <p className="publication-text">{text}</p>

      {/* Solo el autor puede borrar */}
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
