import { useInfiniteQuery } from "@tanstack/react-query";
import GetPublication from "./GetPublication";
import { apiFetch } from "../api/client";
import { useEffect, useRef } from "react";

/**
 * Lista de publicaciones con scroll infinito.
 * Obtiene entradas paginadas de la API y las concatena en el cliente.
 * Usa un marcador invisible para disparar la carga de la siguiente pagina.
 *
 * @returns {JSX.Element} Contenedor con publicaciones publicas.
 */
export default function PublicationList() {
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
    queryKey: ["publications"],
    /**
     * Recupera una pagina de publicaciones.
     *
     * @param {{ pageParam?: number }} params - Paginacion que entrega React Query.
     * @returns {{content: Array, pageIndex: number, totalPages: number|undefined}} Datos normalizados de la pagina.
     */
    queryFn: async ({ pageParam = 0 }) => {
      const result = await apiFetch(
        `/publications/?page=${pageParam}&size=5&sort=createDate,desc`
      );

      const pageIndex =
        result.page ??
        result.number ??
        result.pageNumber ??
        (typeof result.pageIndex === "number" ? result.pageIndex : 0);

      const totalPages =
        result.totalPages ??
        result.total_pages ??
        result.total ??
        (typeof result.totalPages === "number" ? result.totalPages : undefined);

      return {
        content: Array.isArray(result.content)
          ? result.content
          : result.items ?? [],
        pageIndex,
        totalPages,
      };
    },
    /**
     * Calcula el indice de la siguiente pagina en base a la respuesta previa.
     *
     * @param {{ pageIndex: number, totalPages?: number, content: Array }} lastPage - Ultima pagina recibida.
     * @returns {number|undefined} Indice de la siguiente pagina o undefined si no hay mas.
     */
    getNextPageParam: (lastPage) => {
      if (typeof lastPage.totalPages === "number") {
        return lastPage.pageIndex + 1 < lastPage.totalPages
          ? lastPage.pageIndex + 1
          : undefined;
      }
      return lastPage.content && lastPage.content.length > 0
        ? lastPage.pageIndex + 1
        : undefined;
    },
  });

  useEffect(() => {
    if (!hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );

    const el = loadMoreRef.current;
    if (el) observer.observe(el);

    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

  if (isLoading) return <p>Cargando publicaciones...</p>;
  if (isError) return <p style={{ color: "red" }}>Error: {error.message}</p>;

  const allItems = data?.pages.flatMap((p) => p.content) ?? [];

  return (
    <div style={{ padding: "20px" }}>
      <h2>Publicaciones</h2>

      {allItems.length === 0 && <p>No hay publicaciones disponibles.</p>}

      {allItems.map((pub) => (
        <GetPublication
          key={pub.publicationId ?? pub.id}
          id={pub.publicationId ?? pub.id}
          authorName={pub.username}
          text={pub.text}
          createDate={pub.createDate}
        />
      ))}

      {/* trigger invisible para cargar mas */}
      <div ref={loadMoreRef} style={{ height: "40px" }} />

      {isFetchingNextPage && <p>Cargando mas...</p>}
      {!hasNextPage && <p>No hay mas publicaciones.</p>}
    </div>
  );
}
