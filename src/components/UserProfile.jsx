import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../api/client";

/**
 * Componente que muestra el perfil del usuario con el nombre proporcionado.
 * La información del perfil se carga desde la API y se muestra en una caja
 * con estilos de diseño.
 * Si el perfil no existe, se muestra un mensaje "No se encontró el
 * Perfil del usuario.".
 * Si ocurre un error, se muestra un mensaje de error en rojo.
 * La información se actualiza automáticamente cuando se carga el perfil.
 * @returns {JSX.Element} Un componente que muestra el perfil del usuario.
 */
export default function UserProfile() {
  const { name } = useParams(); // toma el nombre de la URL
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    /**
     * Carga el perfil del usuario con el nombre proporcionado.
     * Hace una petición GET a la API y guarda el resultado en el estado `profile`.
     * Si ocurre un error, guarda el error en el estado `error`.
     * Mientras carga, muestra un estado `loading` de verdadero.
     */
    async function loadProfile() {
      try {
        const data = await apiFetch(`/users/public/${name}`);
        setProfile(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [name]);

  if (loading) return <p className="loading-text">Cargando perfil...</p>;
  if (error) return <p className="error-text">Error: {error.message}</p>;
  if (!profile) return <p className="error-text">No se encontró el perfil del usuario.</p>;

  return (
    <div className="profile-card">
      <h2 className="profile-username">{profile.username}</h2>
      <p className="profile-email">{profile.email}</p>
      <p className="profile-description">{profile.description || "Sin descripción disponible"}</p>
    </div>
  );
}
