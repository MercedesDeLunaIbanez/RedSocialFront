import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * Hook de conveniencia para leer el contexto de autenticacion.
 *
 * @returns {{token: string|null, user: object|null, login: Function, logout: Function, isAuthenticated: boolean}} Datos y acciones de autenticacion.
 */
export function useAuth() {
  return useContext(AuthContext);
}
