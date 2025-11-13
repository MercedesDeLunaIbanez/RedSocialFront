// src/pages/AllPublicationsPage.jsx
import CreatePublication from "../components/CreatePublication";
import Header from "../components/Header";
import PublicationList from "../components/PublicationList"



/**
 * Página que muestra todas las publicaciones con paginación.
 * La página contiene un formulario para crear una nueva publicación.
 * La lista de publicaciones se puede paginar con botones "Anterior" y "Siguiente".
 * Si no hay publicaciones, se muestra un mensaje "No hay publicaciones disponibles.".
 * Si ocurre un error, se muestra un mensaje de error en rojo.
 * La lista se actualiza automáticamente cuando se crea o se borra una publicación.
 * @returns {JSX.Element} Un componente que muestra la lista de todas las publicaciones con paginación.
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
