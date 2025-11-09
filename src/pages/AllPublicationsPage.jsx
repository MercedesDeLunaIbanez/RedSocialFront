// src/pages/AllPublicationsPage.jsx
import Header from "../components/Header";
import PublicationList from "../components/PublicationList"



export default function AllPublicationsPage() {
  return (
    <>
      <Header />
      <main style={{ padding: 20 }}>
        <h3>Todas las publicaciones</h3>
        <PublicationList />
      </main>
    </>
  );
}
