// src/components/MyUserProfile.jsx
import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";
import { useAuth } from "../context/useAuth";


export default function MyUserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // ✅ estado para mostrar/ocultar formulario
  const [showForm, setShowForm] = useState(false);


  const [newUsername, setNewUsername] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [redirectMessage, setRedirectMessage] = useState("");


  useEffect(() => {
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


  if (loading) return <p>Cargando perfil...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error.message}</p>;
  if (!profile) return <p>No se encontró el perfil del usuario.</p>;


  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "40px auto",
        padding: "20px",
        backgroundColor: "#f9f9f9",
        borderRadius: "10px",
        boxShadow: "0 0 8px rgba(0,0,0,0.1)",
        textAlign: "center",
      }}
    >
      <h2 style={{ marginBottom: "10px" }}>{profile.username}</h2>
      <p>{profile.email}</p>
      <p>{profile.description || "Sin descripción disponible"}</p>


      <hr style={{ margin: "30px 0" }} />


      {/* ✅ Botón para mostrar/ocultar formulario */}
      <button
        onClick={() => setShowForm(!showForm)}
        style={{
          padding: "10px 15px",
          cursor: "pointer",
          backgroundColor: "#1976d2",
          color: "white",
          border: "none",
          borderRadius: "6px",
        }}
      >
        {showForm ? "Cancelar" : "Cambiar nombre de usuario"}
      </button>


      {/* ✅ El formulario solo aparece si showForm es true */}
      {showForm && (
        <form onSubmit={handleChangeUsername} style={{ marginTop: "20px" }}>
          <h3 style={{ marginBottom: "15px" }}>Cambiar nombre de usuario</h3>


          <div style={{ marginBottom: "10px" }}>
            <label
              htmlFor="newUsername"
              style={{ display: "block", marginBottom: "5px" }}
            >
              Nuevo nombre de usuario:
            </label>
            <input
              id="newUsername"
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Introduce tu nuevo username"
              style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
              disabled={isUpdating}
            />
          </div>


          <button
            type="submit"
            disabled={isUpdating}
            style={{ padding: "8px 15px", cursor: "pointer" }}
          >
            {isUpdating ? "Actualizando..." : "Actualizar nombre"}
          </button>


          {updateError && (
            <p style={{ color: "red", marginTop: "10px" }}>{updateError}</p>
          )}


          {redirectMessage && (
            <p style={{ color: "green", marginTop: "10px", fontWeight: "bold" }}>
              {redirectMessage}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
