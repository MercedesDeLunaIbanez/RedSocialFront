import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";


export default function GetPublication({ authorName, text, createDate }) {
  const { user } = useAuth();
  const navigate = useNavigate();


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
        — {new Date(createDate).toLocaleString()}
      </p>
      <p>{text}</p>


      {user?.username === authorName && (
        <button style={{ color: "red" }}>Borrar publicación</button>
      )}
    </div>
  );
}
