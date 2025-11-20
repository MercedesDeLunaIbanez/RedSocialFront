// src/components/UserListModal.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

/**
 * Componente modal reutilizable para mostrar una lista de usuarios.
 * Redirige a /me si el usuario es el logueado.
 *
 * @param {object} props
 * @param {string} props.title - Título del modal (ej: "Seguidores")
 * @param {Array} props.users - Array de objetos de usuario (deben tener .username)
 * @param {Function} props.onClose - Función para cerrar el modal
 */
export default function UserListModal({ title, users, onClose }) {
  const { user: loggedInUser } = useAuth();

  const handleModalContentClick = (e) => e.stopPropagation();

  return (
    <div className="userlist-modal-backdrop" onClick={onClose}>
      <div className="userlist-modal-content" onClick={handleModalContentClick}>
        <div className="userlist-modal-header">
          <h3 className="userlist-modal-title">{title}</h3>
          <button className="userlist-modal-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="userlist-modal-body">
          {users.length > 0 ? (
            <ul>
              {users.map((u) => {
                const profileLink =
                  u.username === loggedInUser?.username
                    ? "/me"
                    : `/profile/${u.username}`;
                return (
                  <li key={u.username}>
                    <Link to={profileLink} onClick={onClose}>
                      {u.username}
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>No hay usuarios para mostrar.</p>
          )}
        </div>
      </div>
    </div>
  );
}
