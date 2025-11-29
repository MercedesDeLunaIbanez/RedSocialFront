import { useInfiniteQuery } from "@tanstack/react-query";
import { apiFetch } from "../api/client";
import GetPublication from "./GetPublication";
import { useEffect, useRef } from "react";

/**
 * Muestra las publicaciones de los usuarios que se siguen, con scroll infinito.
 *
 * @returns {JSX.Element} Listado de publicaciones de seguidos.
 */
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
     * Recupera las publicaciones de usuarios seguidos de forma paginada.
     *
     * @param {{ pageParam?: number }} params - Parametros de React Query.
     * @returns {{content: Array, nextPage: number, totalPages: number}} Pagina normalizada.
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
     * Determina que pagina cargar a continuacion.
     *
     * @param {{ nextPage: number, totalPages: number }} lastPage - Ultima pagina recibida.
     * @returns {number|undefined} Siguiente pagina o undefined si no hay mas datos.
     */
    getNextPageParam: (lastPage) =>
      lastPage.nextPage < lastPage.totalPages ? lastPage.nextPage : undefined
  });

  /* Dispara la carga de la siguiente pagina si existe */
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

      {isFetchingNextPage && <p>Cargando mas...</p>}
      {!hasNextPage && <p>No hay mas publicaciones.</p>}
    </div>
  );
}
