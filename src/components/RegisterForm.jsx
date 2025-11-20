import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";
import LoginLogo from "../components/LoginLogo";

export default function RegisterForm() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      setTimeout(() => navigate("/"), 1500);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <div className="login-container">
      {/* Logo animado */}
        <LoginLogo />
      <div className="login-card">
        {/* Subtítulo */}
        <h3 style={{ textAlign: "center", marginBottom: "20px", color: "var(--nebula-text)" }}>
          Regístrate
        </h3>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Usuario"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="login-input"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="login-input"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="login-input"
            required
          />

          <button
            type="submit"
            disabled={mutation.isPending}
            className="login-button"
          >
            {mutation.isPending ? "Registrando..." : "Registrarse"}
          </button>

          {mutation.isError && (
            <p className="error">{mutation.error.message}</p>
          )}

          {mutation.isSuccess && (
            <p className="success">
              Registro completado con éxito. Redirigiendo al login...
            </p>
          )}
        </form>

        <p className="login-register-text">
          ¿Ya tienes cuenta? <Link to="/">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
