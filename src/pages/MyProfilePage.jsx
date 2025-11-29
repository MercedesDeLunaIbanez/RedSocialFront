// src/pages/MyProfilePage.jsx
import Header from "../components/Header";
import MyPublication from "../components/MyPublication";
import MyUserProfile from "../components/MyUserProfile";

/**
 * Pagina que muestra el perfil del usuario actual y sus publicaciones.
 *
 * @returns {JSX.Element} Vista de perfil propio con feed personal.
 */
export default function MyProfilePage() {
  return (
    <>
      <Header />
      <main style={{ padding: 20 }}>
        <MyUserProfile />
        <MyPublication />
      </main>
    </>
  );
}
