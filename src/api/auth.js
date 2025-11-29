import { apiFetch } from "./client";

/**
 * Registra un usuario con credenciales.
 *
 * @param {{ username: string, password: string, email: string }} data - Credenciales del usuario.
 * @returns {Promise<any>} Datos devueltos por el backend al registrar un usuario.
 */
export function registerUser(data) {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Inicia sesion con credenciales de usuario.
 *
 * @param {{ username: string, password: string }} credentials - Credenciales del usuario.
 * @returns {Promise<any>} Datos devueltos por el backend al iniciar sesion.
 */
export function loginUser(credentials) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}
