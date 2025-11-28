// src/hooks/usePagination.js
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../api/client";

/**
 * Hook de paginación simple contra la API.
 *
 * @param {string} endpoint - Ruta de la API que admite query params page/size/sort.
 * @param {number} [pageSize=5] - Número de elementos por página.
 * @returns {{items: Array, page: number, totalPages: number, isLoading: boolean, isError: boolean, error: Error|null, nextPage: Function, prevPage: Function}} Estado y acciones de paginación.
 */
export function usePagination(endpoint, pageSize = 5) {
  const [page, setPage] = useState(0);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [endpoint, page],
    // Concatenación simple y orden descendente por fecha (ajusta el campo si es distinto)
    queryFn: () =>
      apiFetch(
        `${endpoint}?page=${page}&size=${pageSize}&sort=createDate,desc`
      ),
    keepPreviousData: true,
  });

  const items = data?.content || [];
  const totalPages = data?.totalPages || 1;

  /**
   * Avanza a la siguiente página si existe.
   */
  const nextPage = () => {
    if (page < totalPages - 1) setPage((p) => p + 1);
  };

  /**
   * Retrocede a la página anterior si existe.
   */
  const prevPage = () => {
    if (page > 0) setPage((p) => p - 1);
  };

  return {
    items,
    page,
    totalPages,
    isLoading,
    isError,
    error,
    nextPage,
    prevPage,
  };
}
