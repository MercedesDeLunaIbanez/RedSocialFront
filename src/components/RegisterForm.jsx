import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

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
      // ✅ Redirige al login después de registrarse correctamente
      setTimeout(() => navigate("/"), 1500);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <main style={{ maxWidth: 500, margin: "40px auto" }}>
    <h2>Bienvenida a MiniRed</h2>
    <form onSubmit={handleSubmit}>
      <h3>Registrate</h3>
      <input
        type="text"
        placeholder="Usuario"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        required
      />

      <button type="submit" disabled={mutation.isPending}>
        Registrarse
      </button>

      {mutation.isError && (
        <p style={{ color: "red" }}>{mutation.error.message}</p>
      )}

      {mutation.isSuccess && (
        <p style={{ color: "green" }}>
          Registro completado con éxito. Redirigiendo al login...
        </p>
      )}
    </form>
    <p>
        ¿Ya tienes cuenta? <Link to="/">Inicia sesión</Link>
    </p>
    </main>
  );
}
