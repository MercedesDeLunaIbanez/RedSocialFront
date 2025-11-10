// src/pages/MyProfilePage.jsx
import Header from "../components/Header";
import MyPublication from "../components/MyPublication"
import MyUserProfile from "../components/MyUserProfile";


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
