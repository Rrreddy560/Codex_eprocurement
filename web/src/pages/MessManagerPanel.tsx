interface Props {
  user: string;
}

export function MessManagerPanel({ user }: Props) {
  return (
    <section className="role-page">
      <h3>Mess Manager Workspace</h3>
      <p>{user}@nitj.ac.in can create daily/weekly requirement requests for approval.</p>
      <div className="role-cards">
        <article>
          <h4>Create Demand</h4>
          <p>Submit quantity and item details for mess operations.</p>
        </article>
        <article>
          <h4>Track Approvals</h4>
          <p>Monitor requests in submitted, approved, and rejected state.</p>
        </article>
      </div>
    </section>
  );
}
