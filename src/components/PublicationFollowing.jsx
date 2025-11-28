import { useInfiniteQuery } from "@tanstack/react-query";
import { apiFetch } from "../api/client";
import GetPublication from "./GetPublication";
import { useEffect, useRef } from "react";

/**
 * Muestra las publicaciones de los usuarios que se está siguiendo.
 * La lista de publicaciones se puede paginar con botones "Anterior" y "Siguiente".
 * Si no hay publicaciones, se muestra un mensaje "No hay publicaciones disponibles.".
 * Si ocurre un error, se muestra un mensaje de error en rojo.
 * La lista se actualiza automáticamente cuando se crea o se borra una publicación.
 * @returns {JSX.Element} Un componente que muestra la lista de publicaciones de los usuarios que se está siguiendo.
 * */
export default function PublicationFollowing() {
  const loadMoreRef = useRef(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error
  } = useInfiniteQuery({
    queryKey: ["publications-following"],
/**
 * Función que se utiliza para obtener las publicaciones de los usuarios que se está siguiendo de forma paginada.
 * La función devuelve un objeto con tres propiedades: content, nextPage y totalPages.
 * content es un array con las publicaciones de la página actual.
 * nextPage es el índice de la página siguiente.
 * totalPages es el número total de páginas que se pueden obtener.
 */
    queryFn: async ({ pageParam = 0 }) => {
      const result = await apiFetch(`/publications/following?page=${pageParam}&size=5`);
      return {
        content: result.content,
        nextPage: result.page + 1,
        totalPages: result.totalPages
      };
    },
    /**
     * Determina qué índice de página cargar a continuación.
     *
     * @param {{ nextPage: number, totalPages: number }} lastPage - Última página recibida.
     * @returns {number|undefined} Índice siguiente o undefined si no hay más datos.
     */
    getNextPageParam: (lastPage) =>
      lastPage.nextPage < lastPage.totalPages ? lastPage.nextPage : undefined
  });

  useEffect(() => {
    if (!hasNextPage) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) fetchNextPage();
    });

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

  if (isLoading) return <p>Cargando publicaciones...</p>;
  if (isError) return <p style={{ color: "red" }}>Error: {error.message}</p>;

  const allItems = data.pages.flatMap((p) => p.content);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Publicaciones de seguidos</h2>

      {allItems.length === 0 && <p>No hay publicaciones disponibles.</p>}

      {allItems
        .slice()
        .sort((a, b) => new Date(b.createDate) - new Date(a.createDate))
        .map((pub) => (
          <GetPublication
            key={pub.id}
            authorName={pub.username}
            text={pub.text}
            createDate={pub.createDate}
          />
        ))}

      <div ref={loadMoreRef} style={{ height: 40 }} />

      {isFetchingNextPage && <p>Cargando más...</p>}
      {!hasNextPage && <p>No hay más publicaciones.</p>}
    </div>
  );
}
