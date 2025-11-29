import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import App from "./App";
import "./global.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Registro unico del plugin de scroll para que las animaciones usen ScrollTrigger.
gsap.registerPlugin(ScrollTrigger);

// Cliente compartido de React Query para cache y gestion de peticiones.
const queryClient = new QueryClient();

/**
 * Punto de entrada de la aplicacion.
 * Envuelve la app con React Query y el provider de autenticacion antes de montar en el DOM.
 */
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
