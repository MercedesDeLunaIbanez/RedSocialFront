// src/App.jsx
// Aquí configuramos la navegación general de la app.
// Dependemos del contexto de autenticación para saber si el usuario tiene token.

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/useAuth";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import HomePage from "./pages/HomePage";
import AllPublicationsPage from "./pages/AllPublicationsPage";
import MyProfilePage from "./pages/MyProfilePage";
import ProfilePage from "./pages/ProfilePage";


export default function App() {
  const { isAuthenticated } = useAuth();


  return (
    <Router>
      <Routes>
        {/* Si NO está logueado, sólo puede ver la ruta "/" (login) */}
        {!isAuthenticated ? (
          <>
            <Route path="/" element={<AuthPage />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          <>
            {/* Rutas privadas */}
            <Route path="/" element={<HomePage />} />
            <Route path="/all" element={<AllPublicationsPage />} />
            <Route path="/me" element={<MyProfilePage />} />
            <Route path="/profile/:name" element={<ProfilePage />} />
            {/* Cualquier otra ruta redirige a la principal */}
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </Router>
  );
}


/**
 * Página inicial cuando no hay sesión iniciada.
 * Muestra login y registro.
 */
function AuthPage() {
  return (
    <main style={{ maxWidth: 500, margin: "40px auto" }}>
      <h2>Bienvenida a MiniRed</h2>
      <LoginForm />
    </main>
  );
}
