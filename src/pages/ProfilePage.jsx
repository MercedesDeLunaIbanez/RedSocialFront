// src/pages/ProfilePage.jsx
import Header from "../components/Header";
import ProfilePublication from "../components/ProfilePublication";
import UserProfile from "../components/UserProfile";


/**
 * Página que muestra el perfil del usuario y sus publicaciones.
 * La página se divide en dos secciones: la primera muestra el perfil del usuario
 * actual y la segunda muestra sus publicaciones.
 * La página se carga automáticamente cuando el usuario inicia sesión o se desloguea.
 * @returns {JSX.Element} Un componente que muestra el perfil del usuario actual y sus publicaciones.
 */
export default function ProfilePage() {
  return (
    <>
      <Header />
      <main style={{ padding: 20 }}>
        <UserProfile />
        <ProfilePublication />
      </main>
    </>
  );
}
