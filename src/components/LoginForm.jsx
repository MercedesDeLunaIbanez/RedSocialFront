import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../api/auth";
import { useAuth } from "../context/useAuth";
import { Link } from "react-router-dom";

/**
 * Formulario de inicio de sesión.
 * 
 * El formulario utiliza el hook `useMutation` para hacer una petición POST a la
 * API de autenticación con el usuario y contraseña ingresados.
 * 
 * Si la petición es exitosa, se llama a la función `login` del contexto de
 * autenticación con el token y el usuario.
 * 
 * Si la petición falla, se muestra un mensaje de error.
 * 
 * El formulario también incluye un enlace a la página de registro.
 */
export default function LoginForm() {
  const { login } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });

  const mutation = useMutation({
    mutationFn: loginUser,
    /**
     * Se llama cuando la petición es exitosa. Recibe el objeto de respuesta de la API,
     * que se supone que tiene la forma { token, user }. Llama el token y el usuario
     */
    onSuccess: (data) => {
      // Suponemos que la API devuelve { token, user }
      login(data.access_token, { username: data.username });
    },
  });

  /**
   * Función para manejar el envío del formulario de inicio de sesión.
   * Previene la propagación del evento, y llama a la mutación con el objeto de
   * formulario actual para hacer la petición POST a la API de autenticación.
   * Si la petición es exitosa, se llama a la función `login` del contexto de
   * autenticación con el token y el usuario.
   * Si la petición falla, se muestra un mensaje de error.
   * @param {Event} e - El evento de envío del formulario.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h3>Iniciar sesión</h3>
        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
          className="login-input"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          className="login-input"
        />
        <button type="submit" disabled={mutation.isPending} className="login-button">
          Entrar
        </button>

        {mutation.isError && (
          <p className="error-text">{mutation.error.message}</p>
        )}
      </form>

      <p className="login-register-text">
        ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
      </p>
    </div>
  );
}
