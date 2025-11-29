import { useInfiniteQuery } from "@tanstack/react-query";
import { apiFetch } from "../api/client";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import GetPublication from "./GetPublication";

/**
 * Muestra las publicaciones de un usuario concreto con scroll infinito.
 *
 * @returns {JSX.Element} Contenedor con las publicaciones publicas del perfil.
 */
export default function ProfilePublication() {
  const { name } = useParams();
  const loadMoreRef = useRef(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["publications-profile", name],
    /**
     * Obtiene una pagina de publicaciones del usuario.
     *
     * @param {{ pageParam?: number }} params - Parametros de paginacion de React Query.
     * @returns {{content: Array, pageIndex: number, totalPages: number}} Datos normalizados de la pagina.
     */
    queryFn: async ({ pageParam = 0 }) => {
      const result = await apiFetch(
        `/publications/public/${name}?page=${pageParam}&size=5&sort=createDate,desc`
      );

      const pageIndex = result.page ?? result.number ?? 0;
      const totalPages = result.totalPages ?? result.total_pages ?? 1;
      const content = Array.isArray(result.content)
        ? result.content
        : result.items ?? [];

      return { content, pageIndex, totalPages };
    },
    /**
     * Calcula la siguiente pagina a pedir, si existe.
     *
     * @param {{ pageIndex: number, totalPages: number }} lastPage - Ultima pagina recibida.
     * @returns {number|undefined} Indice de la siguiente pagina o undefined si no hay mas.
     */
    getNextPageParam: (lastPage) =>
      lastPage.pageIndex + 1 < lastPage.totalPages
        ? lastPage.pageIndex + 1
        : undefined,
  });

  useEffect(() => {
    if (!hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchNextPage();
      },
      { threshold: 0.5 }
    );

    const el = loadMoreRef.current;
    if (el) observer.observe(el);

    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

  if (isLoading) return <p className="loading-text">Cargando publicaciones...</p>;
  if (isError) return <p className="error-text">Error: {error.message}</p>;

  const allItems = data?.pages.flatMap((p) => p.content) ?? [];

  return (
    <div className="publication-container">
      <h2 className="publication-title">Publicaciones</h2>

      {allItems.length === 0 && (
        <p className="no-publication">No hay publicaciones disponibles.</p>
      )}

      {allItems.map((pub) => (
        <GetPublication
          key={pub.id ?? pub.publicationId}
          id={pub.id ?? pub.publicationId}
          authorName={pub.username}
          text={pub.text}
          createDate={pub.createDate}
        />
      ))}

      <div ref={loadMoreRef} style={{ height: 40 }} />

      {isFetchingNextPage && <p className="loading-text">Cargando mas...</p>}
      {!hasNextPage && <p className="loading-text">No hay mas publicaciones</p>}
    </div>
  );
}
