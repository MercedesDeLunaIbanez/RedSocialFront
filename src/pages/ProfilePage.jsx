// src/pages/ProfilePage.jsx
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import ProfilePublication from "../components/ProfilePublication";


export default function ProfilePage() {
  const { name } = useParams();
  return (
    <>
      <Header />
      <main style={{ padding: 20 }}>
        <h3>Perfil de {name}</h3>
        <p>Aquí se mostrarán sus publicaciones.</p>
        <ProfilePublication />
      </main>
    </>
  );
}
