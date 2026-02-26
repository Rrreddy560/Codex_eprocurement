interface Props {
  user: string;
}

export function ManagementPanel({ user }: Props) {
  return (
    <section className="role-page">
      <h3>Management Admin Panel</h3>
      <p>{user}@nitj.ac.in can control edits, review approvals, and audit supplier actions.</p>
      <div className="role-cards">
        <article>
          <h4>Approval Queue</h4>
          <p>Review incoming requests from mess managers and make decisions.</p>
        </article>
        <article>
          <h4>Edit Controls</h4>
          <p>Approve change requests and lock records after final validation.</p>
        </article>
        <article>
          <h4>Audit Logs</h4>
          <p>Track all system actions for governance and compliance checks.</p>
        </article>
      </div>
    </section>
  );
}
