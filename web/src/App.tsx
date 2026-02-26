import { useMemo, useState } from "react";
import { RoleSwitcher } from "./components/RoleSwitcher";
import { ManagementPanel } from "./pages/ManagementPanel";
import { MessManagerPanel } from "./pages/MessManagerPanel";
import { SupplierPanel } from "./pages/SupplierPanel";
import type { Role } from "./types/role";

export default function App() {
  const [role, setRole] = useState<Role>("mess_manager");

  const panel = useMemo(() => {
    if (role === "management") return <ManagementPanel />;
    if (role === "supplier") return <SupplierPanel />;
    return <MessManagerPanel />;
  }, [role]);

  return (
    <main style={{ maxWidth: 1000, margin: "24px auto", fontFamily: "Arial, sans-serif" }}>
      <h1>E-Procurement DSS (TypeScript)</h1>
      <p>Role-based access for Mess Manager, Management, and Supplier with admin controls in Management.</p>
      <RoleSwitcher role={role} setRole={setRole} />
      <hr />
      {panel}
    </main>
  );
}
