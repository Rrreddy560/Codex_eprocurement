interface Props {
  user: string;
}

export function SupplierPanel({ user }: Props) {
  return (
    <section className="role-page">
      <h3>Supplier Workspace</h3>
      <p>{user}@nitj.ac.in can view approved requirements and submit bids.</p>
      <div className="role-cards">
        <article>
          <h4>Open Requirements</h4>
          <p>See approved tenders available for vendor participation.</p>
        </article>
        <article>
          <h4>Bid Submission</h4>
          <p>Submit price and delivery timeline for each requirement.</p>
        </article>
      </div>
    </section>
  );
}
