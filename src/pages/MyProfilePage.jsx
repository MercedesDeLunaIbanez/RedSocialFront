// src/pages/MyProfilePage.jsx
import Header from "../components/Header";
import MyPublication from "../components/MyPublication"
import MyUserProfile from "../components/MyUserProfile";


/**
 * Página que muestra el perfil del usuario actual y sus publicaciones.
 * La página se divide en dos secciones: la primera muestra el perfil del usuario
 * actual y la segunda muestra sus publicaciones.
 * La página se carga automáticamente cuando el usuario inicia sesión o se desloguea.
 * @returns {JSX.Element} Un componente que muestra el perfil del usuario actual y sus publicaciones.
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
