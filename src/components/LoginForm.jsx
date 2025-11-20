import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../api/auth";
import { useAuth } from "../context/useAuth";
import { Link } from "react-router-dom";
import LoginLogo from "./LoginLogo"; // <-- importamos el logo animado


export default function LoginForm() {
  const { login } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });


  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => login(data.access_token, { username: data.username }),
  });


  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
  };


  return (
    <div className="login-container">
      {/* Logo animado arriba */}
      <LoginLogo />


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


        {mutation.isError && <p className="error-text">{mutation.error.message}</p>}
      </form>


      <p className="login-register-text">
        ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
      </p>
    </div>
  );
}
