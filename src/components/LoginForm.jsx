// src/components/LoginForm.jsx
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../api/auth";
import { useAuth } from "../context/useAuth";


export default function LoginForm() {
  const { login } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });


  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // Suponemos que la API devuelve { token, user }
      login(data.access_token, data.user);
    },
  });


  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
  };


  return (
    <form onSubmit={handleSubmit}>
      <h3>Iniciar sesión</h3>


      <input
        type="text"
        placeholder="Username"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
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
        Entrar
      </button>


      {mutation.isError && (
        <p style={{ color: "red" }}>{mutation.error.message}</p>
      )}
    </form>
  );
}
