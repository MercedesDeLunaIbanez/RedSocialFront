import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { apiFetch } from "../api/client";


export default function GetPublication({ id, authorName, text, createDate }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();


  // 🔥 Configuramos la mutación DELETE
  const deleteMutation = useMutation({
    mutationFn: async () => {
      await apiFetch(`/publications/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      // Invalida el listado de publicaciones para refrescarlo
     queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0]?.includes("/publications"),
      });
    },
    onError: (error) => {
      alert(`Error al borrar publicación: ${error.message}`);
    },
  });


  // 🔥 Handler para el click
  const handleDelete = () => {
    if (window.confirm("¿Seguro que quieres borrar esta publicación?")) {
      deleteMutation.mutate();
    }
  };


  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "10px",
        padding: "15px",
        marginBottom: "10px",
        backgroundColor: "#fafafa",
      }}
    >
      <p>
        <strong
          style={{ cursor: "pointer", color: "blue" }}
          onClick={() => navigate(`/profile/${authorName}`)}
        >
          {authorName}
        </strong>{" "}
        — {new Date(createDate).toLocaleString("es-ES", { timeZone: "Europe/Madrid" })}
      </p>


      <p>{text}</p>


      {/* Solo el autor puede borrar */}
      {user?.username === authorName && (
        <button
          style={{
            color: "white",
            backgroundColor: "#dc3545",
            border: "none",
            borderRadius: "5px",
            padding: "5px 10px",
            cursor: "pointer",
          }}
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
        >
          {deleteMutation.isPending ? "Borrando..." : "Borrar publicación"}
        </button>
      )}
    </div>
  );
}
