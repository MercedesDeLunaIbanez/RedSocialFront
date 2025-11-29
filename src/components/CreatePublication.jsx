import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../hooks/useAuth";
import { apiFetch } from "../api/client";

/**
 * Datos que se envian al crear una publicacion.
 * @typedef {Object} CreatePublicationValues
 * @property {string} text - Contenido de la publicacion.
 */

/**
 * Formulario para crear una nueva publicacion.
 *
 * Utiliza React Hook Form para gestionar el estado y la validacion del textarea,
 * y React Query para lanzar la mutacion de creacion contra la API. Tras una
 * creacion correcta invalida las queries relacionadas con publicaciones para
 * refrescar automaticamente los listados.
 *
 * @returns {JSX.Element} Un formulario estilado para crear publicaciones.
 */
export default function CreatePublication() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      text: "",
    },
    mode: "onBlur",
  });

  const mutation = useMutation({
    /**
     * Crea una nueva publicacion en la API con el texto proporcionado.
     *
     * @param {CreatePublicationValues} values - Valores validados del formulario.
     * @returns {Promise<void>} Promesa que resuelve cuando se completa la creacion.
     */
    mutationFn: async ({ text }) =>
      apiFetch("/publications/", {
        method: "POST",
        body: JSON.stringify({ text }),
      }),

    /**
     * Tras crear, resetea el formulario e invalida queries de publicaciones.
     */
    onSuccess: () => {
      reset();
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) &&
          typeof query.queryKey[0] === "string" &&
          query.queryKey[0].includes("publications"),
      });
    },
  });

  /**
   * Envia el texto de la publicacion a la API.
   *
   * @param {CreatePublicationValues} values - Valores validados del formulario.
   * @returns {Promise<void>} Promesa que resuelve cuando se completa la creacion.
   */
  const onSubmit = async (values) => {
    if (!user) return;
    await mutation.mutateAsync(values);
  };

  // Determina si el formulario debe estar deshabilitado
  const isDisabled = useMemo(
    () => !user || isSubmitting || mutation.isPending,
    [user, isSubmitting, mutation.isPending],
  );

  return (
    <section className="create-publication-card">
      <h3 className="create-publication-title">Crea una nueva publicacion</h3>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <textarea
          className="create-publication-textarea"
          placeholder={
            user
              ? "Que esta pasando?"
              : "Inicia sesion para poder publicar."
          }
          rows={3}
          {...register("text", {
            required: user ? "El texto de la publicacion es obligatorio." : false,
            minLength: {
              value: 3,
              message: "La publicacion debe tener al menos 3 caracteres.",
            },
            maxLength: {
              value: 280,
              message: "La publicacion no puede superar los 280 caracteres.",
            },
          })}
          disabled={isDisabled}
        />
        {errors.text && (
          <p className="field-error">{errors.text.message}</p>
        )}

        <button
          type="submit"
          className="create-publication-button"
          disabled={isDisabled}
        >
          {mutation.isPending || isSubmitting ? "Publicando..." : "Publicar"}
        </button>
      </form>

      {mutation.isError && (
        <p className="error-text">
          {mutation.error?.message ?? "No se ha podido crear la publicacion."}
        </p>
      )}
    </section>
  );
}
