// src/pages/ProfilePage.jsx
import Header from "../components/Header";
import ProfilePublication from "../components/ProfilePublication";
import UserProfile from "../components/UserProfile";


export default function ProfilePage() {
  return (
    <>
      <Header />
      <main style={{ padding: 20 }}>
        <UserProfile />
        <ProfilePublication />
      </main>
    </>
  );
}
