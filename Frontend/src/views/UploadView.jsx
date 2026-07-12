import { useRef, useState } from "react";
import Panel from "../components/Panel";
import IndexVisualizer from "../components/IndexVisualizer";
import { useApp } from "../context/AppContext";
import { ApiError } from "../api/client";
import "./UploadView.css";

export default function UploadView() {
  const { api } = useApp();
  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState(null);
  const [indexing, setIndexing] = useState(false);
  const [justIndexed, setJustIndexed] = useState(false);
  const inputRef = useRef(null);

  function addFiles(fileList) {
    const incoming = Array.from(fileList).filter((f) => f.name.endsWith(".py"));
    if (!incoming.length) return;
    setFiles((prev) => {
      const existing = new Set(prev.map((f) => f.name + f.size));
      const merged = [...prev];
      incoming.forEach((f) => {
        if (!existing.has(f.name + f.size)) merged.push(f);
      });
      return merged;
    });
  }

  function removeFile(name) {
    setFiles((prev) => prev.filter((f) => f.name !== name));
  }

  async function handleUpload() {
    if (!files.length) {
      setStatus({ ok: false, message: "Add at least one .py file." });
      return;
    }
    setIndexing(true);
    setJustIndexed(false);
    setStatus(null);
    try {
      const data = await api.uploadFiles(files);
      setStatus({ ok: true, message: data?.message || "Codebase indexed." });
      setFiles([]);
      setJustIndexed(true);
    } catch (err) {
      setStatus({ ok: false, message: err instanceof ApiError ? err.message : "Upload failed." });
    } finally {
      setIndexing(false);
    }
  }

  return (
    <Panel method="POST" path="/codebase/upload">
      <h1>
        index a codebase<span className="blink-cursor" />
      </h1>
      <p className="subtitle">
        .py files only. Each one is parsed, chunked, embedded, and dropped into FAISS + BM25.
      </p>

      <div
        className={"drop-zone" + (dragging ? " drag" : "")}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
      >
        <span className="drop-zone-icon mono">.py</span>
        drop files here, or click to browse
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".py"
          hidden
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {files.length > 0 && (
        <ul className="file-list mono">
          {files.map((f) => (
            <li key={f.name + f.size}>
              <span>
                <span className="tag">.py</span> {f.name}
              </span>
              <span className="file-list-right">
                {Math.ceil(f.size / 1024)} kb
                <button
                  type="button"
                  className="file-remove"
                  aria-label={`Remove ${f.name}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(f.name);
                  }}
                >
                  +
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="row">
        <button className="btn" onClick={handleUpload} disabled={indexing}>
          {indexing ? "indexingG" : "upload & index"}
        </button>
      </div>

      <div className="upload-viz">
        <IndexVisualizer
          active={indexing}
          filledRatio={justIndexed ? 1 : 0}
          label={indexing ? "parsing -+ chunking -+ embedding" : justIndexed ? "index updated" : "idle"}
        />
      </div>

      {status && <div className={"out " + (status.ok ? "ok" : "err")}>{status.message}</div>}
    </Panel>
  );
}
