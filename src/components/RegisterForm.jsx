import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/auth";
import LoginLogo from "../components/LoginLogo";

/**
 * Datos que se envían en el formulario de registro.
 * @typedef {Object} RegisterFormValues
 * @property {string} username - Nombre de usuario.
 * @property {string} email - Correo electrónico del usuario.
 * @property {string} password - Contraseña del usuario.
 */

/**
 * Formulario de registro de usuario.
 *
 * Utiliza React Hook Form para gestionar el estado y las reglas de validación
 * y lanza la mutación de alta de usuario contra la API. Tras un registro correcto
 * redirige a la pantalla de login.
 *
 * @returns {JSX.Element} Formulario de registro listo para usar.
 */
export default function RegisterForm() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      reset();
      navigate("/");
    },
  });

  /**
   * Envía el formulario de registro a la API.
   *
   * @param {RegisterFormValues} values - Valores validados del formulario.
   * @returns {Promise<void>} Promesa que resuelve cuando termina el registro.
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
        <h3>Crea tu cuenta</h3>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <label htmlFor="username">Nombre de usuario</label>
          <input
            id="username"
            type="text"
            className="login-input"
            placeholder="Elige un nombre de usuario"
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

          <label htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            type="email"
            className="login-input"
            placeholder="tucorreo@ejemplo.com"
            autoComplete="email"
            {...register("email", {
              required: "El correo electrónico es obligatorio.",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/u,
                message: "Introduce un correo electrónico válido.",
              },
            })}
            disabled={isDisabled}
          />
          {errors.email && (
            <p className="field-error">{errors.email.message}</p>
          )}

          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            className="login-input"
            placeholder="Mínimo 6 caracteres"
            autoComplete="new-password"
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
            {isDisabled ? "Creando cuenta..." : "Registrarse"}
          </button>

          {mutation.isError && (
            <p className="error-text">
              {mutation.error?.message ?? "No se ha podido completar el registro."}
            </p>
          )}

          {mutation.isSuccess && !mutation.isPending && (
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
