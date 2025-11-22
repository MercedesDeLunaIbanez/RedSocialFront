import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { apiFetch } from "../api/client";

// ---- GSAP ----
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
// ScrollTrigger YA está registrado en main.jsx

export default function GetPublication({ id, authorName, text, createDate }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const cardRef = useRef(null);

  // --- Mutación para borrar ---
  const deleteMutation = useMutation({
    mutationFn: async () => {
      await apiFetch(`/publications/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0]?.includes("/publications"),
      });
    },
    onError: (error) => {
      alert(`Error al borrar publicación: ${error.message}`);
    },
  });

  const handleDelete = () => {
    if (window.confirm("¿Seguro que quieres borrar esta publicación?")) {
      deleteMutation.mutate();
    }
  };

  const handleAuthorClick = () => {
    if (user?.username === authorName) navigate("/me");
    else navigate(`/profile/${authorName}`);
  };

  // --- ANIMACIÓN GSAP + ScrollTrigger + CLEANUP ---
  useEffect(() => {
    const el = cardRef.current;

    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 90%",
        once: true
      }
    });

    // Cleanup para evitar animaciones duplicadas
    return () => {
      gsap.killTweensOf(el);
    };
  }, []);

  return (
    <div className="publication-card" ref={cardRef}>
      <p className="publication-author">
        <strong className="author-link" onClick={handleAuthorClick}>
          {authorName}
        </strong>{" "}
        — {new Date(createDate).toLocaleString("es-ES", { timeZone: "Europe/Madrid" })}
      </p>

      <p className="publication-text">{text}</p>

      {user?.username === authorName && (
        <button
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
          className="publication-delete-button"
        >
          {deleteMutation.isPending ? "Borrando..." : "Borrar publicación"}
        </button>
      )}
    </div>
  );
}
