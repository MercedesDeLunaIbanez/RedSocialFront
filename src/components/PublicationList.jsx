import { useInfiniteQuery } from "@tanstack/react-query";
import GetPublication from "./GetPublication";
import { apiFetch } from "../api/client";
import { useEffect, useRef } from "react";

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
    // pageParam = 0 (primera página)
    queryFn: async ({ pageParam = 0 }) => {
      // pedimos explícitamente orden por fecha descendente (si tu backend lo soporta)
      const result = await apiFetch(`/publications/?page=${pageParam}&size=5&sort=createDate,desc`);

      // Normaliza el índice de página y totalPages por si la API usa nombres distintos
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
        content: Array.isArray(result.content) ? result.content : result.items ?? [],
        pageIndex,
        totalPages,
      };
    },
    getNextPageParam: (lastPage) => {
      // Si totalPages no se proporciona, permitimos fetch hasta que el servidor devuelva vacío
      if (typeof lastPage.totalPages === "number") {
        return lastPage.pageIndex + 1 < lastPage.totalPages ? lastPage.pageIndex + 1 : undefined;
      }
      // fallback: si la última página vino con contenido, devolvemos next index
      return lastPage.content && lastPage.content.length > 0 ? lastPage.pageIndex + 1 : undefined;
    },
  });

  // === SCROLL INFINITO (IntersectionObserver) ===
  useEffect(() => {
    if (!hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 } // más fiable que 1
    );

    const el = loadMoreRef.current;
    if (el) observer.observe(el);

    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

  if (isLoading) return <p>Cargando publicaciones...</p>;
  if (isError) return <p style={{ color: "red" }}>Error: {error.message}</p>;

  // Junta todas las páginas en el orden que llegaron (no reordenes en cliente)
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

      {/* trigger invisible para cargar más */}
      <div ref={loadMoreRef} style={{ height: "40px" }} />

      {isFetchingNextPage && <p>Cargando más...</p>}
      {!hasNextPage && <p>No hay más publicaciones.</p>}
    </div>
  );
}
