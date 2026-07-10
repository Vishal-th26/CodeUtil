import "./Footer.css";

export default function Footer({ sessionActive }) {
  return (
    <footer className="app-footer">
      <span>codeutil frontend</span>
      <span className="mono">
        session: <b className={sessionActive ? "on" : ""}>{sessionActive ? "active" : "none"}</b>
      </span>
    </footer>
  );
}
