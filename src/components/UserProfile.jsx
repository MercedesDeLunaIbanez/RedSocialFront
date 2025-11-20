import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../api/client";
import UserListModal from "./UserListModal";
import { useAuth } from "../context/useAuth";

export default function UserProfile() {
  const { user: loggedInUser } = useAuth();
  const { name } = useParams();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);

  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);

  const [listToShow, setListToShow] = useState(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        setError(null);

        const profilePromise = apiFetch(`/users/public/${name}`);
        const followersPromise = apiFetch(`/users/public/followers/${name}`);
        const followingPromise = apiFetch(`/users/public/following/${name}`);

        const [profileData, followersData, followingData] = await Promise.all([
          profilePromise,
          followersPromise,
          followingPromise,
        ]);

        setProfile(profileData);

        setFollowersList(followersData);
        setFollowingList(followingData);

        setFollowersCount(followersData.length);
        setFollowingCount(followingData.length);

        setIsFollowing(followersData.some(u => u.username === loggedInUser?.username));
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [name, loggedInUser]);

  async function handleFollow() {
    try {
      await apiFetch(`/users/follow/${name}`, { method: "POST" });
      setIsFollowing(true);
      setFollowersCount(prev => prev + 1);
    } catch (err) {
      console.error("Error al seguir:", err);
    }
  }

  async function handleUnfollow() {
    try {
      await apiFetch(`/users/unfollow/${name}`, { method: "DELETE" });
      setIsFollowing(false);
      setFollowersCount(prev => (prev > 0 ? prev - 1 : 0));
    } catch (err) {
      console.error("Error al dejar de seguir:", err);
    }
  }

  if (loading) return <p className="loading-text">Cargando perfil...</p>;
  if (error) return <p className="error-text">Error: {error.message}</p>;
  if (!profile) return <p className="error-text">No se encontró el perfil del usuario.</p>;

  const listData = listToShow === 'followers' ? followersList : followingList;
  const listTitle = listToShow === 'followers' ? 'Seguidores' : 'Siguiendo';

  return (
    <>
      <div className="profile-card">
        <h2 className="profile-username">{profile.username}</h2>
        <p className="profile-email">{profile.email}</p>
        <p className="profile-description">{profile.description || "Sin descripción disponible"}</p>

        {loggedInUser?.username !== name && (
          <div className="profile-follow-action">
            <button
              className={`profile-toggle-button ${isFollowing ? "unfollow" : ""}`}
              onClick={isFollowing ? handleUnfollow : handleFollow}
            >
              {isFollowing ? "Dejar de seguir" : "Seguir"}
            </button>
          </div>
        )}

        <div className="profile-follow-stats">
          <div
            className="profile-follow-item"
            onClick={() => setListToShow('followers')}
          >
            <strong>{followersCount}</strong>
            <span>Seguidores</span>
          </div>
          <div
            className="profile-follow-item"
            onClick={() => setListToShow('following')}
          >
            <strong>{followingCount}</strong>
            <span>Siguiendo</span>
          </div>
        </div>
      </div>

      {listToShow && (
        <UserListModal
          title={listTitle}
          users={listData}
          onClose={() => setListToShow(null)}
        />
      )}
    </>
  );
}
