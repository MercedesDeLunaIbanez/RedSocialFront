// src/pages/ProfilePage.jsx
import Header from "../components/Header";
import ProfilePublication from "../components/ProfilePublication";
import UserProfile from "../components/UserProfile";

/**
 * Pagina publica que muestra el perfil de otro usuario y sus publicaciones.
 *
 * @returns {JSX.Element} Vista de perfil ajeno con feed asociado.
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
