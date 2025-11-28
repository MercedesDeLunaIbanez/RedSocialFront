import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";
import { useAuth } from "../hooks/useAuth";
import UserListModal from "./UserListModal";

/**
 * Componente para mostrar el perfil del usuario autenticado.
 *
 * Muestra información del usuario y sus seguidores/siguiendo.
 * Permite abrir un modal para ver las listas.
 * También permite cambiar el nombre de usuario.
 *
 * @returns {JSX.Element} Perfil del usuario con estadísticas, modal y formulario de actualización.
 */
export default function MyUserProfile() {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados originales para listas y modales
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);

  // --- Estados añadidos para el formulario de cambio de username ---
  const [showForm, setShowForm] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [redirectMessage, setRedirectMessage] = useState("");

  useEffect(() => {
    /**
     * Carga el perfil del usuario autenticado y sus listas de seguidores/seguidos.
     * Mantiene los estados de carga y error para mostrar mensajes adecuados en la UI.
     */
    async function loadProfile() {
      if (!user?.username) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);

        const profilePromise = apiFetch(`/users/public/${user.username}`);
        const followersPromise = apiFetch("/users/followers");
        const followingPromise = apiFetch("/users/following");

        const [profileData, followersData, followingData] = await Promise.all([
          profilePromise,
          followersPromise,
          followingPromise,
        ]);

        setProfile(profileData);
        setFollowers(followersData); // Usamos el estado original
        setFollowing(followingData); // Usamos el estado original
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [user.username]);

  // --- Función añadida para manejar el cambio de username ---
  /**
   * Actualiza el nombre de usuario del usuario autenticado.
   * Valida el formulario y verifica que el nuevo nombre de usuario no esté vacío y sea diferente al actual.
   * Si hay un error, se muestra un mensaje de error.
   * Si se actualiza correctamente, se muestra un mensaje de éxito y se redirige al login después de 2 segundos.
   * @param {Event} e - Evento del formulario.
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
      setRedirectMessage(
        "Nombre de usuario actualizado. Serás redirigido al login..."
      );
      setTimeout(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.replace("/login");
      }, 2000);
    } catch (err) {
      setUpdateError(
        err.message || "Error al actualizar el nombre de usuario."
      );
      setIsUpdating(false);
    }
  };

  if (loading) return <p className="loading-text">Cargando perfil...</p>;
  if (error) return <p className="error-text">Error: {error.message}</p>;
  if (!profile)
    return <p className="error-text">No se encontró el perfil del usuario.</p>;

  return (
    // Usamos un Fragmento <> para envolver la lógica del modal original
    // y el 'profile-card'
    <>
      <div className="profile-card">
        <h2 className="profile-username">{profile.username}</h2>
        <p className="profile-email">{profile.email}</p>
        <p className="profile-description">
          {profile.description || "Sin descripción disponible"}
        </p>

        {/* --- Lógica original de seguidores/siguiendo --- */}
        <div className="profile-follow-stats">
          <div
            className="profile-follow-item follow-link"
            onClick={() => setShowFollowersModal(true)}
          >
            <strong>{followers.length}</strong>
            <span>Seguidores</span>
          </div>
          <div
            className="profile-follow-item follow-link"
            onClick={() => setShowFollowingModal(true)}
          >
            <strong>{following.length}</strong>
            <span>Siguiendo</span>
          </div>
        </div>

        {/* --- JSX añadido para el formulario (con separador) --- */}
        <hr className="profile-divider" />

        <button
          onClick={() => setShowForm(!showForm)}
          className="profile-toggle-form-btn"
        >
          {showForm ? "Cancelar" : "Cambiar nombre de usuario"}
        </button>

        {showForm && (
          <form onSubmit={handleChangeUsername} className="profile-update-form">
            <h3 className="profile-update-title">Cambiar nombre de usuario</h3>
            <div className="form-group">
              <label htmlFor="newUsername" className="form-label">
                Nuevo nombre de usuario:
              </label>
              <input
                id="newUsername"
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Introduce tu nuevo username"
                className="form-input"
                disabled={isUpdating}
              />
            </div>
            <button
              type="submit"
              disabled={isUpdating}
              className="profile-update-submit-btn"
            >
              {isUpdating ? "Actualizando..." : "Actualizar nombre"}
            </button>
            {updateError && <p className="error-text">{updateError}</p>}
            {redirectMessage && (
              <p className="success-text">{redirectMessage}</p>
            )}
          </form>
        )}
      </div>

      {/* --- Lógica original de modales (fuera del card) --- */}
      {showFollowersModal && (
        <UserListModal
          title="Seguidores"
          users={followers}
          onClose={() => setShowFollowersModal(false)}
        />
      )}

      {showFollowingModal && (
        <UserListModal
          title="Siguiendo"
          users={following}
          onClose={() => setShowFollowingModal(false)}
        />
      )}
    </>
  );
}
