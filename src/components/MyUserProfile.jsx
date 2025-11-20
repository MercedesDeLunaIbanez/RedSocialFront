import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";
import { useAuth } from "../context/useAuth";
import UserListModal from "./UserListModal"; // Importa el modal

export default function MyUserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [redirectMessage, setRedirectMessage] = useState("");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalUsers, setModalUsers] = useState([]);

  useEffect(() => {
    async function loadProfile() {
      if (!user?.username) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);

        const [profileData, followersData, followingData] = await Promise.all([
          apiFetch(`/users/public/${user.username}`),
          apiFetch("/users/followers"),
          apiFetch("/users/following"),
        ]);

        setProfile(profileData);
        setFollowers(followersData);
        setFollowing(followingData);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user.username]);

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

  const openModal = (type) => {
    if (type === "followers") {
      setModalTitle("Seguidores");
      setModalUsers(followers);
    } else {
      setModalTitle("Siguiendo");
      setModalUsers(following);
    }
    setModalOpen(true);
  };

  if (loading) return <p>Cargando perfil...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error.message}</p>;
  if (!profile) return <p>No se encontró el perfil del usuario.</p>;

  return (
    <div className="profile-container">
      <h2 className="profile-username">{profile.username}</h2>
      <p className="profile-email">{profile.email}</p>
      <p className="profile-description">{profile.description || "Sin descripción disponible"}</p>

      {/* Seguidores / Siguiendo */}
      <div className="profile-follow-stats">
        <div className="profile-follow-item" onClick={() => openModal("followers")}>
          <strong>{followers.length}</strong>
          <span className="follow-link">Seguidores</span>
        </div>
        <div className="profile-follow-item" onClick={() => openModal("following")}>
          <strong>{following.length}</strong>
          <span className="follow-link">Siguiendo</span>
        </div>
      </div>

      <hr className="profile-divider" />

      {/* Formulario de cambio de nombre */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="profile-toggle-button"
      >
        {showForm ? "Cancelar" : "Cambiar nombre de usuario"}
      </button>

      {showForm && (
        <form onSubmit={handleChangeUsername} className="profile-form">
          <h3 className="profile-form-title">Cambiar nombre de usuario</h3>
          <div className="profile-form-group">
            <label htmlFor="newUsername" className="profile-label">Nuevo nombre de usuario:</label>
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
          <button type="submit" className="profile-submit-button" disabled={isUpdating}>
            {isUpdating ? "Actualizando..." : "Actualizar nombre"}
          </button>
          {updateError && <p className="error-text">{updateError}</p>}
          {redirectMessage && <p className="success-text">{redirectMessage}</p>}
        </form>
      )}

      {/* Modal de usuarios */}
      {modalOpen && (
        <UserListModal
          title={modalTitle}
          users={modalUsers}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
