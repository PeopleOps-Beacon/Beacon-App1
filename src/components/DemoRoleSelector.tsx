import { UserCog } from "lucide-react";
import { useUserRole } from "../hooks/useUserRole";
import { type UserRole, userRoleDescriptions, userRoleLabels, userRoles } from "../types/UserRole";

export function DemoRoleSelector() {
  const { role, roleDescription, setRole } = useUserRole();

  return (
    <section className="role-selector" aria-labelledby="role-selector-title">
      <div className="panel-heading">
        <UserCog aria-hidden="true" />
        <div>
          <p className="eyebrow">Role</p>
          <h2 id="role-selector-title">Demo role selector</h2>
        </div>
      </div>
      <label>
        Active role
        <select onChange={(event) => setRole(event.target.value as UserRole)} value={role}>
          {userRoles.map((availableRole) => (
            <option key={availableRole} value={availableRole}>
              {userRoleLabels[availableRole]}
            </option>
          ))}
        </select>
      </label>
      <p>{roleDescription}</p>
      <div className="role-pill-grid">
        {userRoles.map((availableRole) => (
          <button
            aria-pressed={role === availableRole}
            className={role === availableRole ? "active" : ""}
            key={availableRole}
            onClick={() => setRole(availableRole)}
            title={userRoleDescriptions[availableRole]}
            type="button"
          >
            {userRoleLabels[availableRole]}
          </button>
        ))}
      </div>
    </section>
  );
}
