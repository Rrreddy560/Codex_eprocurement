import { FormEvent, useMemo, useState } from "react";
import { ManagementPanel } from "./pages/ManagementPanel";
import { MessManagerPanel } from "./pages/MessManagerPanel";
import { SupplierPanel } from "./pages/SupplierPanel";
import type { Role } from "./types/role";
import "./styles.css";

interface DemoUser {
  username: string;
  password: string;
  role: Role;
  label: string;
}

const DOMAIN = "@nitj.ac.in";

const demoUsers: DemoUser[] = [
  { username: "mess.manager", password: "Mess@123", role: "mess_manager", label: "Mess Manager" },
  { username: "management.dean", password: "Manage@123", role: "management", label: "Management" },
  { username: "supplier.demo", password: "Supplier@123", role: "supplier", label: "Supplier" },
];

export default function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [activeUser, setActiveUser] = useState<DemoUser | null>(null);
  const [error, setError] = useState("");

  const currentPanel = useMemo(() => {
    if (!activeUser) return null;
    if (activeUser.role === "management") return <ManagementPanel user={activeUser.username} />;
    if (activeUser.role === "supplier") return <SupplierPanel user={activeUser.username} />;
    return <MessManagerPanel user={activeUser.username} />;
  }, [activeUser]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const sanitized = username.trim().toLowerCase();

    if (!/^[a-z0-9.]+$/.test(sanitized)) {
      setError("Use only lowercase letters, numbers, and dots in username.");
      return;
    }

    const foundUser = demoUsers.find((item) => item.username === sanitized && item.password === password);

    if (!foundUser) {
      setError("Invalid demo credentials. Please use one of the demo accounts.");
      return;
    }

    setError("");
    setActiveUser(foundUser);
  };

  const signOut = () => {
    setActiveUser(null);
    setPassword("");
    setError("");
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-wrap">
          <div className="brand-icon">🏛️</div>
          <h1>e-Procurement DSS</h1>
        </div>
        {activeUser ? (
          <button className="ghost-btn" onClick={signOut}>
            Sign Out
          </button>
        ) : null}
      </header>

      {!activeUser ? (
        <main className="signin-layout">
          <section className="signin-card">
            <div className="logo-pill">🏛️</div>
            <h2>Sign In</h2>
            <p className="subtitle">Access the e-Procurement Decision Support System</p>

            <form onSubmit={handleSubmit}>
              <label htmlFor="username">Username</label>
              <div className="input-row">
                <input
                  id="username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="e.g. mess.manager"
                  required
                />
                <span>{DOMAIN}</span>
              </div>

              <label htmlFor="password">Password</label>
              <div className="input-row plain">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button type="button" className="toggle-btn" onClick={() => setShowPassword((value) => !value)}>
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {error ? <p className="error">{error}</p> : null}
              <button className="primary-btn" type="submit">
                Sign In
              </button>
            </form>

            <div className="divider" />
            <h3>Demo Accounts</h3>
            <div className="demo-grid">
              {demoUsers.map((account) => (
                <button
                  key={account.username}
                  type="button"
                  className="demo-account"
                  onClick={() => {
                    setUsername(account.username);
                    setPassword(account.password);
                    setError("");
                  }}
                >
                  <strong>{account.username}</strong>
                  <small>{account.password}</small>
                </button>
              ))}
            </div>
          </section>
        </main>
      ) : (
        <main className="dashboard-layout">
          <div className="welcome-card">
            <h2>Welcome, {activeUser.label}</h2>
            <p>
              Logged in as <strong>{activeUser.username}{DOMAIN}</strong>
            </p>
          </div>
          {currentPanel}
        </main>
      )}
    </div>
  );
}
