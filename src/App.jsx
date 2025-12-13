import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import HomePage from "./pages/HomePage";
import AllPublicationsPage from "./pages/AllPublicationsPage";
import MyProfilePage from "./pages/MyProfilePage";
import ProfilePage from "./pages/ProfilePage";

/**
 * Enrutador principal de la aplicacion.
 * Muestra rutas publicas o privadas segun el estado de autenticacion.
 *
 * @returns {JSX.Element} Definicion de rutas de la aplicacion.
 */
export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        {!isAuthenticated ? (
          <>
            <Route path="/" element={<AuthPage />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          <>
            <Route path="/" element={<HomePage />} />
            <Route path="/all" element={<AllPublicationsPage />} />
            <Route path="/me" element={<MyProfilePage />} />
            <Route path="/profile/:name" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

/**
 * Pantalla publica de autenticacion.
 * Muestra el formulario de login.
 *
 * @returns {JSX.Element} Vista de acceso.
 */
function AuthPage() {
  return <LoginForm />;
}
