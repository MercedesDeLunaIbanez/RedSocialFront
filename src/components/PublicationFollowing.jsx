import { useInfiniteQuery } from "@tanstack/react-query";
import { apiFetch } from "../api/client";
import GetPublication from "./GetPublication";
import { useEffect, useRef } from "react";

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
    queryFn: async ({ pageParam = 0 }) => {
      const result = await apiFetch(`/publications/following?page=${pageParam}&size=5`);
      return {
        content: result.content,
        nextPage: result.page + 1,
        totalPages: result.totalPages
      };
    },
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
