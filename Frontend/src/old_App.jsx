import { useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import TopBar from "./components/TopBar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import SignupView from "./views/SignupView";
import LoginView from "./views/LoginView";
import UploadView from "./views/UploadView";
import AskView from "./views/AskView";
import VivaView from "./views/VivaView";
import StatusView from "./views/StatusView";
import "./App.css";

function Shell() {
  const { isAuthed } = useApp();
  const [view, setView] = useState("signup");
  const [sessionActive, setSessionActive] = useState(false);

  function goTo(next) {
    setView(next);
  }

  return (
    <div className="shell-root">
      <TopBar />
      <div className="shell">
        <Sidebar view={view} setView={goTo} isAuthed={isAuthed} />
        <main className="content">
          {view === "signup" && <SignupView onDone={() => goTo("login")} />}
          {view === "login" && <LoginView onSuccess={() => goTo("upload")} />}
          {view === "upload" && isAuthed && <UploadView />}
          {view === "ask" && isAuthed && <AskView />}
          {view === "viva" && isAuthed && <VivaView />}
          {view === "status" && isAuthed && <StatusView onSessionChange={setSessionActive} />}
          {!isAuthed && ["upload", "ask", "viva", "status"].includes(view) && (
            <LoginView onSuccess={() => goTo("upload")} />
          )}
        </main>
      </div>
      <Footer sessionActive={sessionActive} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
