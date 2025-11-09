import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../api/client";


/**
 * Hook personalizado para manejar paginación con React Query y Spring Data.
 *
 * @param {string} endpoint - Ruta del endpoint (por ejemplo "/publications").
 * @param {number} [pageSize=5] - Tamaño de página (por defecto 5 elementos).
 *
 * @returns {object} {
 *   items,          // elementos de la página actual
 *   page,           // número de página actual
 *   totalPages,     // total de páginas
 *   isLoading,      // estado de carga
 *   error,          // error si lo hay
 *   nextPage,       // función para pasar a la siguiente página
 *   prevPage        // función para retroceder
 * }
 */
export function usePagination(endpoint, pageSize = 5) {
  const [page, setPage] = useState(0);


  // Consulta React Query: se actualiza automáticamente al cambiar de página
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [endpoint, page],
    queryFn: () => apiFetch(`${endpoint}?page=${page}&size=${pageSize}`),
    keepPreviousData: true, // mantiene la página anterior mientras carga la nueva
  });


  // Si no hay datos aún, devolvemos valores por defecto
  const items = data?.content || [];
  const totalPages = data?.totalPages || 1;


  const nextPage = () => {
    if (page < totalPages - 1) setPage((p) => p + 1);
  };


  const prevPage = () => {
    if (page > 0) setPage((p) => p - 1);
  };


  return { items, page, totalPages, isLoading, isError, error, nextPage, prevPage };
}
