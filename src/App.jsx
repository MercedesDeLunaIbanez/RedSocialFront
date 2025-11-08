import { useAuth } from "./context/useAuth";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";


export default function App() {
  const { token, logout } = useAuth();

  if (!token) {
    return (
      <main style={{ maxWidth: 500, margin: "auto" }}>
        <h2>Bienvenida a MiniRed</h2>
        <LoginForm />
        <hr />
        <RegisterForm />
      </main>
    );
  }


  return (
    <main style={{ maxWidth: 720, margin: "20px auto" }}>
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>MiniRed</h2>
        <button onClick={logout}>Cerrar sesión</button>
      </header>


      <PublicationsList />
    </main>
  );
}
