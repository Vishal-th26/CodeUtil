import "./Panel.css";

export default function Panel({ method, path, children }) {
  return (
    <section className="panel">
      <div className="panel-bar">
        <span className="dot r" />
        <span className="dot y" />
        <span className="dot g" />
        <span className="panel-title mono">
          <span className="panel-method">{method}</span> {path}
        </span>
      </div>
      <div className="panel-body">{children}</div>
    </section>
  );
}
