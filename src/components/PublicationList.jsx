import { usePagination } from "../hooks/usePagination";
import GetPublication from "./GetPublication";

/**
 * Muestra una lista de todas las publicaciones con paginación.
 * La lista se ordena por fecha de creación (más reciente primero).
 * La lista se puede paginar con botones "Anterior" y "Siguiente".
 * Si no hay publicaciones, se muestra un mensaje "No hay publicaciones disponibles.".
 * Si ocurre un error, se muestra un mensaje de error en rojo.
 * La lista se actualiza automáticamente cuando se crea o se borra una publicación.
 * @returns {JSX.Element} Un componente que muestra la lista de publicaciones con paginación.
*/
export default function PublicationList() {
  const { items, page, totalPages, isLoading, isError, error, nextPage, prevPage } =
    usePagination("/publications/", 5); // endpoint y tamaño de página

  if (isLoading) return <p>Cargando publicaciones...</p>;
  if (isError) return <p style={{ color: "red" }}>Error: {error.message}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Publicaciones (página {page + 1} de {totalPages})</h2>

      {items.length === 0 && <p>No hay publicaciones disponibles.</p>}

      {items
      .slice() // hacemos copia del array
      .sort((a, b) => new Date(b.createDate) - new Date(a.createDate)) // más reciente primero
      .map((pub) => (
        <GetPublication
          key={pub.publicationId}
          id={pub.publicationId}
          authorName={pub.username}
          text={pub.text}
          createDate={pub.createDate}
        />
        )
       
      )}

      <div style={{ marginTop: "20px" }}>
        <button onClick={prevPage} disabled={page === 0}>
          ← Anterior
        </button>
        <button onClick={nextPage} disabled={page >= totalPages - 1} style={{ marginLeft: "10px" }}>
          Siguiente →
        </button>
      </div>
    </div>
  );
}
