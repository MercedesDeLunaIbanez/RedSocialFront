/**
 * Realiza peticiones HTTP a la API añadiendo automáticamente el token si existe.
 * También intenta leer mensajes de error del backend (ProblemDetail: title/detail).
 *
 * Solo usa JSON (sin FormData), por lo que el Content-Type siempre será application/json.
 *
 * @param {string} url - Ruta relativa de la API (ej. "/publications").
 * @param {RequestInit} [options] - Configuración fetch (method, headers, body...).
 * @returns {Promise<any>} JSON de respuesta (o null si 204).
 * @throws {Error} Cuando la respuesta no es ok, con el mensaje del backend si es posible.
 */
export async function apiFetch(url, options = {}) {
  // 1) Recuperamos el token guardado (si el usuario está logueado).
  const token = localStorage.getItem("token");

  // 2) Definimos la base de la API. Así si cambia el puerto o la URL, solo se modifica aquí.
  const baseURL = "http://localhost:8080/api/v1";

  // 3) Construimos la configuración final de fetch.
  //    Incluye:
  //      - Content-Type: application/json (ya que no usamos archivos)
  //      - Authorization: Bearer <token> si el usuario está logueado
  //      - Headers personalizados que puedan venir en 'options'
  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  };

  // 4) Ejecutamos la petición a la API. Si la URL empieza por "/", se concatena con la base.
  const res = await fetch(baseURL + url, config);

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
  //    - Si el código es 204 (No Content), devolvemos null
  //    - Si hay contenido, lo intentamos parsear como JSON
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}