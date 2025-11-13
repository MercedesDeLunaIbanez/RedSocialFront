import { useAuth } from "../context/useAuth";
import { usePagination } from "../hooks/usePagination";
import GetPublication from "./GetPublication";

/**
 * Muestra una lista de publicaciones del usuario actual.
 * La lista se ordena por fecha de creación (más reciente primero).
 * La lista se puede paginar con botones "Anterior" y "Siguiente".
 * Si no hay publicaciones, se muestra un mensaje "No hay publicaciones disponibles.".
 * Si ocurre un error, se muestra un mensaje de error en rojo.
 * La lista se actualiza automáticamente cuando se crea o se borra una publicación.
 * @returns {JSX.Element} Un componente que muestra la lista de publicaciones del usuario actual.
 */
export default function MyPublication() {
  const { user } = useAuth();
  const { items, page, totalPages, isLoading, isError, error, nextPage, prevPage } =
    usePagination(`/publications/public/${user.username}`, 5); // endpoint y tamaño de página

  // Muestra un mensaje de error si ocurre un error
  if (isLoading) return <p className="loading-text">Cargando publicaciones...</p>;
  if (isError) return <p className="error-text">Error: {error.message}</p>;

  return (
    <div className="publication-container">
      <h2 className="publication-title">
        Publicaciones (página {page + 1} de {totalPages})
      </h2>

      {items.length === 0 && <p className="no-publication">No hay publicaciones disponibles.</p>}

      {items
        .slice() // hacemos copia del array
        .sort((a, b) => new Date(b.createDate) - new Date(a.createDate)) // más reciente primero
        // Muestra las publicaciones
        .map((pub) => (
          <GetPublication
            key={pub.publicationId}
            id={pub.publicationId}
            authorName={pub.username}
            text={pub.text}
            createDate={pub.createDate}
          />
        ))}

      <div className="pagination">
        <button onClick={prevPage} disabled={page === 0} className="pagination-button">
          ← Anterior
        </button>
        <button
          onClick={nextPage}
          disabled={page >= totalPages - 1}
          className="pagination-button"
          style={{ marginLeft: "10px" }}
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}
