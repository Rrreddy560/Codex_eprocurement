import type { Role } from "../types/role";

interface Props {
  role: Role;
  setRole: (role: Role) => void;
}

const roles: Role[] = ["mess_manager", "management", "supplier"];

export function RoleSwitcher({ role, setRole }: Props) {
  return (
    <section>
      <h3>Active Role</h3>
      <div style={{ display: "flex", gap: 8 }}>
        {roles.map((item) => (
          <button key={item} onClick={() => setRole(item)} disabled={item === role}>
            {item}
          </button>
        ))}
      </div>
    </section>
  );
}
