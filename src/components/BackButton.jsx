import { useNavigate } from "react-router-dom";

function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      style={{
        marginBottom: "15px",
        padding: "8px 16px",
        borderRadius: "8px",
        border: "none",
        backgroundColor: "#0f172a",
        color: "#fff",
        cursor: "pointer",
        fontSize: "14px",
      }}
    >
      ← Back
    </button>
  );
}

export default BackButton;
