// src/pages/HomePage.jsx
import CreatePublication from "../components/CreatePublication";
import Header from "../components/Header";
import PublicationFollowing from "../components/PublicationFollowing";

/**
 * Pagina principal que muestra las publicaciones de usuarios seguidos.
 *
 * @returns {JSX.Element} Vista con cabecera y feed de seguidos.
 */
export default function HomePage() {
  return (
    <>
      <Header />
      <main style={{ padding: 20 }}>
        {/* El formulario esta disponible en toda la app, aqui se prioriza el feed de seguidos */}
        <h3>Publicaciones de tus seguidos</h3>
        <PublicationFollowing />
      </main>
    </>
  );
}
