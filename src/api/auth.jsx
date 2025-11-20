import { apiFetch } from "./client";


/**
 * Registra un nuevo usuario.
 * @param {{username: string, password: string }} data
 */
export function registerUser(data) {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}


/**
 * Inicia sesión y obtiene el token JWT.
 * @param {{ username: string, password: string }} data
 */

export function loginUser(data) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
