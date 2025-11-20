import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { apiFetch } from "../api/client";
import { useQueryClient } from "@tanstack/react-query";

/**
 * Componente para crear una nueva publicación.
 * 
 * @returns {JSX.Element} Un formulario para crear una nueva publicación.
 */
export default function CreatePublication() {  
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const queryClient = useQueryClient(); 

  // Comprobamos si el usuario esta logueado
  if (!user) {
    return <p className="error-text">Debes estar logueado para crear una publicación.</p>;
  }

  /**
   * Función para manejar el envío del formulario de creación de publicación.
   * 
   * Comprueba que el texto no esté vacío, y si es así, muestra un mensaje de error.
   * Si el texto es válido, envía una petición POST a la API para crear una nueva publicación.
   * Después de la petición, invalida la caché de la lista de publicaciones para que se vuelva a recargar.
   * Si ocurre un error, muestra un mensaje de error.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim()) {
      setError("La publicación no puede estar vacía.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await apiFetch("/publications/", {
        method: "POST",
        body: JSON.stringify({ text }),
      });

      setText("");

      // recarga automática de la lista
      queryClient.invalidateQueries(["/publications/"]);

    } catch (err) {
      setError(err.message || "Error al crear la publicación.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-publication-card">
      <h3 className="create-publication-title">Crea una nueva publicación</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="¿Qué estás pensando?"
          rows={4}
          className="create-publication-textarea"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="create-publication-button"
        >
          {isSubmitting ? "Publicando..." : "Publicar"}
        </button>
      </form>
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}
