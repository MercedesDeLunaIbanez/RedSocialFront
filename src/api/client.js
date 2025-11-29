/**
 * Realiza peticiones HTTP a la API anadiendo automaticamente el token si existe.
 * Tambien intenta leer mensajes de error del backend (ProblemDetail: title/detail).
 *
 * Solo usa JSON (sin FormData), por lo que el Content-Type siempre sera application/json.
 *
 * @param {string} url - Ruta relativa de la API (ej. "/publications").
 * @param {RequestInit} [options] - Configuracion fetch (method, headers, body...).
 * @returns {Promise<any>} JSON de respuesta (o null si 204).
 * @throws {Error} Cuando la respuesta no es ok, con el mensaje del backend si es posible.
 */
export async function apiFetch(url, options = {}) {
  // 1) Recuperamos el token guardado (si el usuario esta logueado).
  const token = localStorage.getItem("token");

  // 2) Definimos la base de la API. Asi si cambia el puerto o la URL, solo se modifica aqui.
  const baseURL = "http://localhost:8080/api/v1";

  // 3) Construimos la configuracion final de fetch.
  //    Incluye:
  //      - Content-Type: application/json (ya que no usamos archivos)
  //      - Authorization: Bearer <token> si el usuario esta logueado
  //      - Headers personalizados que puedan venir en 'options'
  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // Solo anadimos Content-Type cuando hay body para evitar preflight en GET
  if (options.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const config = { ...options, headers };

  // 4) Ejecutamos la peticion a la API. Si la URL empieza por "/", se concatena con la base.
  const res = await fetch(baseURL + url, config);

  // Si la sesion caduco y habia token, limpiamos y redirigimos al login
  if ((res.status === 401 || res.status === 403) && token) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.replace("/");
    throw new Error("Sesion expirada");
  }

  // 5) Si la respuesta tiene error (4xx o 5xx), intentamos mostrar un mensaje claro.
  if (!res.ok) {
    let msg = `Error HTTP ${res.status}`;
    try {
      // Intentamos leer el cuerpo como JSON (formato ProblemDetail de Spring Boot)
      const body = await res.json();
      msg = body.detail || body.title || JSON.stringify(body);
    } catch {
      // Si no es JSON, leemos el texto plano
      msg = await res.text();
    }
    throw new Error(msg || `Error HTTP ${res.status}`);
  }

  // 6) Si la respuesta es correcta:
  //    - Si el codigo es 204 (No Content), devolvemos null
  //    - Si hay contenido, lo intentamos parsear como JSON
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}
