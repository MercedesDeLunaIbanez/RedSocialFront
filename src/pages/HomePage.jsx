// src/pages/HomePage.jsx
import Header from "../components/Header";
import PublicationFollowing from "../components/PublicationFollowing";



export default function HomePage() {
  return (
    <>
      <Header />
      <main style={{ padding: 20 }}>
        <h3>Publicaciones de tus seguidos</h3>
        <PublicationFollowing />
      </main>
    </>
  );
}
