import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../api/client";
import UserListModal from "./UserListModal";

export default function UserProfile() {
  const { name } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalUsers, setModalUsers] = useState([]);

  useEffect(() => {
    async function loadProfile() {
      try {
        const [profileData, followersData, followingData] = await Promise.all([
          apiFetch(`/users/public/${name}`),
          apiFetch (`/users/public/followers/${name}`),
          apiFetch(`/users/public/following/${name}`),
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
  }, [name]);

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

  if (loading) return <p className="loading-text">Cargando perfil...</p>;
  if (error) return <p className="error-text">Error: {error.message}</p>;
  if (!profile) return <p className="error-text">No se encontró el perfil del usuario.</p>;

  return (
    <div className="profile-card">
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
