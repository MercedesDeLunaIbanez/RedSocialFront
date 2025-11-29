import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

/**
 * Modal reutilizable que muestra una lista de usuarios enlazables.
 * Redirige a /me si el usuario listado coincide con el logueado.
 *
 * @param {object} props - Propiedades del componente.
 * @param {string} props.title - Titulo del modal (ej: "Seguidores").
 * @param {Array<{username: string}>} props.users - Lista de usuarios a mostrar.
 * @param {Function} props.onClose - Funcion para cerrar el modal.
 * @returns {JSX.Element} Ventana modal con enlaces de usuario.
 */
export default function UserListModal({ title, users, onClose }) {
  const { user: loggedInUser } = useAuth();

  /**
   * Evita que el click dentro del contenido cierre el modal.
   *
   * @param {React.MouseEvent} e - Evento de click del contenedor interno.
   */
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
