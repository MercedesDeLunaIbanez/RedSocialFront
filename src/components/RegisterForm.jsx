// src/components/RegisterForm.jsx
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../api/auth";


export default function RegisterForm() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });


  const mutation = useMutation({
    mutationFn: registerUser,
  });


  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
  };


  return (
    <form onSubmit={handleSubmit}>
      <h3>Registro</h3>


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
        <p style={{ color: "green" }}>Registro completado con éxito</p>
      )}
    </form>
  );
}
