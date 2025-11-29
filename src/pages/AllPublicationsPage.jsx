// src/pages/AllPublicationsPage.jsx
import CreatePublication from "../components/CreatePublication";
import Header from "../components/Header";
import PublicationList from "../components/PublicationList";

/**
 * Pagina que muestra todas las publicaciones con paginacion infinita.
 *
 * @returns {JSX.Element} Vista con cabecera, formulario y listado completo.
 */
export default function AllPublicationsPage() {
  return (
    <>
      <Header />
      <CreatePublication />
      <main style={{ padding: 20 }}>
        <h3>Todas las publicaciones</h3>
        <PublicationList />
      </main>
    </>
  );
}
