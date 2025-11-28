import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../hooks/useAuth";
import { apiFetch } from "../api/client";

/**
 * Datos que se envían al crear una publicación.
 * @typedef {Object} CreatePublicationValues
 * @property {string} text - Contenido de la publicación.
 */

/**
 * Formulario para crear una nueva publicación.
 *
 * Utiliza React Hook Form para gestionar el estado y la validación del textarea,
 * y React Query para lanzar la mutación de creación contra la API. Tras una
 * creación correcta invalida las queries relacionadas con publicaciones para
 * refrescar automáticamente los listados.
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
   * Función que se llama cuando se lanza la mutación.
   * Crea una nueva publicación en la API con el texto proporcionado.
   * Se utiliza fetch con el método POST para crear la publicación.
   * @param {CreatePublicationValues} values - Valores validados del formulario.
   * @returns {Promise<void>} Promesa que resuelve cuando se completa la creación.
   */
    mutationFn: async ({ text }) =>
      apiFetch("/publications/", {
        method: "POST",
        body: JSON.stringify({ text }),
      }),

      
  /**
   * Se llama cuando se completa la creación de una publicación con éxito.
   * Invalida todas las queries que contengan "/publications" en su queryKey, para que se refresquen automáticamente.
   */
    onSuccess: () => {
      reset();
      queryClient.invalidateQueries({
  /**
   * Función que determina si una query debe ser invalidada.
   * Se considera que una query debe ser invalidada si su queryKey es un array,
   * el primer elemento de ese array es una cadena, y esa cadena contiene
   * la subcadena "publications".
   * @param {Query} query - La query que se va a evaluar.
   * @returns {boolean} True si la query debe ser invalidada, false en caso contrario.
   */
        predicate: (query) =>
          Array.isArray(query.queryKey) &&
          typeof query.queryKey[0] === "string" &&
          query.queryKey[0].includes("publications"),
      });
    },
  });

  /**
   * Envía el texto de la publicación a la API.
   *
   * @param {CreatePublicationValues} values - Valores validados del formulario.
   * @returns {Promise<void>} Promesa que resuelve cuando se completa la creación.
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
      <h3 className="create-publication-title">Crea una nueva publicación</h3>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <textarea
          className="create-publication-textarea"
          placeholder={
            user
              ? "¿Qué está pasando?"
              : "Inicia sesión para poder publicar."
          }
          rows={3}
          {...register("text", {
            required: user ? "El texto de la publicación es obligatorio." : false,
            minLength: {
              value: 3,
              message: "La publicación debe tener al menos 3 caracteres.",
            },
            maxLength: {
              value: 280,
              message: "La publicación no puede superar los 280 caracteres.",
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
          {mutation.error?.message ?? "No se ha podido crear la publicación."}
        </p>
      )}
    </section>
  );
}
