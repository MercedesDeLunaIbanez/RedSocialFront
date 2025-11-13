// src/pages/HomePage.jsx
import CreatePublication from "../components/CreatePublication";
import Header from "../components/Header";
import PublicationFollowing from "../components/PublicationFollowing";



/**
 * Página principal de la aplicación que muestra el formulario para crear una publicación
 * y una lista de publicaciones de los usuarios que se sigue.
 */
export default function HomePage() {
  return (
    <>
      <Header />
      <CreatePublication />
      <main style={{ padding: 20 }}>
        <h3>Publicaciones de tus seguidos</h3>
        <PublicationFollowing />
      </main>
    </>
  );
}
