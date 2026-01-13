import { Link, useNavigate } from "react-router";

interface NavbarProps {
  theme: "light" | "dark";
}

const Navbar = ({ theme }: NavbarProps) => {
  const navigate = useNavigate();

  const isDark = theme === "dark";
  const bgColor = isDark ? "#333" : "#fff";
  const textColor = isDark ? "#fff" : "#333";
  const buttonBg = isDark ? "#555" : "#e0e0e0";

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        padding: "1rem",
        backgroundColor: bgColor,
        color: textColor,
        gap: "20px",
        borderBottom: `1px solid ${isDark ? "#444" : "#ddd"}`,
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <button
        onClick={() => navigate(-1)}
        style={{
          padding: "5px 10px",
          cursor: "pointer",
          backgroundColor: buttonBg,
          color: textColor,
          border: "none",
          borderRadius: "4px",
        }}
      >
        &#8592; Back
      </button>

      <div style={{ display: "flex", gap: "15px" }}>
        <Link to="/" style={{ color: textColor, textDecoration: "none" }}>
          Home
        </Link>
        <Link
          to="/remote1"
          style={{ color: textColor, textDecoration: "none" }}
        >
          Remote 1 (Button)
        </Link>
        <Link
          to="/remote2/cart"
          style={{ color: textColor, textDecoration: "none" }}
        >
          Remote 2 (Cart)
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
