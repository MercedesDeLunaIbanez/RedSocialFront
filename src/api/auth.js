import { apiFetch } from "./client";

/**
 * Registra un nuevo usuario.
 *
 * @param {{ username: string, password: string }} data
 * @returns {Promise<any>} Datos devueltos por el backend al registrar.
 */
export function registerUser(data) {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}


/**
 * Inicia sesión con credenciales de usuario.
 * 
 * @param {{ username: string, password: string }} credentials - Credenciales del usuario.
 * @returns {Promise<any>} Datos devueltos por el backend al iniciar sesión.
 * 
 * Devuelve un objeto con las propiedades:
 * - `token`: El token JWT del usuario autenticado.
 * - `user`: El objeto del usuario autenticado.
 */

export function loginUser(credentials) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}
