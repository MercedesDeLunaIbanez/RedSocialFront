import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";
import { useAuth } from "../context/useAuth";

/**
 * Componente para mostrar el perfil del usuario autenticado.
 * 
 * Muestra la información del usuario y permite cambiar el nombre de usuario.
 * 
 * @returns {JSX.Element} Un formulario para cambiar el nombre de usuario.
 */
export default function MyUserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // estado para mostrar/ocultar formulario
  const [showForm, setShowForm] = useState(false);

  const [newUsername, setNewUsername] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [redirectMessage, setRedirectMessage] = useState("");

  useEffect(() => {
    /**
     * Carga el perfil del usuario autenticado.
     * Si no hay usuario autenticado, no hace nada.
     * En caso de error, guarda el error en el estado `error`.
     * En caso de éxito, guarda el perfil en el estado `profile`.
     * Mientras carga, muestra un estado `loading` de verdadero.
     */
    async function loadProfile() {
      if (!user?.username) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const data = await apiFetch(`/users/public/${user.username}`);
        setProfile(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [user.username]);

  /**
   * Función para manejar el envío del formulario de actualización de nombre de usuario.
   * Previene la propagación del evento, y hace una petición PATCH a la API de
   * autenticación con el nuevo nombre de usuario.
   * Si la petición es exitosa, redirige al usuario al login.
   * Si la petición falla, muestra un mensaje de error.
   */
  const handleChangeUsername = async (e) => {
    e.preventDefault();
    if (!newUsername.trim()) {
      setUpdateError("El nombre de usuario no puede estar vacío.");
      return;
    }
    if (newUsername === user.username) {
      setUpdateError("El nuevo nombre de usuario debe ser diferente al actual.");
      return;
    }

    setIsUpdating(true);
    setUpdateError(null);

    try {
      await apiFetch("/users/change", {
        method: "PATCH",
        body: JSON.stringify({ username: newUsername }),
      });
      setRedirectMessage("Nombre de usuario actualizado. Serás redirigido al login...");

      // función para redirigir al login
      setTimeout(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.replace("/login");
      }, 2000);
    } catch (err) {
      setUpdateError(err.message || "Error al actualizar el nombre de usuario.");
      setIsUpdating(false);
    }
  };

  if (loading) return <p className="loading-text">Cargando perfil...</p>;
  if (error) return <p className="error-text">Error: {error.message}</p>;
  if (!profile) return <p className="error-text">No se encontró el perfil del usuario.</p>;

  return (
    <div className="profile-container">
      <h2 className="profile-username">{profile.username}</h2>
      <p className="profile-email">{profile.email}</p>
      <p className="profile-description">{profile.description || "Sin descripción disponible"}</p>

      <hr className="profile-divider" />

      {/* Botón para mostrar/ocultar formulario */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="profile-toggle-button"
      >
        {showForm ? "Cancelar" : "Cambiar nombre de usuario"}
      </button>

      {/* El formulario solo aparece si showForm es true */}
      {showForm && (
        <form onSubmit={handleChangeUsername} className="profile-form">
          <h3 className="profile-form-title">Cambiar nombre de usuario</h3>

          <div className="profile-form-group">
            <label htmlFor="newUsername" className="profile-label">
              Nuevo nombre de usuario:
            </label>
            <input
              id="newUsername"
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Introduce tu nuevo username"
              className="profile-input"
              disabled={isUpdating}
            />
          </div>

          <button type="submit" disabled={isUpdating} className="profile-submit-button">
            {isUpdating ? "Actualizando..." : "Actualizar nombre"}
          </button>

          {updateError && <p className="error-text">{updateError}</p>}
          {redirectMessage && <p className="success-text">{redirectMessage}</p>}
        </form>
      )}
    </div>
  );
}
