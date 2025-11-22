import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";
import { useAuth } from "../context/useAuth";
import UserListModal from "./UserListModal";

/**
 * Componente para mostrar el perfil del usuario autenticado.
 *
 * Muestra información del usuario y sus seguidores/siguiendo.
 * Permite abrir un modal para ver las listas.
 *
 * @returns {JSX.Element} Perfil del usuario con estadísticas y modal.
 */
export default function MyUserProfile() {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);

  useEffect(() => {
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

  if (loading) return <p className="loading-text">Cargando perfil...</p>;
  if (error) return <p className="error-text">Error: {error.message}</p>;
  if (!profile) return <p className="error-text">No se encontró el perfil del usuario.</p>;

  return (
    <div className="profile-card">
      <h2 className="profile-username">{profile.username}</h2>
      <p className="profile-email">{profile.email}</p>
      <p className="profile-description">{profile.description || "Sin descripción disponible"}</p>

      <div className="profile-follow-stats">

        {/* --- Seguidores (clic en número + texto + área entera) --- */}
        <div
          className="profile-follow-item follow-link"
          onClick={() => setShowFollowersModal(true)}
        >
          <strong>{followers.length}</strong>
          <span>Seguidores</span>
        </div>

        {/* --- Siguiendo (clic en número + texto + área entera) --- */}
        <div
          className="profile-follow-item follow-link"
          onClick={() => setShowFollowingModal(true)}
        >
          <strong>{following.length}</strong>
          <span>Siguiendo</span>
        </div>
      </div>

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
    </div>
  );
}
