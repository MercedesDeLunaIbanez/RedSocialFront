import { useAuth } from "../hooks/useAuth";
import { apiFetch } from "../api/client";
import GetPublication from "./GetPublication";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

/**
 * Muestra las publicaciones de un usuario.
 * Se utiliza para mostrar las publicaciones de un usuario en su perfil.
 * Utiliza useInfiniteQuery para obtener las publicaciones de forma paginada.
 * El componente se renderiza con un contenedor que contiene un título y las publicaciones.
 * Cada publicación se renderiza con el componente GetPublication.
 * Se muestra un mensaje de carga mientras se cargan las publicaciones.
 * Si no hay publicaciones, se muestra un mensaje indicando que no hay publicaciones.
 * Se puede scrollear infinitamente.
 * @returns {JSX.Element} Un contenedor con las publicaciones del usuario.
 */
export default function MyPublication() {
  const { user } = useAuth();
  const loadMoreRef = useRef(null);
  const containerRef = useRef(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["my-publications", user?.username],
    
/**
 * Función que se utiliza para obtener las publicaciones de un usuario de forma paginada.
 * Se utiliza como queryFn para useInfiniteQuery.
 * La función devuelve un objeto con tres propiedades: content, pageIndex y totalPages.
 * content es un array con las publicaciones de la página actual.
 * pageIndex es el índice de la página actual.
 * totalPages es el número total de páginas que se pueden obtener.
 */
    queryFn: async ({ pageParam = 0 }) => {
      const result = await apiFetch(
        `/publications/public/${user.username}?page=${pageParam}&size=5&sort=createDate,desc`
      );

      const pageIndex = result.page ?? result.number ?? 0;
      const totalPages = result.totalPages ?? result.total_pages ?? 1;
      const content = Array.isArray(result.content) ? result.content : [];

      return { content, pageIndex, totalPages };
    },

    
/**
 * Función que se utiliza para determinar si hay una página siguiente.
 * Se utiliza para determinar si se debe fetch la siguiente página.
 * La función devuelve el índice de la siguiente página si hay una, o undefined si no hay.
 * @param {Object} lastPage - El objeto con la información de la última página obtenida.
 * @returns {number|undefined} El índice de la siguiente página, o undefined si no hay.
 */
    getNextPageParam: (lastPage) =>
      lastPage.pageIndex + 1 < lastPage.totalPages
        ? lastPage.pageIndex + 1
        : undefined,
    enabled: !!user?.username,
  });

  // Scroll infinito
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

  // Fade-in desde el contenedor
  useEffect(() => {
    if (!containerRef.current) return;
    const nodes = containerRef.current.querySelectorAll(".publication-card");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    nodes.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, [data]); // se ejecuta cada vez que llegan nuevas publicaciones

  if (!user) return <p className="loading-text">Cargando usuario...</p>;
  if (isLoading) return <p className="loading-text">Cargando publicaciones...</p>;
  if (isError) return <p className="error-text">Error: {error.message}</p>;

  const allItems = data?.pages.flatMap((p) => p.content) ?? [];

  return (
    <div className="publication-container" ref={containerRef}>
      <h2 className="publication-title">Mis publicaciones</h2>

      {allItems.length === 0 && <p className="no-publication">No hay publicaciones disponibles.</p>}

      {allItems.map((pub) => (
        <GetPublication
          key={pub.publicationId ?? pub.id}
          id={pub.publicationId ?? pub.id}
          authorName={pub.username}
          text={pub.text}
          createDate={pub.createDate}
        />
      ))}

      {/* Trigger invisible */}
      <div ref={loadMoreRef} style={{ height: 40 }} />

      {isFetchingNextPage && <p className="loading-text">Cargando más...</p>}
      {!hasNextPage && <p className="loading-text">No hay más publicaciones</p>}
    </div>
  );
}
