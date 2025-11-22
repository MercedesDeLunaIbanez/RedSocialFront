import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { loginUser } from "../api/auth";
import { useAuth } from "../context/useAuth";
import LoginLogo from "./LoginLogo";

/**
 * Datos que se envían en el formulario de login.
 * @typedef {Object} LoginFormValues
 * @property {string} username - Nombre de usuario.
 * @property {string} password - Contraseña del usuario.
 */

/**
 * Formulario de inicio de sesión.
 *
 * Gestiona el estado y la validación del formulario utilizando React Hook Form
 * y lanza la mutación de login contra la API. Muestra errores de validación de
 * campo y errores globales de la API manteniendo la cohesión visual con el diseño existente.
 *
 * @returns {JSX.Element} Formulario de login listo para usar.
 */
export default function LoginForm() {
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "onBlur",
  });

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      login(data.access_token, { username: data.username });
    },
  });

  /**
   * Envía el formulario a la API.
   *
   * @param {LoginFormValues} values - Valores validados del formulario.
   * @returns {Promise<void>} Promesa que resuelve cuando termina el login.
   */
  const onSubmit = async (values) => {
    await mutation.mutateAsync(values);
  };

  const isDisabled = useMemo(
    () => isSubmitting || mutation.isPending,
    [isSubmitting, mutation.isPending],
  );

  return (
    <div className="login-container">
      <LoginLogo />

      <div className="login-card">
        <h3>Inicia sesión</h3>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <label htmlFor="username">Nombre de usuario</label>
          <input
            id="username"
            type="text"
            className="login-input"
            placeholder="Tu nombre de usuario"
            autoComplete="username"
            {...register("username", {
              required: "El nombre de usuario es obligatorio.",
              minLength: {
                value: 3,
                message: "El nombre de usuario debe tener al menos 3 caracteres.",
              },
              maxLength: {
                value: 30,
                message: "El nombre de usuario no puede superar los 30 caracteres.",
              },
            })}
            disabled={isDisabled}
          />
          {errors.username && (
            <p className="field-error">{errors.username.message}</p>
          )}

          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            className="login-input"
            placeholder="••••••••"
            autoComplete="current-password"
            {...register("password", {
              required: "La contraseña es obligatoria.",
              minLength: {
                value: 6,
                message: "La contraseña debe tener al menos 6 caracteres.",
              },
            })}
            disabled={isDisabled}
          />
          {errors.password && (
            <p className="field-error">{errors.password.message}</p>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={isDisabled}
          >
            {isDisabled ? "Entrando..." : "Entrar"}
          </button>

          {mutation.isError && (
            <p className="error-text">
              {mutation.error?.message ?? "No se ha podido iniciar sesión."}
            </p>
          )}
        </form>

        <p className="login-register-text">
          ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
}
